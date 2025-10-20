import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all part categories
export const getPartCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.partCategory.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    res.json(categories);
  } catch (error) {
    console.error("Error fetching part categories:", error);
    res.status(500).json({ error: "Failed to fetch part categories" });
  }
};

// Get category by ID
export const getPartCategoryById = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    const category = await prisma.partCategory.findUnique({
      where: { categoryId },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching part category:", error);
    res.status(500).json({ error: "Failed to fetch part category" });
  }
};

// Create new part category (Admin only)
export const createPartCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const category = await prisma.partCategory.create({
      data: {
        name,
        description: description || null
      }
    });

    res.status(201).json(category);
  } catch (error: any) {
    console.error("Error creating part category:", error);
    if (error.code === "P2002") {
      res.status(400).json({ error: "Category name already exists" });
    } else {
      res.status(500).json({ error: "Failed to create part category" });
    }
  }
};

// Update part category (Admin only)
export const updatePartCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const category = await prisma.partCategory.update({
      where: { categoryId },
      data: {
        name,
        description: description || null
      }
    });

    res.json(category);
  } catch (error: any) {
    console.error("Error updating part category:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Category not found" });
    } else if (error.code === "P2002") {
      res.status(400).json({ error: "Category name already exists" });
    } else {
      res.status(500).json({ error: "Failed to update part category" });
    }
  }
};

// Delete part category (Admin only)
export const deletePartCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    // Check if category has products
    const productsCount = await prisma.product.count({
      where: { categoryId }
    });

    if (productsCount > 0) {
      return res.status(400).json({ 
        error: "Cannot delete category with existing products" 
      });
    }

    await prisma.partCategory.delete({
      where: { categoryId }
    });

    res.json({ message: "Category deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting part category:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Category not found" });
    } else {
      res.status(500).json({ error: "Failed to delete part category" });
    }
  }
};

// Get products by category
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 20, search, approved } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      categoryId
    };

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
        { partNumber: { contains: search as string, mode: "insensitive" } }
      ];
    }

    if (approved !== undefined) {
      where.isApproved = approved === "true";
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          dealer: {
            select: {
              userId: true,
              name: true,
              businessName: true,
              storeName: true,
              city: true,
              province: true,
              phoneNumber: true
            }
          },
          category: true,
          compatibility: {
            include: {
              carModel: {
                include: {
                  brand: true
                }
              }
            }
          }
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ error: "Failed to fetch products by category" });
  }
};
