import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { ExecutionStatus, JobStatus } from "@prisma/client";

/**
 * GET /dashboard/metrics
 * Query: ?range=24h | 7d
 */
export async function getDashboardMetrics(
  req: Request,
  res: Response
) {
  try {
    // 🔐 Same pattern as createJob controller
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const range = (req.query.range as string) || "24h";

    const now = new Date();
    const fromDate =
      range === "7d"
        ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        : new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const userId = user.id;

    const [
      total,
      completed,
      failed,
      pending,
      cancelled,
    ] = await Promise.all([
      // 🧮 Total jobs for user
      prisma.job.count({
        where: { userId },
      }),

      // ✅ Successful executions
      prisma.jobExecution.count({
        where: {
          status: ExecutionStatus.SUCCESS,
          startedAt: { gte: fromDate },
          job: { userId },
        },
      }),

      // ❌ Failed executions
      prisma.jobExecution.count({
        where: {
          status: ExecutionStatus.FAILURE,
          startedAt: { gte: fromDate },
          job: { userId },
        },
      }),

      // ⏳ Pending / Running jobs
      prisma.job.count({
        where: {
          userId,
          status: {
            in: [JobStatus.PENDING, JobStatus.RUNNING],
          },
        },
      }),

      // 🚫 Cancelled jobs
      prisma.job.count({
        where: {
          userId,
          status: JobStatus.CANCELLED,
        },
      }),
    ]);

    return res.json({
      total,
      completed,
      failed,
      pending,
      cancelled,
    });
  } catch (err) {
    console.error("Dashboard metrics error:", err);
    return res.status(500).json({
      message: "Failed to load dashboard metrics",
    });
  }
}
