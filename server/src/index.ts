import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
/* ROUTE IMPORTS */
import dashboardRoutes from "./routes/dashboardRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import expenseRoutes from "./routes/expenseRoutes";
// New marketplace routes
import carRoutes from "./routes/carRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import orderRoutes from "./routes/orderRoutes";
import cartRoutes from "./routes/cartRoutes";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
// Legacy routes (for backward compatibility)
app.use("/dashboard", dashboardRoutes); // http://localhost:8000/dashboard
app.use("/products", productRoutes); // http://localhost:8000/products
app.use("/users", userRoutes); // http://localhost:8000/users
app.use("/expenses", expenseRoutes); // http://localhost:8000/expenses

// New marketplace routes
app.use("/api/cars", carRoutes); // http://localhost:8000/api/cars
app.use("/api/categories", categoryRoutes); // http://localhost:8000/api/categories
app.use("/api/orders", orderRoutes); // http://localhost:8000/api/orders
app.use("/api/cart", cartRoutes); // http://localhost:8000/api/cart
app.use("/api/auth", authRoutes); // http://localhost:8000/api/auth
app.use("/api/admin", adminRoutes); // http://localhost:8000/api/admin

/* SERVER */
const port = Number(process.env.PORT) || 3001;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
