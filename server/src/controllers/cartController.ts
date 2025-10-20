import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/clerkAuth";

const prisma = new PrismaClient();

// Get customer's cart
export const getCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customerId = req.userId;

    const cart = await prisma.cart.findUnique({
      where: { customerId },
      include: {
        items: {
          include: {
            product: {
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
              }
            }
          }
        }
      }
    });

    if (!cart) {
      // Create empty cart if it doesn't exist
      const newCart = await prisma.cart.create({
        data: { customerId: customerId! },
        include: {
          items: {
            include: {
              product: {
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
                }
              }
            }
          }
        }
      });
      return res.json(newCart);
    }

    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// Add item to cart
export const addToCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const customerId = req.userId;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    // Check if product exists and is approved
    const product = await prisma.product.findUnique({
      where: { productId },
      include: { dealer: true }
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (!product.isApproved) {
      return res.status(400).json({ error: "Product is not available" });
    }

    if (product.stockQuantity < quantity) {
      return res.status(400).json({ 
        error: `Only ${product.stockQuantity} items available in stock` 
      });
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { customerId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { customerId: customerId! }
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.cartId,
          productId
        }
      }
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      
      if (product.stockQuantity < newQuantity) {
        return res.status(400).json({ 
          error: `Only ${product.stockQuantity} items available in stock` 
        });
      }

      const updatedItem = await prisma.cartItem.update({
        where: {
          cartId_productId: {
            cartId: cart.cartId,
            productId
          }
        },
        data: { quantity: newQuantity },
        include: {
          product: {
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
              category: true
            }
          }
        }
      });

      return res.json(updatedItem);
    } else {
      // Add new item
      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.cartId,
          productId,
          quantity
        },
        include: {
          product: {
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
              category: true
            }
          }
        }
      });

      return res.status(201).json(newItem);
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

// Update cart item quantity
export const updateCartItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const customerId = req.userId;

    if (quantity < 0) {
      return res.status(400).json({ error: "Quantity cannot be negative" });
    }

    // Get cart
    const cart = await prisma.cart.findUnique({
      where: { customerId }
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Check if item exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.cartId,
          productId
        }
      },
      include: { product: true }
    });

    if (!existingItem) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    if (quantity === 0) {
      // Remove item from cart
      await prisma.cartItem.delete({
        where: {
          cartId_productId: {
            cartId: cart.cartId,
            productId
          }
        }
      });

      return res.json({ message: "Item removed from cart" });
    }

    // Check stock availability
    if (existingItem.product.stockQuantity < quantity) {
      return res.status(400).json({ 
        error: `Only ${existingItem.product.stockQuantity} items available in stock` 
      });
    }

    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId: cart.cartId,
          productId
        }
      },
      data: { quantity },
      include: {
        product: {
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
            category: true
          }
        }
      }
    });

    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ error: "Failed to update cart item" });
  }
};

// Remove item from cart
export const removeFromCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const customerId = req.userId;

    // Get cart
    const cart = await prisma.cart.findUnique({
      where: { customerId }
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Check if item exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.cartId,
          productId
        }
      }
    });

    if (!existingItem) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    // Remove item
    await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.cartId,
          productId
        }
      }
    });

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
};

// Clear cart
export const clearCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customerId = req.userId;

    // Get cart
    const cart = await prisma.cart.findUnique({
      where: { customerId }
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Remove all items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.cartId }
    });

    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
};

// Get cart summary
export const getCartSummary = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customerId = req.userId;

    const cart = await prisma.cart.findUnique({
      where: { customerId },
      include: {
        items: {
          include: {
            product: {
              select: {
                productId: true,
                name: true,
                price: true,
                stockQuantity: true,
                dealer: {
                  select: {
                    userId: true,
                    businessName: true,
                    storeName: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return res.json({
        itemCount: 0,
        totalAmount: 0,
        itemsByDealer: []
      });
    }

    // Group items by dealer
    const itemsByDealer = new Map();
    
    for (const item of cart.items) {
      const dealerId = item.product.dealer.userId;
      if (!itemsByDealer.has(dealerId)) {
        itemsByDealer.set(dealerId, {
          dealerId,
          dealerName: item.product.dealer.businessName || item.product.dealer.storeName,
          items: [],
          subtotal: 0
        });
      }
      
      const dealerGroup = itemsByDealer.get(dealerId);
      dealerGroup.items.push(item);
      dealerGroup.subtotal += item.product.price * item.quantity;
    }

    const totalAmount = Array.from(itemsByDealer.values())
      .reduce((sum, group) => sum + group.subtotal, 0);

    res.json({
      itemCount: cart.items.length,
      totalAmount,
      itemsByDealer: Array.from(itemsByDealer.values())
    });
  } catch (error) {
    console.error("Error fetching cart summary:", error);
    res.status(500).json({ error: "Failed to fetch cart summary" });
  }
};
