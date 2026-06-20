import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";

export async function getSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const requestId = (req as any).requestId;

    let settings = await prisma.restaurantSettings.findFirst({
      include: {
        openingHours: { orderBy: { displayOrder: "asc" } },
        socialLinks: { orderBy: { displayOrder: "asc" } }
      }
    });

    // Lazy initialize single row settings if database is empty
    if (!settings) {
      settings = await prisma.restaurantSettings.create({
        data: {
          restaurantName: "La Loge Bar & Food",
          defaultLocale: "fr"
        },
        include: {
          openingHours: true,
          socialLinks: true
        }
      });
    }

    res.status(200).json({
      data: settings,
      requestId
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const requestId = (req as any).requestId;

    let settings = await prisma.restaurantSettings.findFirst();

    if (!settings) {
      settings = await prisma.restaurantSettings.create({
        data: {
          restaurantName: "La Loge Bar & Food",
          defaultLocale: "fr"
        }
      });
    }

    const updated = await prisma.restaurantSettings.update({
      where: { id: settings.id },
      data: req.body,
      include: {
        openingHours: { orderBy: { displayOrder: "asc" } },
        socialLinks: { orderBy: { displayOrder: "asc" } }
      }
    });

    res.status(200).json({
      data: updated,
      requestId
    });
  } catch (error) {
    next(error);
  }
}
