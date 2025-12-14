import { Worker, QueueEvents } from "bullmq";
import { redis } from "../queue/redis";
import { prisma } from "../db/prisma";
import axios from "axios";
import nodemailer from "nodemailer";
import { deadLetterQueue } from "../queue/job.queue";

console.log("🚀 Worker started (BullMQ)");

new Worker(
  "chronos-jobs",
  async bullJob => {
    const { jobId } = bullJob.data as { jobId: string };

    const dbJob = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!dbJob) return;

    const startedAt = new Date();

    try {
      await prisma.job.update({
        where: { id: jobId },
        data: { status: "RUNNING" }
      });

      // 🌐 WEBHOOK
      if (dbJob.jobType === "WEBHOOK") {
        await axios({
          url: dbJob.webhookUrl!,
          method: dbJob.webhookMethod || "POST"
        });
      }

      // ✉️ EMAIL (USER-SCOPED SMTP)
      if (dbJob.jobType === "EMAIL") {
        const settings = await prisma.setting.findFirst();

        if (!settings || settings.userId !== dbJob.userId) {
          throw new Error("SMTP settings not found for user");
        }

        const transport = nodemailer.createTransport({
          host: settings.smtpHost,
          port: settings.smtpPort,
          secure: settings.smtpPort === 465,
          auth: {
            user: settings.smtpUser,
            pass: settings.smtpPassword
          }
        });

        await transport.sendMail({
          from: settings.smtpFrom,
          to: dbJob.emailTo!,
          subject: dbJob.emailSubject!,
          text: dbJob.emailBody!
        });
      }

      await prisma.job.update({
        where: { id: jobId },
        data: { status: "COMPLETED" }
      });

      await prisma.jobExecution.create({
        data: {
          jobId,
          status: "SUCCESS",
          attempt: bullJob.attemptsMade + 1,
          startedAt,
          endedAt: new Date()
        }
      });

      console.log(`✅ Job completed: ${dbJob.name}`);
    } catch (err: any) {
      await prisma.job.update({
        where: { id: jobId },
        data: {
          status: "FAILED",
          retries: { increment: 1 }
        }
      });

      await prisma.jobExecution.create({
        data: {
          jobId,
          status: "FAILURE",
          attempt: bullJob.attemptsMade + 1,
          output: err.message,
          startedAt,
          endedAt: new Date()
        }
      });

      throw err; // REQUIRED for BullMQ retry & DLQ
    }
  },
  { connection: redis }
);

// ☠️ DEAD LETTER QUEUE
const events = new QueueEvents("chronos-jobs", { connection: redis });

events.on("failed", async ({ jobId, failedReason }) => {
  await deadLetterQueue.add("dead", {
    jobId,
    reason: failedReason
  });
});
