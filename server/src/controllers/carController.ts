import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all car brands
export const getCarBrands = async (req: Request, res: Response) => {
  try {
    const brands = await prisma.carBrand.findMany({
      orderBy: { name: "asc" }
    });

    res.json(brands);
  } catch (error) {
    console.error("Error fetching car brands:", error);
    res.status(500).json({ error: "Failed to fetch car brands" });
  }
};

// Get car models by brand
export const getCarModelsByBrand = async (req: Request, res: Response) => {
  try {
    const { brandId } = req.params;
    
    const models = await prisma.carModel.findMany({
      where: { brandId },
      orderBy: { name: "asc" }
    });

    res.json(models);
  } catch (error) {
    console.error("Error fetching car models:", error);
    res.status(500).json({ error: "Failed to fetch car models" });
  }
};

// Get all car models with brand info
export const getAllCarModels = async (req: Request, res: Response) => {
  try {
    const models = await prisma.carModel.findMany({
      include: {
        brand: true
      },
      orderBy: [
        { brand: { name: "asc" } },
        { name: "asc" }
      ]
    });

    res.json(models);
  } catch (error) {
    console.error("Error fetching car models:", error);
    res.status(500).json({ error: "Failed to fetch car models" });
  }
};

// Create new car brand (Admin only)
export const createCarBrand = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Brand name is required" });
    }

    const brand = await prisma.carBrand.create({
      data: { name }
    });

    res.status(201).json(brand);
  } catch (error: any) {
    console.error("Error creating car brand:", error);
    if (error.code === "P2002") {
      res.status(400).json({ error: "Brand name already exists" });
    } else {
      res.status(500).json({ error: "Failed to create car brand" });
    }
  }
};

// Create new car model (Admin only)
export const createCarModel = async (req: Request, res: Response) => {
  try {
    const { name, brandId, yearStart, yearEnd } = req.body;

    if (!name || !brandId || !yearStart || !yearEnd) {
      return res.status(400).json({ 
        error: "Name, brandId, yearStart, and yearEnd are required" 
      });
    }

    // Verify brand exists
    const brand = await prisma.carBrand.findUnique({
      where: { brandId }
    });

    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    const model = await prisma.carModel.create({
      data: {
        name,
        brandId,
        yearStart,
        yearEnd
      },
      include: {
        brand: true
      }
    });

    res.status(201).json(model);
  } catch (error) {
    console.error("Error creating car model:", error);
    res.status(500).json({ error: "Failed to create car model" });
  }
};

// Update car brand (Admin only)
export const updateCarBrand = async (req: Request, res: Response) => {
  try {
    const { brandId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Brand name is required" });
    }

    const brand = await prisma.carBrand.update({
      where: { brandId },
      data: { name }
    });

    res.json(brand);
  } catch (error: any) {
    console.error("Error updating car brand:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Brand not found" });
    } else if (error.code === "P2002") {
      res.status(400).json({ error: "Brand name already exists" });
    } else {
      res.status(500).json({ error: "Failed to update car brand" });
    }
  }
};

// Update car model (Admin only)
export const updateCarModel = async (req: Request, res: Response) => {
  try {
    const { modelId } = req.params;
    const { name, yearStart, yearEnd } = req.body;

    if (!name || !yearStart || !yearEnd) {
      return res.status(400).json({ 
        error: "Name, yearStart, and yearEnd are required" 
      });
    }

    const model = await prisma.carModel.update({
      where: { modelId },
      data: {
        name,
        yearStart,
        yearEnd
      },
      include: {
        brand: true
      }
    });

    res.json(model);
  } catch (error: any) {
    console.error("Error updating car model:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Model not found" });
    } else {
      res.status(500).json({ error: "Failed to update car model" });
    }
  }
};

// Delete car brand (Admin only)
export const deleteCarBrand = async (req: Request, res: Response) => {
  try {
    const { brandId } = req.params;

    // Check if brand has models
    const modelsCount = await prisma.carModel.count({
      where: { brandId }
    });

    if (modelsCount > 0) {
      return res.status(400).json({ 
        error: "Cannot delete brand with existing models" 
      });
    }

    await prisma.carBrand.delete({
      where: { brandId }
    });

    res.json({ message: "Brand deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting car brand:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Brand not found" });
    } else {
      res.status(500).json({ error: "Failed to delete car brand" });
    }
  }
};

// Delete car model (Admin only)
export const deleteCarModel = async (req: Request, res: Response) => {
  try {
    const { modelId } = req.params;

    // Check if model has compatible products
    const productsCount = await prisma.productCompatibility.count({
      where: { modelId }
    });

    if (productsCount > 0) {
      return res.status(400).json({ 
        error: "Cannot delete model with compatible products" 
      });
    }

    await prisma.carModel.delete({
      where: { modelId }
    });

    res.json({ message: "Model deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting car model:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Model not found" });
    } else {
      res.status(500).json({ error: "Failed to delete car model" });
    }
  }
};
