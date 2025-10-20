import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/clerkAuth";

const prisma = new PrismaClient();

// Create order from cart
export const createOrderFromCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { deliveryAddress, deliveryCity, deliveryProvince, customerPhone } = req.body;
    const customerId = req.userId;

    if (!deliveryAddress || !deliveryCity || !deliveryProvince || !customerPhone) {
      return res.status(400).json({ 
        error: "Delivery address, city, province, and phone are required" 
      });
    }

    // Get customer's cart
    const cart = await prisma.cart.findUnique({
      where: { customerId },
      include: {
        items: {
          include: {
            product: {
              include: {
                dealer: true
              }
            }
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Group cart items by dealer
    const itemsByDealer = new Map<string, typeof cart.items>();
    
    for (const item of cart.items) {
      const dealerId = item.product.dealerId;
      if (!itemsByDealer.has(dealerId)) {
        itemsByDealer.set(dealerId, []);
      }
      itemsByDealer.get(dealerId)!.push(item);
    }

    const orders = [];

    // Create separate order for each dealer
    for (const [dealerId, items] of itemsByDealer) {
      const totalAmount = items.reduce((sum, item) => 
        sum + (item.product.price * item.quantity), 0
      );

      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const order = await prisma.order.create({
        data: {
          orderNumber,
          customerId: customerId!,
          dealerId,
          totalAmount,
          deliveryAddress,
          deliveryCity,
          deliveryProvince,
          customerPhone,
          status: "PENDING",
          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.product.price
            }))
          }
        },
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
              storeName: true,
              phoneNumber: true
            }
          }
        }
      });

      orders.push(order);
    }

    // Clear the cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.cartId }
    });

    res.status(201).json({
      message: "Orders created successfully",
      orders
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Get customer orders
export const getCustomerOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customerId = req.userId;
    const { page = 1, limit = 20, status } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { customerId };
    if (status) {
      where.status = status;
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
              storeName: true,
              phoneNumber: true
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
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ error: "Failed to fetch customer orders" });
  }
};

// Get dealer orders
export const getDealerOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const dealerId = req.userId;
    const { page = 1, limit = 20, status } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { dealerId };
    if (status) {
      where.status = status;
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
          customer: {
            select: {
              userId: true,
              name: true,
              phoneNumber: true
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
    console.error("Error fetching dealer orders:", error);
    res.status(500).json({ error: "Failed to fetch dealer orders" });
  }
};

// Update order status
export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.userId;
    const userRole = req.userRole;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const validStatuses = ["PENDING", "CONFIRMED", "DELIVERING", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Check if order exists and user has permission
    const order = await prisma.order.findUnique({
      where: { orderId },
      include: {
        dealer: true,
        customer: true
      }
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check permissions
    const canUpdate = userRole === "ADMIN" || 
                     (userRole === "DEALER" && order.dealerId === userId) ||
                     (userRole === "CUSTOMER" && order.customerId === userId && status === "CANCELLED");

    if (!canUpdate) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    const updatedOrder = await prisma.order.update({
      where: { orderId },
      data: { status },
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
            storeName: true,
            phoneNumber: true
          }
        },
        customer: {
          select: {
            userId: true,
            name: true,
            phoneNumber: true
          }
        }
      }
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

// Get order by ID
export const getOrderById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;

    const order = await prisma.order.findUnique({
      where: { orderId },
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
            storeName: true,
            phoneNumber: true
          }
        },
        customer: {
          select: {
            userId: true,
            name: true,
            phoneNumber: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check permissions
    const canView = userRole === "ADMIN" || 
                   (userRole === "DEALER" && order.dealerId === userId) ||
                   (userRole === "CUSTOMER" && order.customerId === userId);

    if (!canView) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// Get order analytics for dealer
export const getOrderAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const dealerId = req.userId;
    const { period = "30" } = req.query; // days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(period));

    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      ordersByStatus
    ] = await Promise.all([
      prisma.order.count({
        where: {
          dealerId,
          createdAt: { gte: startDate }
        }
      }),
      prisma.order.count({
        where: {
          dealerId,
          status: "PENDING",
          createdAt: { gte: startDate }
        }
      }),
      prisma.order.count({
        where: {
          dealerId,
          status: "COMPLETED",
          createdAt: { gte: startDate }
        }
      }),
      prisma.order.aggregate({
        where: {
          dealerId,
          status: "COMPLETED",
          createdAt: { gte: startDate }
        },
        _sum: { totalAmount: true }
      }),
      prisma.order.groupBy({
        by: ["status"],
        where: {
          dealerId,
          createdAt: { gte: startDate }
        },
        _count: { orderId: true }
      })
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      ordersByStatus,
      period: Number(period)
    });
  } catch (error) {
    console.error("Error fetching order analytics:", error);
    res.status(500).json({ error: "Failed to fetch order analytics" });
  }
};
