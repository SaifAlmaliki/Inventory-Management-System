import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/clerkAuth";
import { sortProductsByLocation } from "../utils/locationUtils";

const prisma = new PrismaClient();

// Search products with filters and location-based sorting
export const searchProducts = async (req: Request, res: Response) => {
  try {
    const {
      search,
      brandId,
      modelId,
      categoryId,
      condition,
      minPrice,
      maxPrice,
      customerProvince,
      customerCity,
      page = 1,
      limit = 20,
      sortBy = "location" // location, price, rating, newest
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    const where: any = {
      isApproved: true // Only show approved products
    };

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
        { partNumber: { contains: search as string, mode: "insensitive" } },
        { oemNumber: { contains: search as string, mode: "insensitive" } }
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (condition) {
      where.condition = condition;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    // If specific car model is selected, filter by compatibility
    if (modelId) {
      where.compatibility = {
        some: {
          modelId: modelId as string
        }
      };
    } else if (brandId) {
      // If only brand is selected, filter by brand through compatibility
      where.compatibility = {
        some: {
          carModel: {
            brandId: brandId as string
          }
        }
      };
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "price") {
      orderBy = { price: "asc" };
    } else if (sortBy === "rating") {
      orderBy = { rating: "desc" };
    } else if (sortBy === "newest") {
      orderBy = { createdAt: "desc" };
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
        orderBy
      }),
      prisma.product.count({ where })
    ]);

    // Sort by location if requested and customer location is provided
    let sortedProducts = products;
    if (sortBy === "location" && customerProvince && customerCity) {
      // Filter products to only include those with valid dealer location data
      const validProducts = products.filter(p => p.dealer?.province && p.dealer?.city);
      sortedProducts = sortProductsByLocation(
        validProducts as any,
        customerProvince as string,
        customerCity as string
      ) as any;
    }

    res.json({
      products: sortedProducts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Failed to search products" });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const product = await prisma.product.findUnique({
      where: { productId },
      include: {
        dealer: {
          select: {
            userId: true,
            name: true,
            businessName: true,
            storeName: true,
            city: true,
            province: true,
            phoneNumber: true,
            address: true
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
      }
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// Create new product (Dealer only)
export const createProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      name,
      price,
      description,
      partNumber,
      oemNumber,
      condition,
      warranty,
      manufacturer,
      images,
      categoryId,
      compatibleModels
    } = req.body;

    const dealerId = req.userId;

    if (!name || !price || !categoryId || !condition) {
      return res.status(400).json({ 
        error: "Name, price, category, and condition are required" 
      });
    }

    // Verify category exists
    const category = await prisma.partCategory.findUnique({
      where: { categoryId }
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        stockQuantity: 0, // Default stock quantity
        description: description || null,
        partNumber: partNumber || null,
        oemNumber: oemNumber || null,
        condition,
        warranty: warranty || null,
        manufacturer: manufacturer || null,
        images: images ? JSON.parse(images) : null,
        dealerId: dealerId!,
        categoryId,
        isApproved: false // Requires admin approval
      }
    });

    // Add compatibility if provided
    if (compatibleModels && Array.isArray(compatibleModels)) {
      for (const modelId of compatibleModels) {
        await prisma.productCompatibility.create({
          data: {
            productId: product.productId,
            modelId
          }
        });
      }
    }

    // Fetch created product with relations
    const createdProduct = await prisma.product.findUnique({
      where: { productId: product.productId },
      include: {
        dealer: {
          select: {
            userId: true,
            name: true,
            businessName: true,
            storeName: true
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
      }
    });

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// Update product (Dealer only - own products)
export const updateProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const {
        name,
        price,
      description,
      partNumber,
      oemNumber,
      condition,
      warranty,
      manufacturer,
      images,
        stockQuantity,
      categoryId,
      compatibleModels
    } = req.body;

    const dealerId = req.userId;

    // Check if product exists and belongs to dealer
    const existingProduct = await prisma.product.findUnique({
      where: { productId }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (existingProduct.dealerId !== dealerId) {
      return res.status(403).json({ error: "You can only update your own products" });
    }

    // Update product
    const product = await prisma.product.update({
      where: { productId },
      data: {
        name: name || existingProduct.name,
        price: price ? Number(price) : existingProduct.price,
        description: description !== undefined ? description : existingProduct.description,
        partNumber: partNumber !== undefined ? partNumber : existingProduct.partNumber,
        oemNumber: oemNumber !== undefined ? oemNumber : existingProduct.oemNumber,
        condition: condition || existingProduct.condition,
        warranty: warranty !== undefined ? warranty : existingProduct.warranty,
        manufacturer: manufacturer !== undefined ? manufacturer : existingProduct.manufacturer,
        images: images ? JSON.parse(images) : existingProduct.images,
        stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : existingProduct.stockQuantity,
        categoryId: categoryId || existingProduct.categoryId,
        isApproved: false // Reset approval status on update
      }
    });

    // Update compatibility if provided
    if (compatibleModels && Array.isArray(compatibleModels)) {
      // Remove existing compatibility
      await prisma.productCompatibility.deleteMany({
        where: { productId }
      });

      // Add new compatibility
      for (const modelId of compatibleModels) {
        await prisma.productCompatibility.create({
          data: {
            productId,
            modelId
          }
        });
      }
    }

    // Fetch updated product with relations
    const updatedProduct = await prisma.product.findUnique({
      where: { productId },
      include: {
        dealer: {
          select: {
            userId: true,
            name: true,
            businessName: true,
            storeName: true
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
      }
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// Delete product (Dealer only - own products)
export const deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const dealerId = req.userId;

    // Check if product exists and belongs to dealer
    const product = await prisma.product.findUnique({
      where: { productId }
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.dealerId !== dealerId) {
      return res.status(403).json({ error: "You can only delete your own products" });
    }

    // Check if product has orders
    const orderCount = await prisma.orderItem.count({
      where: { productId }
    });

    if (orderCount > 0) {
      return res.status(400).json({ 
        error: "Cannot delete product with existing orders" 
      });
    }

    // Delete product (cascade will handle related records)
    await prisma.product.delete({
      where: { productId }
    });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

// Get dealer's products
export const getDealerProducts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const dealerId = req.userId;
    const { page = 1, limit = 20, search, status } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { dealerId };
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
        { partNumber: { contains: search as string, mode: "insensitive" } }
      ];
    }

    if (status === "approved") {
      where.isApproved = true;
    } else if (status === "pending") {
      where.isApproved = false;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
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
    console.error("Error fetching dealer products:", error);
    res.status(500).json({ error: "Failed to fetch dealer products" });
  }
};

// Get product analytics for dealer
export const getProductAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const dealerId = req.userId;
    const { period = "30" } = req.query; // days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(period));

    const [
      totalProducts,
      approvedProducts,
      pendingProducts,
      lowStockProducts,
      totalSales,
      topProducts
    ] = await Promise.all([
      prisma.product.count({ where: { dealerId } }),
      prisma.product.count({ where: { dealerId, isApproved: true } }),
      prisma.product.count({ where: { dealerId, isApproved: false } }),
      prisma.product.count({ where: { dealerId, stockQuantity: { lte: 10 } } }),
      prisma.sales.aggregate({
        where: {
          product: { dealerId },
          timestamp: { gte: startDate }
        },
        _sum: { totalAmount: true }
      }),
      prisma.sales.groupBy({
        by: ["productId"],
        where: {
          product: { dealerId },
          timestamp: { gte: startDate }
        },
        _sum: { totalAmount: true },
        _count: { saleId: true },
        orderBy: { _sum: { totalAmount: "desc" } },
        take: 5
      })
    ]);

    res.json({
      totalProducts,
      approvedProducts,
      pendingProducts,
      lowStockProducts,
      totalSales: totalSales._sum.totalAmount || 0,
      topProducts,
      period: Number(period)
    });
  } catch (error) {
    console.error("Error fetching product analytics:", error);
    res.status(500).json({ error: "Failed to fetch product analytics" });
  }
};