import { Response } from "express";
import { prisma } from "../db/prisma";
import { ScheduleType, JobType } from "@prisma/client";

export async function createJob(req: any, res: Response) {
  const { name, scheduleType, runAt, cron, jobType, payload } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthenticated user" });
  }

  if (!name || !scheduleType || !jobType || !payload) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // ✅ VALIDATE USER EXISTS (THIS IS THE KEY FIX)
  const userExists = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!userExists) {
    return res.status(400).json({ message: "Invalid user" });
  }

  // Job-type validation
  if (jobType === "WEBHOOK" && (!payload.url || !payload.method)) {
    return res.status(400).json({ message: "Webhook requires url and method" });
  }

  if (jobType === "EMAIL" && (!payload.to || !payload.subject || !payload.body)) {
    return res.status(400).json({ message: "Email requires to, subject, body" });
  }

  const job = await prisma.job.create({
    data: {
      name,
      jobType: jobType as JobType,
      scheduleType:
        scheduleType === "CRON"
          ? ScheduleType.CRON
          : ScheduleType.ONCE,
      cron: cron ?? null,
      runAt: runAt ? new Date(runAt) : null,
      nextRunAt: runAt ? new Date(runAt) : new Date(),
      status: "PENDING",

      // Webhook
      webhookUrl: jobType === "WEBHOOK" ? payload.url : null,
      webhookMethod: jobType === "WEBHOOK" ? payload.method : null,

      // Email
      emailTo: jobType === "EMAIL" ? payload.to : null,
      emailSubject: jobType === "EMAIL" ? payload.subject : null,
      emailBody: jobType === "EMAIL" ? payload.body : null,

      // ✅ SAFE CONNECT
      user: {
        connect: { id: userId }
      }
    }
  });

  return res.status(201).json(job);
}
