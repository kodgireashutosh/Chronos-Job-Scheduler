import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { jobQueue } from "../queue/job.queue";
import { ExecutionStatus, JobStatus } from "@prisma/client";

export const getJobs = async (req: any, res: Response) => {
  const jobs = await prisma.job.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" }
  });

  res.json(jobs);
};

export const getJobById = async (req: any, res: Response) => {
  const job = await prisma.job.findFirst({
    where: { id: req.params.id, userId: req.user.id }
  });

  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json(job);
};

export const getJobExecutions = async (req: any, res: Response) => {
  const executions = await prisma.jobExecution.findMany({
    where: { jobId: req.params.id },
    orderBy: { startedAt: "desc" }
  });

  res.json(executions);
};

export const triggerJob = async (req: Request, res: Response) => {
  const jobId = req.params.id;

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  await prisma.job.update({
    where: { id: jobId },
    data: {
      status: JobStatus.RUNNING,
      retries: { increment: 1 },
    },
  });

  await prisma.jobExecution.create({
    data: {
      jobId,
      attempt: job.retries + 1,
      startedAt: new Date(),
      status : ExecutionStatus.FAILURE,
    },
  });

  res.json({ message: "Job triggered" });
};


export const cancelJob = async (req: Request, res: Response) => {
  await prisma.job.update({
    where: { id: req.params.id },
    data: { status: "CANCELLED" }
  });

  res.json({ message: "Job cancelled" });
};
