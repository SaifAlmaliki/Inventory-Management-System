import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/clerkAuth";

const prisma = new PrismaClient();

// Get platform-wide analytics
export const getPlatformAnalytics = async (req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      totalDealers,
      totalCustomers,
      totalProducts,
      totalOrders,
      pendingDealers,
      pendingProducts,
      totalRevenue,
      recentOrders
    ] = await Promise.all([
      prisma.users.count(),
      prisma.users.count({ where: { role: "DEALER" } }),
      prisma.users.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count(),
      prisma.order.count(),
      prisma.users.count({ where: { role: "DEALER", isApproved: false } }),
      prisma.product.count({ where: { isApproved: false } }),
      prisma.order.aggregate({
        where: { status: "COMPLETED" },
        _sum: { totalAmount: true }
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          customer: {
            select: { name: true, email: true }
          },
          dealer: {
            select: { name: true, businessName: true }
          }
        }
      })
    ]);

    res.json({
      totalUsers,
      totalDealers,
      totalCustomers,
      totalProducts,
      totalOrders,
      pendingDealers,
      pendingProducts,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      recentOrders
    });
  } catch (error) {
    console.error("Error fetching platform analytics:", error);
    res.status(500).json({ error: "Failed to fetch platform analytics" });
  }
};

// Get all dealers with approval status
export const getDealers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { role: "DEALER" };
    if (status === "pending") {
      where.isApproved = false;
    } else if (status === "approved") {
      where.isApproved = true;
    }

    const [dealers, total] = await Promise.all([
      prisma.users.findMany({
        where,
        select: {
          userId: true,
          clerkId: true,
          name: true,
          email: true,
          phoneNumber: true,
          city: true,
          province: true,
          isApproved: true,
          businessName: true,
          businessLicense: true,
          storeName: true,
          createdAt: true,
          _count: {
            select: {
              productsAsDealer: true,
              ordersAsDealer: true
            }
          }
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" }
      }),
      prisma.users.count({ where })
    ]);

    res.json({
      dealers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching dealers:", error);
    res.status(500).json({ error: "Failed to fetch dealers" });
  }
};

// Approve/reject dealer
export const updateDealerApproval = async (req: Request, res: Response) => {
  try {
    const { dealerId } = req.params;
    const { isApproved } = req.body;

    if (typeof isApproved !== "boolean") {
      return res.status(400).json({ error: "isApproved must be a boolean" });
    }

    const dealer = await prisma.users.update({
      where: { userId: dealerId },
      data: { isApproved },
      select: {
        userId: true,
        name: true,
        email: true,
        businessName: true,
        isApproved: true
      }
    });

    res.json({
      message: `Dealer ${isApproved ? "approved" : "rejected"} successfully`,
      dealer
    });
  } catch (error: any) {
    console.error("Error updating dealer approval:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Dealer not found" });
    } else {
      res.status(500).json({ error: "Failed to update dealer approval" });
    }
  }
};

// Get all products with approval status
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status === "pending") {
      where.isApproved = false;
    } else if (status === "approved") {
      where.isApproved = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
        { partNumber: { contains: search as string, mode: "insensitive" } }
      ];
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
              province: true
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
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Approve/reject product
export const updateProductApproval = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { isApproved } = req.body;

    if (typeof isApproved !== "boolean") {
      return res.status(400).json({ error: "isApproved must be a boolean" });
    }

    const product = await prisma.product.update({
      where: { productId },
      data: { isApproved },
      include: {
        dealer: {
          select: {
            userId: true,
            name: true,
            businessName: true
          }
        },
        category: true
      }
    });

    res.json({
      message: `Product ${isApproved ? "approved" : "rejected"} successfully`,
      product
    });
  } catch (error: any) {
    console.error("Error updating product approval:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.status(500).json({ error: "Failed to update product approval" });
    }
  }
};

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { email: { contains: search as string, mode: "insensitive" } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.users.findMany({
        where,
        select: {
          userId: true,
          clerkId: true,
          name: true,
          email: true,
          role: true,
          phoneNumber: true,
          city: true,
          province: true,
          isApproved: true,
          businessName: true,
          createdAt: true,
          _count: {
            select: {
              productsAsDealer: true,
              ordersAsCustomer: true,
              ordersAsDealer: true
            }
          }
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" }
      }),
      prisma.users.count({ where })
    ]);

    res.json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { isApproved, role } = req.body;

    const updateData: any = {};
    if (typeof isApproved === "boolean") {
      updateData.isApproved = isApproved;
    }
    if (role && ["CUSTOMER", "DEALER", "ADMIN"].includes(role)) {
      updateData.role = role;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const user = await prisma.users.update({
      where: { userId },
      data: updateData,
      select: {
        userId: true,
        name: true,
        email: true,
        role: true,
        isApproved: true,
        businessName: true
      }
    });

    res.json({
      message: "User updated successfully",
      user
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: "Failed to update user" });
    }
  }
};

// Get all orders
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, status, dealerId, customerId } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (dealerId) {
      where.dealerId = dealerId;
    }
    if (customerId) {
      where.customerId = customerId;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true
                }
              }
            }
          },
          dealer: {
            select: {
              userId: true,
              name: true,
              businessName: true,
              storeName: true
            }
          },
          customer: {
            select: {
              userId: true,
              name: true,
              email: true
            }
          }
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" }
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Generate reports
export const generateReport = async (req: Request, res: Response) => {
  try {
    const { type, startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    switch (type) {
      case "sales":
        const salesData = await prisma.order.findMany({
          where: {
            status: "COMPLETED",
            createdAt: { gte: start, lte: end }
          },
          include: {
            dealer: {
              select: { name: true, businessName: true }
            }
          },
          orderBy: { createdAt: "desc" }
        });

        res.json({
          type: "sales",
          period: { start, end },
          data: salesData
        });
        break;

      case "dealers":
        const dealersData = await prisma.users.findMany({
          where: {
            role: "DEALER",
            createdAt: { gte: start, lte: end }
          },
          include: {
            _count: {
              select: {
                productsAsDealer: true,
                ordersAsDealer: true
              }
            }
          },
          orderBy: { createdAt: "desc" }
        });

        res.json({
          type: "dealers",
          period: { start, end },
          data: dealersData
        });
        break;

      default:
        res.status(400).json({ error: "Invalid report type" });
    }
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
};
