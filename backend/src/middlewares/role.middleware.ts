import type { Request, Response, NextFunction } from "express";

export function requireRole(role: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const admin = (req as any).admin;

    if (!admin) {
      return next({
        status: 401,
        code: "UNAUTHENTICATED",
        message: "Authentification requise."
      });
    }

    if (admin.role !== role) {
      return next({
        status: 403,
        code: "FORBIDDEN",
        message: "Rôle insuffisant pour accéder à cette ressource."
      });
    }

    next();
  };
}
