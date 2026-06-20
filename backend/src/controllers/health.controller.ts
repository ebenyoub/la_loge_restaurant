import type { Request, Response } from "express";

export function getHealth(_request: Request, response: Response) {
  response.status(200).json({
    data: {
      service: "la-loge-backend",
      status: "ok",
    },
  });
}
