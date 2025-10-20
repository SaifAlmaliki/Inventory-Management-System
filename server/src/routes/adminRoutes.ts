import { Router } from "express";
import {
  getPlatformAnalytics,
  getDealers,
  updateDealerApproval,
  getProducts,
  updateProductApproval,
  getUsers,
  updateUser,
  getAllOrders,
  generateReport
} from "../controllers/adminController";
import { authenticateUser, requireAdmin } from "../middleware/clerkAuth";

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateUser);
router.use(requireAdmin);

// Analytics
router.get("/analytics", getPlatformAnalytics);

// Dealer management
router.get("/dealers", getDealers);
router.put("/dealers/:dealerId/approval", updateDealerApproval);

// Product management
router.get("/products", getProducts);
router.put("/products/:productId/approval", updateProductApproval);

// User management
router.get("/users", getUsers);
router.put("/users/:userId", updateUser);

// Order management
router.get("/orders", getAllOrders);

// Reports
router.get("/reports", generateReport);

export default router;
