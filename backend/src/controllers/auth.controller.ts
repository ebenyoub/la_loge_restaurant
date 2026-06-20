import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const requestId = (req as any).requestId;

    const admin = await prisma.administrator.findUnique({
      where: { email }
    });

    const isPasswordValid = admin && admin.passwordHash
      ? await bcrypt.compare(password, admin.passwordHash)
      : false;

    if (!admin || !isPasswordValid || !admin.isActive) {
      return next({
        status: 401,
        code: "UNAUTHENTICATED",
        message: "Identifiants de connexion invalides ou compte inactif."
      });
    }

    // Update lastLoginAt
    await prisma.administrator.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() }
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        sub: admin.id,
        email: admin.email,
        role: admin.role
      },
      env.jwtSecret,
      {
        expiresIn: env.jwtExpiresIn as any
      }
    );

    res.status(200).json({
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          displayName: admin.displayName,
          role: admin.role
        }
      },
      requestId
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const admin = (req as any).admin;
    const requestId = (req as any).requestId;

    res.status(200).json({
      data: {
        admin: {
          id: admin.id,
          email: admin.email,
          displayName: admin.displayName,
          role: admin.role
        }
      },
      requestId
    });
  } catch (error) {
    next(error);
  }
}
