import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "../.env") });

const prisma = new PrismaClient();

async function main() {
  console.log("Starting marketplace seed...");

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productCompatibility.deleteMany();
  await prisma.product.deleteMany();
  await prisma.carModel.deleteMany();
  await prisma.carBrand.deleteMany();
  await prisma.partCategory.deleteMany();
  await prisma.users.deleteMany();
  await prisma.sales.deleteMany();
  await prisma.purchases.deleteMany();
  await prisma.expenseByCategory.deleteMany();
  await prisma.expenseSummary.deleteMany();
  await prisma.purchaseSummary.deleteMany();
  await prisma.salesSummary.deleteMany();
  await prisma.expenses.deleteMany();

  console.log("Cleared existing data");

  // Create Iraq provinces and cities data
  const iraqProvinces = [
    "Baghdad", "Basra", "Nineveh", "Erbil", "Sulaymaniyah", 
    "Dohuk", "Kirkuk", "Anbar", "Karbala", "Najaf", 
    "Babil", "Wasit", "Diyala", "Maysan", "Muthanna", 
    "Qadisiyyah", "Dhi Qar", "Maysan"
  ];

  // Create car brands
  const carBrands = [
    { name: "Toyota" },
    { name: "Nissan" },
    { name: "Hyundai" },
    { name: "Kia" },
    { name: "BMW" },
    { name: "Mercedes-Benz" },
    { name: "Audi" },
    { name: "Volkswagen" },
    { name: "Ford" },
    { name: "Chevrolet" },
    { name: "Honda" },
    { name: "Mazda" },
    { name: "Mitsubishi" },
    { name: "Suzuki" },
    { name: "Isuzu" }
  ];

  for (const brand of carBrands) {
    await prisma.carBrand.create({ data: brand });
  }

  console.log("Created car brands");

  // Create car models for each brand
  const toyotaModels = [
    { name: "Corolla", yearStart: 2010, yearEnd: 2024 },
    { name: "Camry", yearStart: 2010, yearEnd: 2024 },
    { name: "RAV4", yearStart: 2012, yearEnd: 2024 },
    { name: "Land Cruiser", yearStart: 2008, yearEnd: 2024 },
    { name: "Hilux", yearStart: 2010, yearEnd: 2024 },
    { name: "Prius", yearStart: 2015, yearEnd: 2024 }
  ];

  const nissanModels = [
    { name: "Altima", yearStart: 2010, yearEnd: 2024 },
    { name: "Sentra", yearStart: 2010, yearEnd: 2024 },
    { name: "Pathfinder", yearStart: 2012, yearEnd: 2024 },
    { name: "X-Trail", yearStart: 2014, yearEnd: 2024 },
    { name: "Navara", yearStart: 2010, yearEnd: 2024 },
    { name: "Patrol", yearStart: 2008, yearEnd: 2024 }
  ];

  const hyundaiModels = [
    { name: "Elantra", yearStart: 2010, yearEnd: 2024 },
    { name: "Sonata", yearStart: 2010, yearEnd: 2024 },
    { name: "Tucson", yearStart: 2012, yearEnd: 2024 },
    { name: "Santa Fe", yearStart: 2010, yearEnd: 2024 },
    { name: "Accent", yearStart: 2010, yearEnd: 2024 }
  ];

  const kiaModels = [
    { name: "Optima", yearStart: 2010, yearEnd: 2024 },
    { name: "Forte", yearStart: 2010, yearEnd: 2024 },
    { name: "Sportage", yearStart: 2012, yearEnd: 2024 },
    { name: "Sorento", yearStart: 2010, yearEnd: 2024 },
    { name: "Rio", yearStart: 2010, yearEnd: 2024 }
  ];

  const bmwModels = [
    { name: "3 Series", yearStart: 2010, yearEnd: 2024 },
    { name: "5 Series", yearStart: 2010, yearEnd: 2024 },
    { name: "X3", yearStart: 2012, yearEnd: 2024 },
    { name: "X5", yearStart: 2010, yearEnd: 2024 },
    { name: "7 Series", yearStart: 2010, yearEnd: 2024 }
  ];

  const mercedesModels = [
    { name: "C-Class", yearStart: 2010, yearEnd: 2024 },
    { name: "E-Class", yearStart: 2010, yearEnd: 2024 },
    { name: "S-Class", yearStart: 2010, yearEnd: 2024 },
    { name: "GLC", yearStart: 2015, yearEnd: 2024 },
    { name: "GLE", yearStart: 2010, yearEnd: 2024 }
  ];

  const brandModels = [
    { brandName: "Toyota", models: toyotaModels },
    { brandName: "Nissan", models: nissanModels },
    { brandName: "Hyundai", models: hyundaiModels },
    { brandName: "Kia", models: kiaModels },
    { brandName: "BMW", models: bmwModels },
    { brandName: "Mercedes-Benz", models: mercedesModels }
  ];

  for (const { brandName, models } of brandModels) {
    const brand = await prisma.carBrand.findUnique({ where: { name: brandName } });
    if (brand) {
      for (const model of models) {
        await prisma.carModel.create({
          data: {
            ...model,
            brandId: brand.brandId
          }
        });
      }
    }
  }

  console.log("Created car models");

  // Create part categories
  const partCategories = [
    { name: "Engine Parts", description: "Engine components and accessories" },
    { name: "Transmission", description: "Transmission system parts" },
    { name: "Brakes", description: "Brake system components" },
    { name: "Electrical", description: "Electrical system parts" },
    { name: "Body Parts", description: "Exterior body components" },
    { name: "Suspension", description: "Suspension system parts" },
    { name: "Exhaust", description: "Exhaust system components" },
    { name: "Filters", description: "Air, oil, and fuel filters" },
    { name: "Lights", description: "Headlights, taillights, and indicators" },
    { name: "Interior", description: "Interior components and accessories" },
    { name: "Tires & Wheels", description: "Tires, rims, and wheel accessories" },
    { name: "Oil & Fluids", description: "Engine oil, coolant, and other fluids" }
  ];

  for (const category of partCategories) {
    await prisma.partCategory.create({ data: category });
  }

  console.log("Created part categories");

  // Create sample users
  const users = [
    {
      clerkId: "user_customer_1",
      name: "Ahmed Al-Mahmoud",
      email: "ahmed@example.com",
      role: "CUSTOMER" as const,
      phoneNumber: "+964-770-123-4567",
      address: "Al-Mansour, Baghdad",
      city: "Baghdad",
      province: "Baghdad",
      isApproved: true
    },
    {
      clerkId: "user_customer_2",
      name: "Fatima Al-Zahra",
      email: "fatima@example.com",
      role: "CUSTOMER" as const,
      phoneNumber: "+964-770-234-5678",
      address: "Al-Basra, Basra",
      city: "Basra",
      province: "Basra",
      isApproved: true
    },
    {
      clerkId: "user_dealer_1",
      name: "Mohammed Auto Parts",
      email: "mohammed@autoparts.com",
      role: "DEALER" as const,
      phoneNumber: "+964-770-345-6789",
      address: "Al-Karrada, Baghdad",
      city: "Baghdad",
      province: "Baghdad",
      isApproved: true,
      businessName: "Mohammed Auto Parts LLC",
      businessLicense: "BAG-2024-001",
      storeName: "Mohammed Auto Parts - Karrada Branch"
    },
    {
      clerkId: "user_dealer_2",
      name: "Basra Spare Parts",
      email: "basra@spareparts.com",
      role: "DEALER" as const,
      phoneNumber: "+964-770-456-7890",
      address: "Al-Zubair, Basra",
      city: "Basra",
      province: "Basra",
      isApproved: true,
      businessName: "Basra Spare Parts Co.",
      businessLicense: "BAS-2024-002",
      storeName: "Basra Spare Parts - Main Store"
    },
    {
      clerkId: "user_admin_1",
      name: "Admin User",
      email: "admin@marketplace.com",
      role: "ADMIN" as const,
      phoneNumber: "+964-770-000-0000",
      address: "Admin Office, Baghdad",
      city: "Baghdad",
      province: "Baghdad",
      isApproved: true
    }
  ];

  for (const user of users) {
    await prisma.users.create({ data: user });
  }

  console.log("Created users");

  // Get created data for relationships
  const toyotaBrand = await prisma.carBrand.findUnique({ where: { name: "Toyota" } });
  const nissanBrand = await prisma.carBrand.findUnique({ where: { name: "Nissan" } });
  const hyundaiBrand = await prisma.carBrand.findUnique({ where: { name: "Hyundai" } });
  
  const corollaModel = await prisma.carModel.findFirst({ where: { name: "Corolla" } });
  const camryModel = await prisma.carModel.findFirst({ where: { name: "Camry" } });
  const altimaModel = await prisma.carModel.findFirst({ where: { name: "Altima" } });
  const elantraModel = await prisma.carModel.findFirst({ where: { name: "Elantra" } });

  const engineCategory = await prisma.partCategory.findUnique({ where: { name: "Engine Parts" } });
  const brakeCategory = await prisma.partCategory.findUnique({ where: { name: "Brakes" } });
  const electricalCategory = await prisma.partCategory.findUnique({ where: { name: "Electrical" } });
  const filterCategory = await prisma.partCategory.findUnique({ where: { name: "Filters" } });

  const dealer1 = await prisma.users.findUnique({ where: { clerkId: "user_dealer_1" } });
  const dealer2 = await prisma.users.findUnique({ where: { clerkId: "user_dealer_2" } });

  // Create sample products
  const products = [
    {
      name: "Toyota Corolla Air Filter",
      price: 15000, // IQD
      stockQuantity: 50,
      description: "High-quality air filter for Toyota Corolla 2010-2024. Improves engine performance and fuel efficiency.",
      partNumber: "17801-0E020",
      oemNumber: "17801-0E020",
      condition: "NEW" as const,
      warranty: "1 year",
      manufacturer: "Toyota",
      images: ["https://example.com/air-filter-1.jpg", "https://example.com/air-filter-2.jpg"],
      isApproved: true,
      dealerId: dealer1!.userId,
      categoryId: filterCategory!.categoryId
    },
    {
      name: "Toyota Camry Brake Pads Set",
      price: 85000,
      stockQuantity: 25,
      description: "Complete brake pads set for Toyota Camry 2010-2024. Ceramic compound for longer life and better performance.",
      partNumber: "04465-0E020",
      oemNumber: "04465-0E020",
      condition: "NEW" as const,
      warranty: "2 years",
      manufacturer: "Toyota",
      images: ["https://example.com/brake-pads-1.jpg"],
      isApproved: true,
      dealerId: dealer1!.userId,
      categoryId: brakeCategory!.categoryId
    },
    {
      name: "Nissan Altima Spark Plugs Set",
      price: 25000,
      stockQuantity: 30,
      description: "Set of 4 iridium spark plugs for Nissan Altima 2010-2024. Improves fuel efficiency and engine performance.",
      partNumber: "22401-1EA0A",
      oemNumber: "22401-1EA0A",
      condition: "NEW" as const,
      warranty: "3 years",
      manufacturer: "Nissan",
      images: ["https://example.com/spark-plugs-1.jpg"],
      isApproved: true,
      dealerId: dealer2!.userId,
      categoryId: engineCategory!.categoryId
    },
    {
      name: "Hyundai Elantra Alternator",
      price: 180000,
      stockQuantity: 8,
      description: "High-output alternator for Hyundai Elantra 2010-2024. 120A output for reliable electrical power.",
      partNumber: "31120-2A000",
      oemNumber: "31120-2A000",
      condition: "REFURBISHED" as const,
      warranty: "1 year",
      manufacturer: "Hyundai",
      images: ["https://example.com/alternator-1.jpg"],
      isApproved: true,
      dealerId: dealer2!.userId,
      categoryId: electricalCategory!.categoryId
    }
  ];

  for (const product of products) {
    const createdProduct = await prisma.product.create({ data: product });
    
    // Add compatibility based on product name
    if (product.name.includes("Corolla") && corollaModel) {
      await prisma.productCompatibility.create({
        data: {
          productId: createdProduct.productId,
          modelId: corollaModel.modelId
        }
      });
    }
    if (product.name.includes("Camry") && camryModel) {
      await prisma.productCompatibility.create({
        data: {
          productId: createdProduct.productId,
          modelId: camryModel.modelId
        }
      });
    }
    if (product.name.includes("Altima") && altimaModel) {
      await prisma.productCompatibility.create({
        data: {
          productId: createdProduct.productId,
          modelId: altimaModel.modelId
        }
      });
    }
    if (product.name.includes("Elantra") && elantraModel) {
      await prisma.productCompatibility.create({
        data: {
          productId: createdProduct.productId,
          modelId: elantraModel.modelId
        }
      });
    }
  }

  console.log("Created products with compatibility");

  // Create some sample analytics data for dealers
  const salesData = [
    {
      productId: (await prisma.product.findFirst({ where: { name: "Toyota Corolla Air Filter" } }))!.productId,
      quantity: 5,
      unitPrice: 15000,
      totalAmount: 75000
    },
    {
      productId: (await prisma.product.findFirst({ where: { name: "Toyota Camry Brake Pads Set" } }))!.productId,
      quantity: 2,
      unitPrice: 85000,
      totalAmount: 170000
    }
  ];

  for (const sale of salesData) {
    await prisma.sales.create({ data: sale });
  }

  console.log("Created sample sales data");

  console.log("Marketplace seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });