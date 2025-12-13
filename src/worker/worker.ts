import { prisma } from "../db/prisma";
import { JobStatus } from "@prisma/client";
import axios from "axios";
import nodemailer from "nodemailer";

console.log("🚀 Worker started");

/**
 * Executes a single job safely
 */
async function executeJob(jobId: string) {
  const job = await prisma.job.findUnique({
    where: { id: jobId }
  });

  if (!job) return;

  try {
    console.log(`📦 Executing job: ${job.name}`);

    await prisma.job.update({
      where: { id: job.id },
      data: { status: JobStatus.RUNNING }
    });

    // ---- WEBHOOK JOB ----
    if (job.jobType === "WEBHOOK") {
      console.log("🌐 Webhook URL:", job.webhookUrl);

      await axios({
        method: job.webhookMethod || "POST",
        url: job.webhookUrl!
      });
    }

    // ---- EMAIL JOB ----
    if (job.jobType === "EMAIL") {
      const settings = await prisma.setting.findUnique({
        where: { userId: job.userId }
      });

      if (!settings) {
        throw new Error("SMTP settings not found for user");
      }

      console.log("✉️ Email SMTP Host:", settings.smtpHost);
      console.log("✉️ Sending email to:", job.emailTo);

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
        to: job.emailTo!,
        subject: job.emailSubject!,
        text: job.emailBody!
      });
    }

    await prisma.job.update({
      where: { id: job.id },
      data: { status: JobStatus.COMPLETED }
    });

    console.log(`✅ Job completed: ${job.name}`);
  } catch (err) {
    console.error(`❌ Job failed: ${job.name}`, err);

    await prisma.job.update({
      where: { id: job.id },
      data: { status: JobStatus.FAILED }
    });
  }
}

/**
 * Schedules a job exactly once
 * Past jobs run immediately
 */
function scheduleJob(job: any) {
  const delay = new Date(job.nextRunAt).getTime() - Date.now();
  const safeDelay = Math.max(delay, 0); // 👈 past jobs run immediately

  console.log(`⏱ Scheduling job "${job.name}" in ${safeDelay} ms`);

  setTimeout(() => {
    executeJob(job.id);
  }, safeDelay);
}

/**
 * Picks ONLY PENDING jobs and locks them
 */
async function bootstrapScheduler() {
  const jobs = await prisma.job.findMany({
    where: { status: JobStatus.PENDING }
  });

  console.log(`🔁 Bootstrapping ${jobs.length} jobs`);

  for (const job of jobs) {
    // 🔐 Lock job so it is scheduled ONLY ONCE
    await prisma.job.update({
      where: { id: job.id },
      data: { status: JobStatus.SCHEDULED }
    });

    scheduleJob(job);
  }
}

// ---- START WORKER ----
bootstrapScheduler().catch(console.error);

// ---- PERIODIC REFRESH (safe because jobs are locked) ----
setInterval(() => {
  bootstrapScheduler().catch(console.error);
}, 30_000);
