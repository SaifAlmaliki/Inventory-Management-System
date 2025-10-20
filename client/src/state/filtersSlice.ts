import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductSearchFilters, ProductCondition } from "./api";

interface FiltersState extends ProductSearchFilters {
  // Additional UI state
  isFiltersOpen: boolean;
}

const initialState: FiltersState = {
  search: "",
  brandId: "",
  modelId: "",
  categoryId: "",
  condition: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  customerProvince: "",
  customerCity: "",
  page: 1,
  limit: 20,
  sortBy: "location",
  isFiltersOpen: false,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1; // Reset to first page when searching
    },
    setBrand: (state, action: PayloadAction<string>) => {
      state.brandId = action.payload;
      state.modelId = ""; // Clear model when brand changes
      state.page = 1;
    },
    setModel: (state, action: PayloadAction<string>) => {
      state.modelId = action.payload;
      state.page = 1;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.categoryId = action.payload;
      state.page = 1;
    },
    setCondition: (state, action: PayloadAction<ProductCondition | undefined>) => {
      state.condition = action.payload;
      state.page = 1;
    },
    setPriceRange: (state, action: PayloadAction<{ min?: number; max?: number }>) => {
      state.minPrice = action.payload.min;
      state.maxPrice = action.payload.max;
      state.page = 1;
    },
    setLocation: (state, action: PayloadAction<{ province: string; city: string }>) => {
      state.customerProvince = action.payload.province;
      state.customerCity = action.payload.city;
      state.page = 1;
    },
    setSortBy: (state, action: PayloadAction<"location" | "price" | "rating" | "newest">) => {
      state.sortBy = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1;
    },
    toggleFilters: (state) => {
      state.isFiltersOpen = !state.isFiltersOpen;
    },
    clearFilters: (state) => {
      state.search = "";
      state.brandId = "";
      state.modelId = "";
      state.categoryId = "";
      state.condition = undefined;
      state.minPrice = undefined;
      state.maxPrice = undefined;
      state.page = 1;
      state.sortBy = "location";
    },
    setFilters: (state, action: PayloadAction<Partial<ProductSearchFilters>>) => {
      Object.assign(state, action.payload);
      state.page = 1; // Reset to first page when filters change
    },
  },
});

export const {
  setSearch,
  setBrand,
  setModel,
  setCategory,
  setCondition,
  setPriceRange,
  setLocation,
  setSortBy,
  setPage,
  setLimit,
  toggleFilters,
  clearFilters,
  setFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
