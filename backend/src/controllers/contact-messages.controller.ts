import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export function createContactMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const opaqueId = randomUUID();
    const requestId = (req as any).requestId;

    res.status(201).json({
      data: {
        id: opaqueId,
        status: "nouveau",
        message: "Votre message a bien été enregistré."
      },
      requestId
    });
  } catch (error) {
    next(error);
  }
}
