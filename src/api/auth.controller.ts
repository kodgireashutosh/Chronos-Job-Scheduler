import { prisma } from "../db/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Request, Response } from "express";

export async function signup(req: Request, res: Response) {
    const { email, password } = req.body;

    // ✅ Input validation
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const exists = await prisma.user.findUnique({
        where: { email }
    });

    if (exists) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hash,
            apiKey: crypto.randomUUID()
        }
    });

    res.status(201).json({
        id: user.id,
        email: user.email
    });
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
    );

    res.json({ token });
}
