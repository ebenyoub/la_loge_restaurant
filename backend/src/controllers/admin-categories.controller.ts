import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";

export async function listCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const requestId = (req as any).requestId;
    const items = await prisma.menuCategory.findMany({
      orderBy: { displayOrder: "asc" }
    });

    res.status(200).json({
      data: items,
      requestId
    });
  } catch (error) {
    next(error);
  }
}

export async function getCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const requestId = (req as any).requestId;

    const category = await prisma.menuCategory.findUnique({
      where: { id }
    });

    if (!category) {
      return next({
        status: 404,
        code: "NOT_FOUND",
        message: "Catégorie de menu introuvable."
      });
    }

    res.status(200).json({
      data: category,
      requestId
    });
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const requestId = (req as any).requestId;
    const { name, slug, description, displayOrder, isActive } = req.body;

    const existing = await prisma.menuCategory.findUnique({
      where: { slug }
    });

    if (existing) {
      return next({
        status: 409,
        code: "CONFLICT",
        message: "Une catégorie avec ce slug existe déjà."
      });
    }

    const category = await prisma.menuCategory.create({
      data: {
        name,
        slug,
        description,
        displayOrder,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    res.status(201).json({
      data: category,
      requestId
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const requestId = (req as any).requestId;
    const { slug } = req.body;

    const category = await prisma.menuCategory.findUnique({
      where: { id }
    });

    if (!category) {
      return next({
        status: 404,
        code: "NOT_FOUND",
        message: "Catégorie de menu introuvable."
      });
    }

    if (slug && slug !== category.slug) {
      const existing = await prisma.menuCategory.findUnique({
        where: { slug }
      });

      if (existing) {
        return next({
          status: 409,
          code: "CONFLICT",
          message: "Une catégorie avec ce slug existe déjà."
        });
      }
    }

    const updated = await prisma.menuCategory.update({
      where: { id },
      data: req.body
    });

    res.status(200).json({
      data: updated,
      requestId
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const requestId = (req as any).requestId;

    const category = await prisma.menuCategory.findUnique({
      where: { id }
    });

    if (!category) {
      return next({
        status: 404,
        code: "NOT_FOUND",
        message: "Catégorie de menu introuvable."
      });
    }

    // Hard delete
    await prisma.menuCategory.delete({
      where: { id }
    });

    res.status(200).json({
      data: {
        id,
        message: "La catégorie de menu a été supprimée."
      },
      requestId
    });
  } catch (error) {
    next(error);
  }
}
