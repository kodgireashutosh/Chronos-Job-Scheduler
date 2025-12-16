import { Router } from "express";
import { auth } from "./auth.middleware";
import { prisma } from "../db/prisma";

import {
  signup,
  login,
  forgotPassword,
  logout
} from "./auth.controller";

import { createJob } from "./jobs.controller";
import {
  getJobs,
  getJobById,
  getJobExecutions,
  triggerJob,
  cancelJob
} from "./jobs.read.controller";

import {
  getSettings,
  saveSettings
} from "./settings.controller";

const router = Router();

/* ---------------- AUTH ---------------- */
router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.post("/auth/forgot", forgotPassword);
router.post("/auth/logout", auth, logout);

/* ---------------- HEALTH ---------------- */
router.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

/* ---------------- JOBS ---------------- */
router.post("/jobs", auth, createJob);
router.get("/jobs", auth, getJobs);
router.get("/jobs/:id", auth, getJobById);
router.get("/jobs/:id/executions", auth, getJobExecutions);
router.post("/jobs/:id/trigger", auth, triggerJob);
router.post("/jobs/:id/cancel", auth, cancelJob);

/* ---------------- SETTINGS ---------------- */
router.get("/settings/smtp", auth, getSettings);
router.post("/settings/smtp", auth, saveSettings);

export default router;
