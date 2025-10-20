import { Router } from "express";
import {
  getCarBrands,
  getCarModelsByBrand,
  getAllCarModels,
  createCarBrand,
  createCarModel,
  updateCarBrand,
  updateCarModel,
  deleteCarBrand,
  deleteCarModel
} from "../controllers/carController";
import { authenticateUser, requireAdmin } from "../middleware/clerkAuth";

const router = Router();

// Public routes
router.get("/brands", getCarBrands);
router.get("/models", getAllCarModels);
router.get("/brands/:brandId/models", getCarModelsByBrand);

// Admin only routes
router.post("/brands", authenticateUser, requireAdmin, createCarBrand);
router.post("/models", authenticateUser, requireAdmin, createCarModel);
router.put("/brands/:brandId", authenticateUser, requireAdmin, updateCarBrand);
router.put("/models/:modelId", authenticateUser, requireAdmin, updateCarModel);
router.delete("/brands/:brandId", authenticateUser, requireAdmin, deleteCarBrand);
router.delete("/models/:modelId", authenticateUser, requireAdmin, deleteCarModel);

export default router;
