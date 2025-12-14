import { Worker } from "bullmq";
import { redis } from "../queue/redis";
import { prisma } from "../db/prisma";
import axios from "axios";
import nodemailer from "nodemailer";

console.log("🚀 Worker started (BullMQ)");

new Worker(
  "chronos-jobs",
  async job => {
    const { jobId } = job.data;

    const dbJob = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!dbJob) return;

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

      // ✉️ EMAIL (USER-SCOPED SMTP — SAFE MODE)
      if (dbJob.jobType === "EMAIL") {
        const allSettings = await prisma.setting.findMany();

        const settings = allSettings.find(
          s => (s as any).userId === dbJob.userId
        );

        if (!settings) {
          throw new Error("SMTP settings missing for user");
        }

        const transport = nodemailer.createTransport({
          host: settings.smtpHost,
          port: settings.smtpPort,
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

      console.log(`✅ Job completed: ${dbJob.name}`);
    } catch (err: any) {
      await prisma.job.update({
        where: { id: jobId },
        data: {
          status: "FAILED",
          retries: { increment: 1 }
        }
      });

      console.error(`❌ Job failed: ${dbJob.name}`, err.message);

      throw err; // REQUIRED → BullMQ retry + DLQ
    }
  },
  { connection: redis }
);
