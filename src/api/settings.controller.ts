import { Request, Response } from "express";
import { prisma } from "../db/prisma";

export async function saveSettings(req: any, res: Response) {
  const {
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPassword,
    smtpFrom
  } = req.body;

  // ✅ Validate input
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword || !smtpFrom) {
    return res.status(400).json({
      message: "All SMTP fields are required"
    });
  }

  // ✅ Upsert per user (safe)
  const settings = await prisma.setting.upsert({
    where: {
      userId: req.user.id
    },
    update: {
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPassword,
      smtpFrom
    },
    create: {
      userId: req.user.id,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPassword,
      smtpFrom
    }
  });

  res.json(settings);
}
