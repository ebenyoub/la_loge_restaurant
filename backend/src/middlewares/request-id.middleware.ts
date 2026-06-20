import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const opaqueId = randomUUID();
  (req as any).requestId = opaqueId;
  res.setHeader("X-Request-Id", opaqueId);
  next();
}
