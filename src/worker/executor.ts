import axios from "axios";
import nodemailer from "nodemailer";
import { prisma } from "../db/prisma";

export async function execute(jobId: string) {
  console.log("⚙️ Executing job:", jobId);

  const job = await prisma.job.findUnique({
    where: { id: jobId }
  });

  if (!job) {
    console.error("❌ Job not found:", jobId);
    return;
  }

  console.log("👤 Job userId:", job.userId);
  console.log("📌 Job type:", job.jobType);

  const settings = await prisma.setting.findUnique({
    where: { userId: job.userId }
  });

  if (!settings) {
    console.error("❌ SMTP settings not found for user:", job.userId);
    throw new Error("SMTP settings missing");
  }

  console.log("📧 Using SMTP:", {
    host: settings.smtpHost,
    port: settings.smtpPort,
    user: settings.smtpUser,
    from: settings.smtpFrom
  });

  const startedAt = new Date();

  try {
    if (job.jobType === "WEBHOOK") {
      console.log("🌐 Sending webhook to:", job.webhookUrl);

      await axios({
        url: job.webhookUrl!,
        method: job.webhookMethod || "POST"
      });
    }

    if (job.jobType === "EMAIL") {
      console.log("✉️ Sending email to:", job.emailTo);

      const transport = nodemailer.createTransport({
        host: settings.smtpHost,
        port: settings.smtpPort,
        secure: settings.smtpPort === 465, // important
        auth: {
          user: settings.smtpUser,
          pass: settings.smtpPassword
        }
      });

      await transport.sendMail({
        from: settings.smtpFrom,
        to: job.emailTo!,
        subject: job.emailSubject!,
        text: job.emailBody!
      });
    }

    await prisma.jobExecution.create({
      data: {
        jobId,
        status: "SUCCESS",
        startedAt,
        endedAt: new Date(),
        attempt: job.retries
      }
    });

    console.log("✅ Job success:", jobId);
  } catch (err: any) {
    console.error("❌ Job failed:", err.message);

    await prisma.jobExecution.create({
      data: {
        jobId,
        status: "FAILURE",
        startedAt,
        endedAt: new Date(),
        output: err.message,
        attempt: job.retries
      }
    });

    throw err;
  }
}
