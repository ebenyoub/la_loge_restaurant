import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { sendReservationStatusEmail } from "../services/mail.service.js";

export async function listReservations(req: Request, res: Response, next: NextFunction) {
  try {
    const date = req.query.date as string | undefined;
    const status = req.query.status as string | undefined;
    const name = req.query.name as string | undefined;
    const page = req.query.page as string | undefined;
    const pageSize = req.query.pageSize as string | undefined;

    const requestId = (req as any).requestId;

    const pageNum = Number(page || 1);
    const limit = Number(pageSize || 20);
    const skip = (pageNum - 1) * limit;

    const where: any = {};

    if (date) {
      where.requestedDate = new Date(date);
    }

    if (status) {
      where.status = status as any;
    }

    if (name) {
      where.OR = [
        { firstName: { contains: name } },
        { lastName: { contains: name } }
      ];
    }

    const total = await prisma.reservation.count({ where });
    const items = await prisma.reservation.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        requestedDate: true,
        requestedTime: true,
        firstName: true,
        lastName: true,
        guestCount: true,
        occasion: true,
        status: true
      }
    });

    const formattedItems = items.map(item => ({
      id: item.id,
      requestedDate: item.requestedDate.toISOString().split("T")[0],
      requestedTime: item.requestedTime,
      customerName: `${item.firstName} ${item.lastName}`,
      guestCount: item.guestCount,
      occasion: item.occasion,
      status: item.status,
      capacityAlert: false
    }));

    res.status(200).json({
      data: {
        items: formattedItems,
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

export async function getReservation(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const requestId = (req as any).requestId;

    const reservation: any = await prisma.reservation.findUnique({
      where: { id },
      include: {
        statusHistories: {
          orderBy: { createdAt: "desc" },
          include: {
            changedByAdmin: {
              select: {
                displayName: true
              }
            }
          }
        },
        notes: {
          orderBy: { createdAt: "desc" },
          include: {
            authorAdmin: {
              select: {
                displayName: true
              }
            }
          }
        }
      }
    });

    if (!reservation) {
      return next({
        status: 404,
        code: "NOT_FOUND",
        message: "Demande de réservation introuvable."
      });
    }

    res.status(200).json({
      data: {
        id: reservation.id,
        status: reservation.status,
        firstName: reservation.firstName,
        lastName: reservation.lastName,
        phone: reservation.phone,
        email: reservation.email,
        requestedDate: reservation.requestedDate.toISOString().split("T")[0],
        requestedTime: reservation.requestedTime,
        guestCount: reservation.guestCount,
        occasion: reservation.occasion,
        message: reservation.message,
        capacityAlert: false,
        statusHistory: reservation.statusHistories.map((h: any) => ({
          id: h.id,
          previousStatus: h.previousStatus,
          nextStatus: h.nextStatus,
          changedBy: h.changedByAdmin ? h.changedByAdmin.displayName : "Système",
          createdAt: h.createdAt
        })),
        notes: reservation.notes.map((n: any) => ({
          id: n.id,
          body: n.body,
          author: n.authorAdmin.displayName,
          createdAt: n.createdAt
        }))
      },
      requestId
    });
  } catch (error) {
    next(error);
  }
}

export async function updateReservationStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const status = req.body.status as string;
    const adminId = (req as any).admin.id;
    const requestId = (req as any).requestId;

    const reservation = await prisma.reservation.findUnique({
      where: { id }
    });

    if (!reservation) {
      return next({
        status: 404,
        code: "NOT_FOUND",
        message: "Demande de réservation introuvable."
      });
    }

    const previousStatus = reservation.status;

    if (previousStatus === status) {
      return next({
        status: 422,
        code: "INVALID_STATUS_TRANSITION",
        message: "Le statut demandé est déjà appliqué."
      });
    }

    const updated = await prisma.$transaction(async (tx) => {
      await tx.reservationStatusHistory.create({
        data: {
          reservationId: id,
          previousStatus,
          nextStatus: status as any,
          changedByAdminId: adminId
        }
      });

      return tx.reservation.update({
        where: { id },
        data: {
          status: status as any,
          statusChangedAt: new Date()
        }
      });
    });

    // Envoi de l'e-mail de notification au client (asynchrone, non bloquant)
    sendReservationStatusEmail({
      firstName: reservation.firstName,
      lastName: reservation.lastName,
      email: reservation.email,
      requestedDate: reservation.requestedDate,
      requestedTime: reservation.requestedTime,
      guestCount: reservation.guestCount,
      status: status
    });

    res.status(200).json({
      data: {
        id: updated.id,
        status: updated.status,
        statusChangedAt: updated.statusChangedAt
      },
      requestId
    });
  } catch (error) {
    next(error);
  }
}

export async function addReservationNote(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const body = req.body.body as string;
    const adminId = (req as any).admin.id;
    const requestId = (req as any).requestId;

    const reservation = await prisma.reservation.findUnique({
      where: { id }
    });

    if (!reservation) {
      return next({
        status: 404,
        code: "NOT_FOUND",
        message: "Demande de réservation introuvable."
      });
    }

    const note = await prisma.reservationNote.create({
      data: {
        reservationId: id,
        body,
        authorAdminId: adminId
      }
    });

    res.status(201).json({
      data: {
        id: note.id,
        body: note.body,
        createdAt: note.createdAt
      },
      requestId
    });
  } catch (error) {
    next(error);
  }
}
