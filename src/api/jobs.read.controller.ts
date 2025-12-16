import { Request, Response } from "express";
import { prisma } from "../db/prisma";

/* List jobs */
export const getJobs = async (req: any, res: Response) => {
  const jobs = await prisma.job.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" }
  });

  res.json(jobs);
};

/* Job details */
export const getJobById = async (req: any, res: Response) => {
  const job = await prisma.job.findFirst({
    where: { id: req.params.id, userId: req.user.id }
  });

  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json(job);
};

/* Execution history */
export const getJobExecutions = async (req: any, res: Response) => {
  const executions = await prisma.jobExecution.findMany({
    where: { jobId: req.params.id },
    orderBy: { startedAt: "desc" }
  });

  res.json(executions);
};

/* Trigger job now */
export const triggerJob = async (_req: Request, res: Response) => {
  // BullMQ: queue.add() will be called here
  res.json({ message: "Job triggered" });
};

/* Cancel job */
export const cancelJob = async (req: Request, res: Response) => {
  await prisma.job.update({
    where: { id: req.params.id },
    data: { status: "CANCELLED" }
  });

  res.json({ message: "Job cancelled" });
};
