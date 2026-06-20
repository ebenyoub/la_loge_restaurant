import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";

export async function listMenuItems(req: Request, res: Response, next: NextFunction) {
  try {
    const requestId = (req as any).requestId;
    const categoryId = req.query.categoryId as string | undefined;

    const where: any = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const items = await prisma.menuItem.findMany({
      where,
      orderBy: { displayOrder: "asc" },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    });

    res.status(200).json({
      data: items,
      requestId
    });
  } catch (error) {
    next(error);
  }
}

export async function getMenuItem(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const requestId = (req as any).requestId;

    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    });

    if (!item) {
      return next({
        status: 404,
        code: "NOT_FOUND",
        message: "Plat/Boisson introuvable."
      });
    }

    res.status(200).json({
      data: item,
      requestId
    });
  } catch (error) {
    next(error);
  }
}

export async function createMenuItem(req: Request, res: Response, next: NextFunction) {
  try {
    const requestId = (req as any).requestId;
    const {
      categoryId,
      name,
      description,
      priceCents,
      allergenInfo,
      dietaryInfo,
      availability,
      imageAssetId,
      displayOrder
    } = req.body;

    // Check if category exists
    const category = await prisma.menuCategory.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return next({
        status: 422,
        code: "VALIDATION_ERROR",
        message: "Certains champs du plat sont invalides.",
        fields: { categoryId: "La catégorie de menu spécifiée est inexistante." }
      });
    }

    // Check if image exists if specified
    if (imageAssetId) {
      const asset = await prisma.mediaAsset.findUnique({
        where: { id: imageAssetId }
      });

      if (!asset) {
        return next({
          status: 422,
          code: "VALIDATION_ERROR",
          message: "Certains champs du plat sont invalides.",
          fields: { imageAssetId: "L'image spécifiée est introuvable." }
        });
      }
    }

    const item = await prisma.menuItem.create({
      data: {
        categoryId,
        name,
        description,
        priceCents,
        allergenInfo,
        dietaryInfo,
        availability: availability || "disponible",
        imageAssetId,
        displayOrder
      },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    });

    res.status(201).json({
      data: item,
      requestId
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMenuItem(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const requestId = (req as any).requestId;
    const { categoryId, imageAssetId } = req.body;

    const item = await prisma.menuItem.findUnique({
      where: { id }
    });

    if (!item) {
      return next({
        status: 404,
        code: "NOT_FOUND",
        message: "Plat/Boisson introuvable."
      });
    }

    // Check category if modified
    if (categoryId && categoryId !== item.categoryId) {
      const category = await prisma.menuCategory.findUnique({
        where: { id: categoryId }
      });

      if (!category) {
        return next({
          status: 422,
          code: "VALIDATION_ERROR",
          message: "Certains champs du plat sont invalides.",
          fields: { categoryId: "La catégorie de menu spécifiée est inexistante." }
        });
      }
    }

    // Check image if modified
    if (imageAssetId && imageAssetId !== item.imageAssetId) {
      const asset = await prisma.mediaAsset.findUnique({
        where: { id: imageAssetId }
      });

      if (!asset) {
        return next({
          status: 422,
          code: "VALIDATION_ERROR",
          message: "Certains champs du plat sont invalides.",
          fields: { imageAssetId: "L'image spécifiée est introuvable." }
        });
      }
    }

    const updated = await prisma.menuItem.update({
      where: { id },
      data: req.body,
      include: {
        category: {
          select: {
            name: true
          }
        }
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

export async function deleteMenuItem(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const requestId = (req as any).requestId;

    const item = await prisma.menuItem.findUnique({
      where: { id }
    });

    if (!item) {
      return next({
        status: 404,
        code: "NOT_FOUND",
        message: "Plat/Boisson introuvable."
      });
    }

    await prisma.menuItem.delete({
      where: { id }
    });

    res.status(200).json({
      data: {
        id,
        message: "Le plat/boisson a été supprimé."
      },
      requestId
    });
  } catch (error) {
    next(error);
  }
}
