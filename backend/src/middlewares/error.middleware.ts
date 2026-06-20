import type { Request, Response, NextFunction } from "express";

export interface AppError {
  status?: number;
  code: string;
  message: string;
  fields?: Record<string, string>;
}

export function errorHandlerMiddleware(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err.status || 500;
  const code = err.code || "INTERNAL_ERROR";
  const message = err.message || "Une erreur interne est survenue.";
  const fields = err.fields;
  const requestId = (req as any).requestId || "unknown";

  res.status(status).json({
    error: {
      code,
      message,
      ...(fields ? { fields } : {}),
    },
    requestId,
  });
}
