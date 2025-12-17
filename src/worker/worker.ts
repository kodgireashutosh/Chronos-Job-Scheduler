import { Worker, QueueEvents } from "bullmq";
import { redis } from "../queue/redis";
import { prisma } from "../db/prisma";
import axios from "axios";
import nodemailer from "nodemailer";
import { deadLetterQueue } from "../queue/job.queue";

console.log("Worker started (BullMQ)");

interface JobPayload {
  jobId: string;
}

new Worker(
  "chronos-jobs",
  async (bullJob) => {
    const { jobId } = bullJob.data as JobPayload;

    if (!jobId) {
      console.warn(" Missing jobId in payload");
      return;
    }

    // 1️⃣ Fetch DB job
    const dbJob = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!dbJob) {
      console.warn("Job not found in DB:", jobId);
      return;
    }

    const startedAt = new Date();

    try {
      await prisma.job.update({
        where: { id: jobId },
        data: { status: "RUNNING" },
      });

    
      if (dbJob.jobType === "WEBHOOK") {
        if (!dbJob.webhookUrl) {
          throw new Error("Webhook URL missing");
        }

        console.log("Sending webhook:", dbJob.webhookUrl);

        await axios({
          url: dbJob.webhookUrl,
          method: dbJob.webhookMethod || "POST",
        });
      }

    
      if (dbJob.jobType === "EMAIL") {
        const settings = await prisma.setting.findFirst({
          where: { userId: dbJob.userId },
        });

        if (!settings) {
          throw new Error("SMTP settings not found for user");
        }

        const transport = nodemailer.createTransport({
          host: settings.smtpHost,
          port: settings.smtpPort,
          secure: settings.smtpPort === 465,
          auth: {
            user: settings.smtpUser,
            pass: settings.smtpPassword,
          },
        });

        await transport.sendMail({
          from: settings.smtpFrom,
          to: dbJob.emailTo!,
          subject: dbJob.emailSubject!,
          text: dbJob.emailBody!,
        });
      }

      await prisma.job.update({
        where: { id: jobId },
        data: { status: "COMPLETED" },
      });

      await prisma.jobExecution.create({
        data: {
          jobId,
          status: "SUCCESS",
          attempt: bullJob.attemptsMade + 1,
          startedAt,
          endedAt: new Date(),
        },
      });

      console.log(`Job completed: ${dbJob.name}`);
    } catch (err: any) {
      const updatedJob = await prisma.job.update({
        where: { id: jobId },
        data: {
          status: "FAILED",
          retries: { increment: 1 },
        },
      });

      await prisma.jobExecution.create({
        data: {
          jobId,
          status: "FAILURE",
          attempt: bullJob.attemptsMade + 1,
          output: err.message,
          startedAt,
          endedAt: new Date(),
        },
      });

      if (
        updatedJob.scheduleType === "CRON" &&
        updatedJob.retries >= updatedJob.maxRetries
      ) {
        await prisma.job.update({
          where: { id: jobId },
          data: { status: "CANCELLED" },
        });

        console.log(
          `CRON job cancelled after ${updatedJob.retries} failures: ${updatedJob.name}`
        );

        return;
      }

      console.error(`Job failed: ${dbJob.name}`, err.message);
      throw err; // REQUIRED for BullMQ retry + DLQ
    }
  },
  {
    connection: redis,
    concurrency: 5,
  }
);

const events = new QueueEvents("chronos-jobs", {
  connection: redis,
});

events.on("failed", async ({ jobId, failedReason }) => {
  console.error("Job moved to DLQ:", jobId, failedReason);

  await deadLetterQueue.add("dead", {
    jobId,
    reason: failedReason,
    failedAt: new Date(),
  });
});
