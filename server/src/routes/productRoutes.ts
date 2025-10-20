import { Router } from "express";
import { createProduct, searchProducts } from "../controllers/productController";

const router = Router();

router.get("/", searchProducts);
router.post("/", createProduct);

export default router;
