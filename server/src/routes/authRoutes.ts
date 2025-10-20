import { Router } from "express";
import {
  handleClerkWebhook,
  getUserProfile,
  updateUserProfile
} from "../controllers/authController";
import { authenticateUser } from "../middleware/clerkAuth";

const router = Router();

// Webhook route (no auth required)
router.post("/webhook", handleClerkWebhook);

// Protected routes
router.use(authenticateUser);

router.get("/profile/:userId", getUserProfile);
router.put("/profile/:userId", updateUserProfile);

export default router;
