import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";

export async function listLegalDocuments(req: Request, res: Response, next: NextFunction) {
  try {
    const requestId = (req as any).requestId;
    const documents = await prisma.legalDocument.findMany({
      orderBy: { documentKey: "asc" }
    });

    res.status(200).json({
      data: documents,
      requestId
    });
  } catch (error) {
    next(error);
  }
}

export async function updateLegalDocuments(req: Request, res: Response, next: NextFunction) {
  try {
    const requestId = (req as any).requestId;
    const adminId = (req as any).admin.id;
    const { documents } = req.body;

    const updatedDocs = [];

    for (const doc of documents) {
      const { documentKey, title, body, version, publishedAt } = doc;

      const updated = await prisma.legalDocument.upsert({
        where: { documentKey },
        create: {
          documentKey,
          title,
          body,
          version,
          publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
          updatedByAdminId: adminId
        },
        update: {
          title,
          body,
          version,
          publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
          updatedByAdminId: adminId
        }
      });
      updatedDocs.push(updated);
    }

    res.status(200).json({
      data: updatedDocs,
      requestId
    });
  } catch (error) {
    next(error);
  }
}
