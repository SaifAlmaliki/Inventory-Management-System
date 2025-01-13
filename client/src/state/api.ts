/**
 * API Configuration and Type Definitions for Inventory Management System
 *
 * This file contains the Redux Toolkit Query API setup for managing API requests
 * and data fetching in the inventory management system. It includes:
 * - Type definitions for Products, Sales, Purchases, Expenses, and Users
 * - API endpoint configurations for CRUD operations
 * - Auto-generated React hooks for data fetching
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Product interface for existing products in the system
export interface Product {
  productId: string;
  name: string;
  price: number;
  rating?: number;  // Optional rating field
  stockQuantity: number;
}

// Interface for creating new products (excludes productId)
export interface NewProduct {
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
}

// Interface for sales summary data with change percentage tracking
export interface SalesSummary {
  salesSummaryId: string;
  totalValue: number;
  changePercentage?: number;  // Optional field to track sales change
  date: string;
}

// Interface for purchase summary data with change tracking
export interface PurchaseSummary {
  purchaseSummaryId: string;
  totalPurchased: number;
  changePercentage?: number;  // Optional field to track purchase change
  date: string;
}

// Interface for expense summary data
export interface ExpenseSummary {
  expenseSummarId: string;
  totalExpenses: number;
  date: string;
}

// Interface for categorized expense data
export interface ExpenseByCategorySummary {
  expenseByCategorySummaryId: string;
  category: string;
  amount: string;
  date: string;
}

// Combined interface for all dashboard metrics
export interface DashboardMetrics {
  popularProducts: Product[];
  salesSummary: SalesSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
}

// User interface for user management
export interface User {
  userId: string;
  name: string;
  email: string;
}

// RTK Query API configuration
export const api = createApi({
  // Configure base query with environment-specific API URL
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  // Define cache tags for invalidation
  tagTypes: ["DashboardMetrics", "Products", "Users", "Expenses"],
  endpoints: (build) => ({
    // Get dashboard metrics endpoint
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"],
    }),
    // Get products with optional search parameter
    getProducts: build.query<Product[], string | void>({
      query: (search) => ({
        url: "/products",
        params: search ? { search } : {},
      }),
      providesTags: ["Products"],
    }),
    // Create new product endpoint
    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),
    // Get users endpoint
    getUsers: build.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    // Get expenses by category endpoint
    getExpensesByCategory: build.query<ExpenseByCategorySummary[], void>({
      query: () => "/expenses",
      providesTags: ["Expenses"],
    }),
  }),
});

// Export auto-generated hooks for use in components
export const {
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useGetUsersQuery,
  useGetExpensesByCategoryQuery,
} = api;
