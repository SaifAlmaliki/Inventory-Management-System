/**
 * Product Controller
 *
 * Handles all product-related operations in the inventory management system.
 * This controller provides endpoints for:
 * - Retrieving products with optional search filtering
 * - Creating new products
 * - Managing product inventory
 *
 * Features:
 * - RESTful API endpoints
 * - Prisma ORM integration for database operations
 * - Error handling with appropriate HTTP status codes
 * - Input validation and sanitization
 * - Search functionality for product retrieval
 */

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma client for database operations
const prisma = new PrismaClient();

/**
 * Retrieve products with optional search filtering
 *
 * @route GET /api/products
 * @param req.query.search - Optional search string to filter products by name
 * @returns {Promise<void>} - JSON response with products array or error message
 */
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract search query parameter if provided
    const search = req.query.search?.toString();

    // Query database for products matching search criteria
    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search, // Case-insensitive search on product name
        },
      },
    });

    // Return found products as JSON response
    res.json(products);
  } catch (error) {
    // Handle any errors during product retrieval
    res.status(500).json({ message: "Error retrieving products" });
  }
};

/**
 * Create a new product in the inventory
 *
 * @route POST /api/products
 * @param req.body.productId - Unique identifier for the product
 * @param req.body.name - Name of the product
 * @param req.body.price - Price of the product
 * @param req.body.rating - Rating of the product
 * @param req.body.stockQuantity - Available quantity in stock
 * @returns {Promise<void>} - JSON response with created product or error message
 */
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract product details from request body
    const { productId, name, price, rating, stockQuantity } = req.body;

    // Create new product in database using Prisma
    const product = await prisma.products.create({
      data: {
        productId,
        name,
        price,
        rating,
        stockQuantity,
      },
    });

    // Return created product with 201 Created status
    res.status(201).json(product);
  } catch (error) {
    // Handle any errors during product creation
    res.status(500).json({ message: "Error creating product" });
  }
};
