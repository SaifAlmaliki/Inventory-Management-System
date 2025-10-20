"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/redux";
import { useSearchProductsQuery, useGetCarBrandsQuery, useGetPartCategoriesQuery } from "@/state/api";
import { setFilters, clearFilters } from "@/state/filtersSlice";
import Header from "@/app/(components)/Header";
import ProductCard from "@/app/(components)/ProductCard";
import SearchFilters from "@/app/(components)/SearchFilters";
import { Product, CarBrand, PartCategory } from "@/state/api";

export default function MarketplacePage() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const [searchQuery, setSearchQuery] = useState(filters.search || "");

  // Fetch data
  const { data: productsData, isLoading: productsLoading, error: productsError } = useSearchProductsQuery(filters);
  const { data: brands, isLoading: brandsLoading } = useGetCarBrandsQuery();
  const { data: categories, isLoading: categoriesLoading } = useGetPartCategoriesQuery();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchQuery }));
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      <Header name="Marketplace" />
      
      {/* Search Bar */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for car parts..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </form>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div className="w-80 flex-shrink-0">
          <SearchFilters
            brands={brands || []}
            categories={categories || []}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            loading={brandsLoading || categoriesLoading}
          />
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {productsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : productsError ? (
            <div className="text-center py-12">
              <p className="text-red-600">Error loading products. Please try again.</p>
            </div>
          ) : !productsData?.products.length ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found. Try adjusting your search filters.</p>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  {productsData.pagination.total} products found
                </p>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="location">Distance</option>
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsData.products.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {productsData.pagination.pages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFilterChange({ page: Math.max(1, filters.page! - 1) })}
                      disabled={filters.page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    <span className="px-4 py-2 text-sm text-gray-600">
                      Page {filters.page} of {productsData.pagination.pages}
                    </span>
                    
                    <button
                      onClick={() => handleFilterChange({ page: Math.min(productsData.pagination.pages, filters.page! + 1) })}
                      disabled={filters.page === productsData.pagination.pages}
                      className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
