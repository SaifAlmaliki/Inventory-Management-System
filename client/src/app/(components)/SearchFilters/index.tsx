"use client";

import { useState, useEffect } from "react";
import { CarBrand, PartCategory, ProductCondition, ProductSearchFilters } from "@/state/api";
import { useGetCarModelsByBrandQuery } from "@/state/api";
import { ChevronDown, X } from "lucide-react";

interface SearchFiltersProps {
  brands: CarBrand[];
  categories: PartCategory[];
  filters: ProductSearchFilters;
  onFilterChange: (filters: Partial<ProductSearchFilters>) => void;
  onClearFilters: () => void;
  loading: boolean;
}

const SearchFilters = ({
  brands,
  categories,
  filters,
  onFilterChange,
  onClearFilters,
  loading,
}: SearchFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(filters.brandId || "");
  const [selectedModel, setSelectedModel] = useState(filters.modelId || "");

  // Fetch models when brand changes
  const { data: models, isLoading: modelsLoading } = useGetCarModelsByBrandQuery(
    selectedBrand,
    { skip: !selectedBrand }
  );

  useEffect(() => {
    if (selectedBrand !== filters.brandId) {
      setSelectedModel("");
      onFilterChange({ brandId: selectedBrand, modelId: "" });
    }
  }, [selectedBrand, filters.brandId, onFilterChange]);

  useEffect(() => {
    if (selectedModel !== filters.modelId) {
      onFilterChange({ modelId: selectedModel });
    }
  }, [selectedModel, filters.modelId, onFilterChange]);

  const handleBrandChange = (brandId: string) => {
    setSelectedBrand(brandId);
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
  };

  const handleCategoryChange = (categoryId: string) => {
    onFilterChange({ categoryId: categoryId || undefined });
  };

  const handleConditionChange = (condition: ProductCondition | undefined) => {
    onFilterChange({ condition });
  };

  const handlePriceRangeChange = (field: "minPrice" | "maxPrice", value: string) => {
    const numValue = value ? Number(value) : undefined;
    onFilterChange({ [field]: numValue });
  };

  const handleLocationChange = (field: "customerProvince" | "customerCity", value: string) => {
    onFilterChange({ [field]: value || undefined });
  };

  const iraqProvinces = [
    "Baghdad", "Basra", "Nineveh", "Erbil", "Sulaymaniyah", 
    "Dohuk", "Kirkuk", "Anbar", "Karbala", "Najaf", 
    "Babil", "Wasit", "Diyala", "Maysan", "Muthanna", 
    "Qadisiyyah", "Dhi Qar"
  ];

  const iraqCities = {
    "Baghdad": ["Baghdad", "Al-Karkh", "Al-Rusafa", "Al-Mansour", "Al-Karrada"],
    "Basra": ["Basra", "Al-Zubair", "Al-Faw", "Abu Al-Khasib"],
    "Nineveh": ["Mosul", "Tal Afar", "Sinjar", "Al-Hamdaniya"],
    "Erbil": ["Erbil", "Soran", "Koisanjaq", "Mergasur"],
    "Sulaymaniyah": ["Sulaymaniyah", "Halabja", "Ranya", "Darbandikhan"],
    "Dohuk": ["Dohuk", "Zakho", "Amedi", "Sumel"],
    "Kirkuk": ["Kirkuk", "Al-Hawija", "Dibis", "Al-Rashad"],
    "Anbar": ["Ramadi", "Fallujah", "Al-Qaim", "Hit"],
    "Karbala": ["Karbala", "Al-Hindiya", "Ain Al-Tamr"],
    "Najaf": ["Najaf", "Al-Kufa", "Al-Manathera", "Al-Mishkhab"],
    "Babil": ["Hillah", "Al-Mahawil", "Al-Musayyib", "Al-Hashimiya"],
    "Wasit": ["Kut", "Al-Suwaira", "Al-Aziziyah", "Al-Nu'maniya"],
    "Diyala": ["Baqubah", "Al-Khalis", "Al-Muqdadiya", "Khanaqin"],
    "Maysan": ["Amarah", "Al-Kahla", "Al-Maimouna", "Al-Majar Al-Kabir"],
    "Muthanna": ["Samawah", "Al-Rumaitha", "Al-Salman", "Al-Khidhir"],
    "Qadisiyyah": ["Diwaniyah", "Al-Shamiya", "Al-Hamza", "Al-Diwaniyah"],
    "Dhi Qar": ["Nasiriyah", "Al-Rifai", "Al-Shatra", "Al-Nasir"]
  };

  const getCitiesForProvince = (province: string) => {
    return iraqCities[province as keyof typeof iraqCities] || [];
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Car Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Car Brand
          </label>
          <select
            value={selectedBrand}
            onChange={(e) => handleBrandChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand.brandId} value={brand.brandId}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Car Model */}
        {selectedBrand && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Car Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => handleModelChange(e.target.value)}
              disabled={modelsLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">All Models</option>
              {models?.map((model) => (
                <option key={model.modelId} value={model.modelId}>
                  {model.name} ({model.yearStart}-{model.yearEnd})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.categoryId || ""}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition
          </label>
          <select
            value={filters.condition || ""}
            onChange={(e) => handleConditionChange(e.target.value as ProductCondition || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Conditions</option>
            <option value={ProductCondition.NEW}>New</option>
            <option value={ProductCondition.USED}>Used</option>
            <option value={ProductCondition.REFURBISHED}>Refurbished</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range (IQD)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ""}
              onChange={(e) => handlePriceRangeChange("minPrice", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ""}
              onChange={(e) => handlePriceRangeChange("maxPrice", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Location
          </label>
          <div className="space-y-2">
            <select
              value={filters.customerProvince || ""}
              onChange={(e) => handleLocationChange("customerProvince", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Province</option>
              {iraqProvinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
            
            {filters.customerProvince && (
              <select
                value={filters.customerCity || ""}
                onChange={(e) => handleLocationChange("customerCity", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select City</option>
                {getCitiesForProvince(filters.customerProvince).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
