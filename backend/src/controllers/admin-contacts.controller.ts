import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";

export async function listContactMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const status = req.query.status as string | undefined;
    const page = req.query.page as string | undefined;
    const pageSize = req.query.pageSize as string | undefined;

    const requestId = (req as any).requestId;

    const pageNum = Number(page || 1);
    const limit = Number(pageSize || 20);
    const skip = (pageNum - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status as any;
    }

    const total = await prisma.contactMessage.count({ where });
    const items = await prisma.contactMessage.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        handledByAdmin: {
          select: {
            displayName: true
          }
        }
      }
    });

    res.status(200).json({
      data: {
        items: items.map(item => ({
          id: item.id,
          status: item.status,
          name: item.name,
          email: item.email,
          phone: item.phone,
          subject: item.subject,
          createdAt: item.createdAt,
          handledAt: item.handledAt,
          handledBy: item.handledByAdmin ? item.handledByAdmin.displayName : null
        })),
        page: pageNum,
        pageSize: limit,
        total
      },
      requestId
    });
  } catch (error) {
    next(error);
  }
}

export async function getContactMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const requestId = (req as any).requestId;

    const message = await prisma.contactMessage.findUnique({
      where: { id },
      include: {
        handledByAdmin: {
          select: {
            displayName: true
          }
        }
      }
    });

    if (!message) {
      return next({
        status: 404,
        code: "NOT_FOUND",
        message: "Message de contact introuvable."
      });
    }

    res.status(200).json({
      data: {
        id: message.id,
        status: message.status,
        name: message.name,
        email: message.email,
        phone: message.phone,
        subject: message.subject,
        message: message.message,
        createdAt: message.createdAt,
        handledAt: message.handledAt,
        handledBy: message.handledByAdmin ? message.handledByAdmin.displayName : null
      },
      requestId
    });
  } catch (error) {
    next(error);
  }
}

export async function updateContactMessageStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const status = req.body.status as string;
    const adminId = (req as any).admin.id;
    const requestId = (req as any).requestId;

    const message = await prisma.contactMessage.findUnique({
      where: { id }
    });

    if (!message) {
      return next({
        status: 404,
        code: "NOT_FOUND",
        message: "Message de contact introuvable."
      });
    }

    if (message.status === status) {
      return next({
        status: 422,
        code: "INVALID_STATUS_TRANSITION",
        message: "Le statut demandé est déjà appliqué."
      });
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: {
        status: status as any,
        handledByAdminId: adminId,
        handledAt: new Date()
      },
      include: {
        handledByAdmin: {
          select: {
            displayName: true
          }
        }
      }
    });

    res.status(200).json({
      data: {
        id: updated.id,
        status: updated.status,
        handledAt: updated.handledAt,
        handledBy: updated.handledByAdmin ? updated.handledByAdmin.displayName : null
      },
      requestId
    });
  } catch (error) {
    next(error);
  }
}
