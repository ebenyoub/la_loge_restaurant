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

export async function updateSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const requestId = (req as any).requestId;
    const adminId = (req as any).admin.id;

    let settings = await prisma.restaurantSettings.findFirst();

    if (!settings) {
      settings = await prisma.restaurantSettings.create({
        data: {
          restaurantName: "La Loge Bar & Food",
          defaultLocale: "fr"
        }
      });
    }

    const { openingHours, socialLinks, seoMetadata, ...basicSettings } = req.body;

    // 1. Update basic settings
    await prisma.restaurantSettings.update({
      where: { id: settings.id },
      data: basicSettings
    });

    // 2. Update opening hours if provided
    if (openingHours && Array.isArray(openingHours)) {
      for (const oh of openingHours) {
        const existing = await prisma.openingHour.findFirst({
          where: { settingsId: settings.id, dayOfWeek: oh.dayOfWeek }
        });
        if (existing) {
          await prisma.openingHour.update({
            where: { id: existing.id },
            data: {
              opensAt: oh.opensAt,
              closesAt: oh.closesAt,
              isClosed: oh.isClosed ?? false
            }
          });
        } else {
          await prisma.openingHour.create({
            data: {
              settingsId: settings.id,
              dayOfWeek: oh.dayOfWeek,
              opensAt: oh.opensAt,
              closesAt: oh.closesAt,
              isClosed: oh.isClosed ?? false,
              displayOrder: oh.dayOfWeek
            }
          });
        }
      }
    }

    // 3. Update social links if provided
    if (socialLinks && Array.isArray(socialLinks)) {
      for (const sl of socialLinks) {
        const existing = await prisma.socialLink.findFirst({
          where: { settingsId: settings.id, platform: sl.platform }
        });
        if (existing) {
          await prisma.socialLink.update({
            where: { id: existing.id },
            data: {
              url: sl.url,
              isActive: sl.isActive ?? true,
              displayOrder: sl.displayOrder ?? 0
            }
          });
        } else {
          await prisma.socialLink.create({
            data: {
              settingsId: settings.id,
              platform: sl.platform,
              url: sl.url,
              isActive: sl.isActive ?? true,
              displayOrder: sl.displayOrder ?? 0
            }
          });
        }
      }
    }

    // 4. Update SEO if provided
    if (seoMetadata && Array.isArray(seoMetadata)) {
      for (const seo of seoMetadata) {
        await prisma.seoMetadata.upsert({
          where: { route: seo.route },
          create: {
            route: seo.route,
            title: seo.title,
            metaDescription: seo.metaDescription,
            localKeywords: seo.localKeywords || null,
            updatedByAdminId: adminId
          },
          update: {
            title: seo.title,
            metaDescription: seo.metaDescription,
            localKeywords: seo.localKeywords || null,
            updatedByAdminId: adminId
          }
        });
      }
    }

    // Fetch final state
    const finalSettings = await prisma.restaurantSettings.findFirst({
      include: {
        openingHours: { orderBy: { displayOrder: "asc" } },
        socialLinks: { orderBy: { displayOrder: "asc" } }
      }
    });

    const finalSeo = await prisma.seoMetadata.findMany();

    res.status(200).json({
      data: {
        ...finalSettings,
        seoMetadata: finalSeo
      },
      requestId
    });
  } catch (error) {
    next(error);
  }
}
