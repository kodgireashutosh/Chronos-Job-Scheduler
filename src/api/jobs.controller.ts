import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { jobQueue } from "../queue/job.queue";

export async function createJob(req: any, res: Response) {
  const {
    name,
    scheduleType,
    runAt,
    cron,
    jobType,
    payload
  } = req.body;

  const job = await prisma.job.create({
    data: {
      name,
      jobType,
      scheduleType,
      cron: scheduleType === "CRON" ? cron : null,
      runAt: scheduleType === "ONCE" ? new Date(runAt) : null,
      nextRunAt:
        scheduleType === "ONCE"
          ? new Date(runAt)
          : new Date(),
      status: "PENDING",
      userId: req.user.id,
      webhookUrl: payload?.url,
      webhookMethod: payload?.method,
      emailTo: payload?.to,
      emailSubject: payload?.subject,
      emailBody: payload?.body
    }
  });

  if (scheduleType === "CRON") {
    // 🔁 Recurring job
    await jobQueue.add(
      "execute",
      { jobId: job.id },
      {
        repeat: {
          pattern: cron // ✅ correct BullMQ typing
        },
        removeOnComplete: false
      }
    );
  } else {
    // ⏱ One-time job
    const delay =
      new Date(job.nextRunAt).getTime() - Date.now();

    await jobQueue.add(
      "execute",
      { jobId: job.id },
      { delay: Math.max(delay, 0) }
    );
  }

  return res.status(201).json(job);
}
