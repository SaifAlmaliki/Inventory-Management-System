import { Router } from "express";
import {
  getPartCategories,
  getPartCategoryById,
  createPartCategory,
  updatePartCategory,
  deletePartCategory,
  getProductsByCategory
} from "../controllers/categoryController";
import { authenticateUser, requireAdmin } from "../middleware/clerkAuth";

const router = Router();

// Public routes
router.get("/", getPartCategories);
router.get("/:categoryId", getPartCategoryById);
router.get("/:categoryId/products", getProductsByCategory);

// Admin only routes
router.post("/", authenticateUser, requireAdmin, createPartCategory);
router.put("/:categoryId", authenticateUser, requireAdmin, updatePartCategory);
router.delete("/:categoryId", authenticateUser, requireAdmin, deletePartCategory);

export default router;
