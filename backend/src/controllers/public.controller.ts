import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";

export async function getPublicSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const requestId = (req as any).requestId;

    let settings = await prisma.restaurantSettings.findFirst({
      include: {
        openingHours: { orderBy: { displayOrder: "asc" } },
        socialLinks: { 
          where: { isActive: true },
          orderBy: { displayOrder: "asc" } 
        }
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

    const seoMetadata = await prisma.seoMetadata.findMany();

    res.status(200).json({
      data: {
        ...settings,
        seoMetadata
      },
      requestId
    });
  } catch (error) {
    next(error);
  }
}

export async function getPublicMenu(req: Request, res: Response, next: NextFunction) {
  try {
    const requestId = (req as any).requestId;

    const categories = await prisma.menuCategory.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      include: {
        menuItems: {
          where: { availability: "disponible" },
          orderBy: { displayOrder: "asc" }
        }
      }
    });

    res.status(200).json({
      data: categories,
      requestId
    });
  } catch (error) {
    next(error);
  }
}

export async function getPublicLegalDocuments(req: Request, res: Response, next: NextFunction) {
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

