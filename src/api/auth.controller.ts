import { prisma } from "../db/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Request, Response } from "express";

/**
 * SIGNUP
 */
export async function signup(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
        });
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return res.status(409).json({
            message: "User already exists",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            apiKey: crypto.randomUUID(),
            role: "USER",
        },
    });

    return res.status(201).json({
        id: user.id,
        email: user.email,
    });
}

/**
 * LOGIN
 */
export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
        });
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return res.status(401).json({
            message: "Invalid credentials",
        });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.status(401).json({
            message: "Invalid credentials",
        });
    }

    const token = jwt.sign(
        {
            userId: user.id, 
            role: user.role,
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: "1d",
        }
    );

    return res.json({ token });
}

/**
 * FORGOT PASSWORD (stub)
 */
export async function forgotPassword(_req: Request, res: Response) {
    // TODO:Email sending intentionally skipped
    return res.json({
        message: "Password reset link sent (mock)",
    });
}

/**
 * LOGOUT (JWT is stateless)
 */
export async function logout(_req: Request, res: Response) {
    return res.json({
        message: "Logged out successfully",
    });
}
