import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { encrypt, decrypt } from "../utils/crypto";

/**
 * GET /settings
 */
export async function getSettings(req: any, res: Response) {
    const settings = await prisma.setting.findUnique({
        where: { userId: req.user.id },
    });

    if (!settings) {
        return res.json(null);
    }

    return res.json({
        smtpHost: settings.smtpHost,
        smtpPort: settings.smtpPort,
        smtpUser: settings.smtpUser,
        smtpFrom: settings.smtpFrom,
        smtpPassword: decrypt(settings.smtpPassword),
    });
}

/**
 * POST /settings
 */
export async function saveSettings(req: any, res: Response) {
    const {
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPassword,
        smtpFrom,
    } = req.body;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword || !smtpFrom) {
        return res.status(400).json({
            message: "All SMTP fields are required",
        });
    }

    const settings = await prisma.setting.upsert({
        where: {
            userId: req.user.id,
        },
        update: {
            smtpHost,
            smtpPort,
            smtpUser,
            smtpFrom,
            smtpPassword: encrypt(smtpPassword),
        },
        create: {
            userId: req.user.id,
            smtpHost,
            smtpPort,
            smtpUser,
            smtpFrom,
            smtpPassword: encrypt(smtpPassword),
        },
    });

    return res.json({
        message: "Settings saved successfully",
    });
}
