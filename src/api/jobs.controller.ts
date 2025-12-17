import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { jobQueue } from "../queue/job.queue";

type ScheduleType = "ONCE" | "CRON";
type JobType = "WEBHOOK" | "EMAIL";

export async function createJob(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const {
      name,
      scheduleType,
      runAt,
      cron,
      jobType,
      payload,
    } = req.body;

    // -----------------------------
    // 1️⃣ VALIDATION
    // -----------------------------
    if (!name || !jobType || !scheduleType) {
      return res.status(422).json({
        error: "name, jobType and scheduleType are required",
      });
    }

    if (!["ONCE", "CRON"].includes(scheduleType)) {
      return res.status(422).json({
        error: "Invalid scheduleType",
      });
    }

    if (scheduleType === "CRON" && !cron) {
      return res.status(422).json({
        error: "cron is required for CRON jobs",
      });
    }

    if (scheduleType === "ONCE" && !runAt) {
      return res.status(422).json({
        error: "runAt is required for one-time jobs",
      });
    }

    if (scheduleType === "CRON" && runAt) {
      return res.status(422).json({
        error: "runAt cannot be used with CRON jobs",
      });
    }

    if (!payload) {
      return res.status(422).json({
        error: "payload is required",
      });
    }

    
    const nextRunAt =
      scheduleType === "ONCE"
        ? new Date(runAt)
        : new Date(); // CRON marker only

   
    const job = await prisma.job.create({
      data: {
        name,
        jobType,
        scheduleType,

        cron: scheduleType === "CRON" ? cron : null,
        runAt: scheduleType === "ONCE" ? new Date(runAt) : null,
        nextRunAt,

        status: "PENDING",
        userId: user.id,

        // 🌐 WEBHOOK
        webhookUrl: jobType === "WEBHOOK" ? payload.url : null,
        webhookMethod:
          jobType === "WEBHOOK" ? payload.method ?? "POST" : null,

        // ✉️ EMAIL
        emailTo: jobType === "EMAIL" ? payload.to : null,
        emailSubject: jobType === "EMAIL" ? payload.subject : null,
        emailBody: jobType === "EMAIL" ? payload.body : null,
      },
    });

    if (scheduleType === "CRON") {
      await jobQueue.add(
        "execute",
        {
          jobId: job.id, // ✅ ALWAYS inside data
        },
        {
          jobId: job.id, // ✅ BullMQ dedupe id
          repeat: {
            pattern: cron,
          },
          removeOnComplete: false,
          removeOnFail: false,
        }
      );
    } else {
      const delay = Math.max(
        nextRunAt.getTime() - Date.now(),
        0
      );

      await jobQueue.add(
        "execute",
        {
          jobId: job.id, // ✅ ALWAYS inside data
        },
        {
          jobId: job.id,
          delay,
          removeOnComplete: false,
          removeOnFail: false,
        }
      );
    }

    return res.status(201).json(job);
  } catch (error: any) {
    console.error("Create job failed", error);
    return res.status(500).json({
      error: "Failed to create job",
      message: error.message,
    });
  }
}
