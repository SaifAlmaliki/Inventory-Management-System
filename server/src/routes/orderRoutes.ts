import { Router } from "express";
import {
  createOrderFromCart,
  getCustomerOrders,
  getDealerOrders,
  updateOrderStatus,
  getOrderById,
  getOrderAnalytics
} from "../controllers/orderController";
import { authenticateUser, requireCustomer, requireDealer } from "../middleware/clerkAuth";

const router = Router();

// All routes require authentication
router.use(authenticateUser);

// Customer routes
router.post("/create-from-cart", requireCustomer, createOrderFromCart);
router.get("/customer", requireCustomer, getCustomerOrders);
router.get("/customer/:orderId", requireCustomer, getOrderById);

// Dealer routes
router.get("/dealer", requireDealer, getDealerOrders);
router.get("/dealer/:orderId", requireDealer, getOrderById);
router.get("/dealer/analytics", requireDealer, getOrderAnalytics);

// Update order status (dealer, customer for cancellation, admin)
router.put("/:orderId/status", updateOrderStatus);

export default router;
