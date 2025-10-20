import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartSummary
} from "../controllers/cartController";
import { authenticateUser, requireCustomer } from "../middleware/clerkAuth";

const router = Router();

// All routes require authentication and customer role
router.use(authenticateUser);
router.use(requireCustomer);

router.get("/", getCart);
router.get("/summary", getCartSummary);
router.post("/add", addToCart);
router.put("/items/:productId", updateCartItem);
router.delete("/items/:productId", removeFromCart);
router.delete("/clear", clearCart);

export default router;
