/**
 * API Configuration and Type Definitions for Car Parts Marketplace
 *
 * This file contains the Redux Toolkit Query API setup for managing API requests
 * and data fetching in the car parts marketplace system. It includes:
 * - Type definitions for Products, Cars, Categories, Orders, Cart, and Users
 * - API endpoint configurations for CRUD operations
 * - Auto-generated React hooks for data fetching
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Enums
export enum UserRole {
  CUSTOMER = "CUSTOMER",
  DEALER = "DEALER",
  ADMIN = "ADMIN"
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  DELIVERING = "DELIVERING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export enum ProductCondition {
  NEW = "NEW",
  USED = "USED",
  REFURBISHED = "REFURBISHED"
}

// Car Brand and Model interfaces
export interface CarBrand {
  brandId: string;
  name: string;
}

export interface CarModel {
  modelId: string;
  name: string;
  brandId: string;
  yearStart: number;
  yearEnd: number;
  brand?: CarBrand;
}

// Part Category interface
export interface PartCategory {
  categoryId: string;
  name: string;
  description?: string;
  createdAt: string;
  _count?: {
    products: number;
  };
}

// Product interfaces
export interface Product {
  productId: string;
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
  description?: string;
  partNumber?: string;
  oemNumber?: string;
  condition: ProductCondition;
  warranty?: string;
  manufacturer?: string;
  images?: string[];
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  dealerId: string;
  categoryId: string;
  dealer?: {
    userId: string;
    name: string;
    businessName?: string;
    storeName?: string;
    city?: string;
    province?: string;
    phoneNumber?: string;
  };
  category?: PartCategory;
  compatibility?: ProductCompatibility[];
}

export interface ProductCompatibility {
  compatibilityId: string;
  productId: string;
  modelId: string;
  carModel?: CarModel;
}

// Interface for creating new products
export interface NewProduct {
  name: string;
  price: number;
  description?: string;
  partNumber?: string;
  oemNumber?: string;
  condition: ProductCondition;
  warranty?: string;
  manufacturer?: string;
  images?: string[];
  categoryId: string;
  compatibleModels?: string[];
}

// User interface
export interface User {
  userId: string;
  clerkId: string;
  name: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  address?: string;
  city?: string;
  province?: string;
  isApproved: boolean;
  businessName?: string;
  businessLicense?: string;
  storeName?: string;
  createdAt: string;
  _count?: {
    productsAsDealer?: number;
    ordersAsCustomer?: number;
    ordersAsDealer?: number;
  };
}

// Cart interfaces
export interface Cart {
  cartId: string;
  customerId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  cartItemId: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: Product;
}

// Order interfaces
export interface Order {
  orderId: string;
  orderNumber: string;
  customerId: string;
  dealerId: string;
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryProvince: string;
  customerPhone: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  customer?: {
    userId: string;
    name: string;
    phoneNumber?: string;
  };
  dealer?: {
    userId: string;
    name: string;
    businessName?: string;
    storeName?: string;
    phoneNumber?: string;
  };
}

export interface OrderItem {
  orderItemId: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product?: Product;
}

// Search filters interface
export interface ProductSearchFilters {
  search?: string;
  brandId?: string;
  modelId?: string;
  categoryId?: string;
  condition?: ProductCondition;
  minPrice?: number;
  maxPrice?: number;
  customerProvince?: string;
  customerCity?: string;
  page?: number;
  limit?: number;
  sortBy?: "location" | "price" | "rating" | "newest";
}

// Pagination interface
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// API Response interfaces
export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: Pagination;
}

export interface UsersResponse {
  users: User[];
  pagination: Pagination;
}

export interface DealersResponse {
  dealers: User[];
  pagination: Pagination;
}

// Analytics interfaces
export interface OrderAnalytics {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  ordersByStatus: Array<{
    status: OrderStatus;
    _count: { orderId: number };
  }>;
  period: number;
}

export interface ProductAnalytics {
  totalProducts: number;
  approvedProducts: number;
  pendingProducts: number;
  lowStockProducts: number;
  totalSales: number;
  topProducts: Array<{
    productId: string;
    _sum: { totalAmount: number };
    _count: { saleId: number };
  }>;
  period: number;
}

export interface PlatformAnalytics {
  totalUsers: number;
  totalDealers: number;
  totalCustomers: number;
  totalProducts: number;
  totalOrders: number;
  pendingDealers: number;
  pendingProducts: number;
  totalRevenue: number;
  recentOrders: Order[];
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
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
    prepareHeaders: (headers) => {
      // Add auth token if available
      const token = localStorage.getItem("clerk-token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  // Define cache tags for invalidation
  tagTypes: [
    "DashboardMetrics", "Products", "Users", "Expenses", // Legacy
    "CarBrands", "CarModels", "Categories", "Orders", "Cart", "Auth", "Admin"
  ],
  endpoints: (build) => ({
    // Legacy endpoints (for backward compatibility)
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"],
    }),
    getProducts: build.query<Product[], string | void>({
      query: (search) => ({
        url: "/products/simple",
        params: search ? { search } : {},
      }),
      providesTags: ["Products"],
    }),
    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),
    getUsers: build.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    getExpensesByCategory: build.query<ExpenseByCategorySummary[], void>({
      query: () => "/expenses",
      providesTags: ["Expenses"],
    }),

    // Car Brands and Models
    getCarBrands: build.query<CarBrand[], void>({
      query: () => "/api/cars/brands",
      providesTags: ["CarBrands"],
    }),
    getCarModels: build.query<CarModel[], void>({
      query: () => "/api/cars/models",
      providesTags: ["CarModels"],
    }),
    getCarModelsByBrand: build.query<CarModel[], string>({
      query: (brandId) => `/api/cars/brands/${brandId}/models`,
      providesTags: ["CarModels"],
    }),

    // Categories
    getPartCategories: build.query<PartCategory[], void>({
      query: () => "/api/categories",
      providesTags: ["Categories"],
    }),
    getPartCategoryById: build.query<PartCategory, string>({
      query: (categoryId) => `/api/categories/${categoryId}`,
      providesTags: ["Categories"],
    }),
    getProductsByCategory: build.query<ProductsResponse, { categoryId: string; page?: number; limit?: number; search?: string; approved?: boolean }>({
      query: ({ categoryId, page = 1, limit = 20, search, approved }) => ({
        url: `/api/categories/${categoryId}/products`,
        params: { page, limit, search, approved },
      }),
      providesTags: ["Products"],
    }),

    // Products (Marketplace)
    searchProducts: build.query<ProductsResponse, ProductSearchFilters>({
      query: (filters) => ({
        url: "/api/products/search",
        params: filters,
      }),
      providesTags: ["Products"],
    }),
    getProductById: build.query<Product, string>({
      query: (productId) => `/api/products/${productId}`,
      providesTags: ["Products"],
    }),
    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "/api/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: build.mutation<Product, { productId: string; updates: Partial<NewProduct> }>({
      query: ({ productId, updates }) => ({
        url: `/api/products/${productId}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: build.mutation<{ message: string }, string>({
      query: (productId) => ({
        url: `/api/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    getDealerProducts: build.query<ProductsResponse, { page?: number; limit?: number; search?: string; status?: string }>({
      query: ({ page = 1, limit = 20, search, status } = {}) => ({
        url: "/api/products/dealer",
        params: { page, limit, search, status },
      }),
      providesTags: ["Products"],
    }),
    getProductAnalytics: build.query<ProductAnalytics, { period?: number }>({
      query: ({ period = 30 } = {}) => ({
        url: "/api/products/analytics",
        params: { period },
      }),
      providesTags: ["Products"],
    }),

    // Cart
    getCart: build.query<Cart, void>({
      query: () => "/api/cart",
      providesTags: ["Cart"],
    }),
    getCartSummary: build.query<{ itemCount: number; totalAmount: number; itemsByDealer: any[] }, void>({
      query: () => "/api/cart/summary",
      providesTags: ["Cart"],
    }),
    addToCart: build.mutation<CartItem, { productId: string; quantity?: number }>({
      query: ({ productId, quantity = 1 }) => ({
        url: "/api/cart/add",
        method: "POST",
        body: { productId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: build.mutation<CartItem, { productId: string; quantity: number }>({
      query: ({ productId, quantity }) => ({
        url: `/api/cart/items/${productId}`,
        method: "PUT",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: build.mutation<{ message: string }, string>({
      query: (productId) => ({
        url: `/api/cart/items/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: build.mutation<{ message: string }, void>({
      query: () => ({
        url: "/api/cart/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // Orders
    createOrderFromCart: build.mutation<{ message: string; orders: Order[] }, { deliveryAddress: string; deliveryCity: string; deliveryProvince: string; customerPhone: string }>({
      query: (orderData) => ({
        url: "/api/orders/create-from-cart",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Orders", "Cart"],
    }),
    getCustomerOrders: build.query<OrdersResponse, { page?: number; limit?: number; status?: OrderStatus }>({
      query: ({ page = 1, limit = 20, status } = {}) => ({
        url: "/api/orders/customer",
        params: { page, limit, status },
      }),
      providesTags: ["Orders"],
    }),
    getDealerOrders: build.query<OrdersResponse, { page?: number; limit?: number; status?: OrderStatus }>({
      query: ({ page = 1, limit = 20, status } = {}) => ({
        url: "/api/orders/dealer",
        params: { page, limit, status },
      }),
      providesTags: ["Orders"],
    }),
    getOrderById: build.query<Order, string>({
      query: (orderId) => `/api/orders/${orderId}`,
      providesTags: ["Orders"],
    }),
    updateOrderStatus: build.mutation<Order, { orderId: string; status: OrderStatus }>({
      query: ({ orderId, status }) => ({
        url: `/api/orders/${orderId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),
    getOrderAnalytics: build.query<OrderAnalytics, { period?: number }>({
      query: ({ period = 30 } = {}) => ({
        url: "/api/orders/dealer/analytics",
        params: { period },
      }),
      providesTags: ["Orders"],
    }),

    // Auth
    getUserProfile: build.query<User, string>({
      query: (userId) => `/api/auth/profile/${userId}`,
      providesTags: ["Auth"],
    }),
    updateUserProfile: build.mutation<{ message: string; user: User }, { userId: string; updates: Partial<User> }>({
      query: ({ userId, updates }) => ({
        url: `/api/auth/profile/${userId}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Admin
    getPlatformAnalytics: build.query<PlatformAnalytics, void>({
      query: () => "/api/admin/analytics",
      providesTags: ["Admin"],
    }),
    getDealers: build.query<DealersResponse, { page?: number; limit?: number; status?: string }>({
      query: ({ page = 1, limit = 20, status } = {}) => ({
        url: "/api/admin/dealers",
        params: { page, limit, status },
      }),
      providesTags: ["Admin"],
    }),
    updateDealerApproval: build.mutation<{ message: string; dealer: User }, { dealerId: string; isApproved: boolean }>({
      query: ({ dealerId, isApproved }) => ({
        url: `/api/admin/dealers/${dealerId}/approval`,
        method: "PUT",
        body: { isApproved },
      }),
      invalidatesTags: ["Admin"],
    }),
    getAdminProducts: build.query<ProductsResponse, { page?: number; limit?: number; status?: string; search?: string }>({
      query: ({ page = 1, limit = 20, status, search } = {}) => ({
        url: "/api/admin/products",
        params: { page, limit, status, search },
      }),
      providesTags: ["Admin"],
    }),
    updateProductApproval: build.mutation<{ message: string; product: Product }, { productId: string; isApproved: boolean }>({
      query: ({ productId, isApproved }) => ({
        url: `/api/admin/products/${productId}/approval`,
        method: "PUT",
        body: { isApproved },
      }),
      invalidatesTags: ["Admin", "Products"],
    }),
    getAdminUsers: build.query<UsersResponse, { page?: number; limit?: number; role?: UserRole; search?: string }>({
      query: ({ page = 1, limit = 20, role, search } = {}) => ({
        url: "/api/admin/users",
        params: { page, limit, role, search },
      }),
      providesTags: ["Admin"],
    }),
    updateUser: build.mutation<{ message: string; user: User }, { userId: string; updates: Partial<User> }>({
      query: ({ userId, updates }) => ({
        url: `/api/admin/users/${userId}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["Admin"],
    }),
    getAllOrders: build.query<OrdersResponse, { page?: number; limit?: number; status?: OrderStatus; dealerId?: string; customerId?: string }>({
      query: ({ page = 1, limit = 20, status, dealerId, customerId } = {}) => ({
        url: "/api/admin/orders",
        params: { page, limit, status, dealerId, customerId },
      }),
      providesTags: ["Admin"],
    }),
    generateReport: build.query<any, { type: string; startDate?: string; endDate?: string }>({
      query: ({ type, startDate, endDate }) => ({
        url: "/api/admin/reports",
        params: { type, startDate, endDate },
      }),
      providesTags: ["Admin"],
    }),
  }),
});

// Export auto-generated hooks for use in components
export const {
  // Legacy hooks
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useGetUsersQuery,
  useGetExpensesByCategoryQuery,
  
  // Car hooks
  useGetCarBrandsQuery,
  useGetCarModelsQuery,
  useGetCarModelsByBrandQuery,
  
  // Category hooks
  useGetPartCategoriesQuery,
  useGetPartCategoryByIdQuery,
  useGetProductsByCategoryQuery,
  
  // Product hooks
  useSearchProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation: useCreateMarketplaceProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetDealerProductsQuery,
  useGetProductAnalyticsQuery,
  
  // Cart hooks
  useGetCartQuery,
  useGetCartSummaryQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  
  // Order hooks
  useCreateOrderFromCartMutation,
  useGetCustomerOrdersQuery,
  useGetDealerOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useGetOrderAnalyticsQuery,
  
  // Auth hooks
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  
  // Admin hooks
  useGetPlatformAnalyticsQuery,
  useGetDealersQuery,
  useUpdateDealerApprovalMutation,
  useGetAdminProductsQuery,
  useUpdateProductApprovalMutation,
  useGetAdminUsersQuery,
  useUpdateUserMutation,
  useGetAllOrdersQuery,
  useGenerateReportQuery,
} = api;
