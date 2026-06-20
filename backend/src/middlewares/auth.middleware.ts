import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";

export async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next({
        status: 401,
        code: "UNAUTHENTICATED",
        message: "Authentification requise. Jeton manquant ou mal formé."
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded: any;
    try {
      decoded = jwt.verify(token, env.jwtSecret);
    } catch {
      return next({
        status: 401,
        code: "UNAUTHENTICATED",
        message: "Jeton d'authentification invalide ou expiré."
      });
    }

    const adminId = decoded.sub;

    if (!adminId) {
      return next({
        status: 401,
        code: "UNAUTHENTICATED",
        message: "Jeton d'authentification mal formé."
      });
    }

    const admin = await prisma.administrator.findUnique({
      where: { id: adminId }
    });

    if (!admin || !admin.isActive) {
      return next({
        status: 401,
        code: "UNAUTHENTICATED",
        message: "Administrateur non trouvé ou désactivé."
      });
    }

    // Attach admin to request object
    (req as any).admin = admin;

    next();
  } catch (error) {
    next(error);
  }
}
