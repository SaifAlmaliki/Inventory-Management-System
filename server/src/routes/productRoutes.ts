import { Router } from "express";
import { createProduct, searchProducts, getSimpleProducts } from "../controllers/productController";

const router = Router();

// Simple products endpoint for testing (no auth required)
router.get("/simple", getSimpleProducts);
router.get("/", searchProducts);
router.post("/", createProduct);

export default router;
