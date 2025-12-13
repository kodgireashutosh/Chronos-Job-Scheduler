import { Router } from "express";
import { auth } from "./auth.middleware";
import { createJob } from "./jobs.controller";
import { saveSettings } from "./settings.controller";
import { signup, login } from "./auth.controller";
import { prisma } from "../db/prisma";

const router = Router();

// Auth
router.post("/auth/signup", signup);
router.post("/auth/login", login);

// Health
router.get("/health", (_, res) => res.json({ status: "ok" }));

// Jobs (user-scoped)
router.post("/jobs", auth, createJob);
router.get("/jobs", auth, async (req: any, res) => {
  const jobs = await prisma.job.findMany({
    where: { userId: req.user.id }
  });
  res.json(jobs);
});

// Settings
router.post("/settings", auth, saveSettings);

export default router;
