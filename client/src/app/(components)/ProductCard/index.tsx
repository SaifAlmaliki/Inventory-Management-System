"use client";

import { useState } from "react";
import { Product, ProductCondition } from "@/state/api";
import { useAddToCartMutation } from "@/state/api";
import { useAppSelector } from "@/app/redux";
import { ShoppingCart, MapPin, Phone, Star, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addToCart] = useAddToCartMutation();
  const userRole = useAppSelector((state) => state.user.role);

  const handleAddToCart = async () => {
    if (userRole !== "CUSTOMER") return;
    
    setIsAddingToCart(true);
    try {
      await addToCart({ productId: product.productId, quantity: 1 }).unwrap();
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-IQ", {
      style: "currency",
      currency: "IQD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getConditionColor = (condition: ProductCondition) => {
    switch (condition) {
      case ProductCondition.NEW:
        return "bg-green-100 text-green-800";
      case ProductCondition.USED:
        return "bg-yellow-100 text-yellow-800";
      case ProductCondition.REFURBISHED:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={200}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name and Condition */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            <Link href={`/marketplace/${product.productId}`}>
              {product.name}
            </Link>
          </h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(product.condition)}`}>
            {product.condition}
          </span>
        </div>

        {/* Price */}
        <div className="text-2xl font-bold text-blue-600 mb-2">
          {formatPrice(product.price)}
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Dealer Info */}
        {product.dealer && (
          <div className="space-y-1 mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{product.dealer.city}, {product.dealer.province}</span>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {product.dealer.businessName || product.dealer.storeName}
            </div>
          </div>
        )}

        {/* Stock Status */}
        <div className="text-sm text-gray-600 mb-3">
          {product.stockQuantity > 0 ? (
            <span className="text-green-600">
              {product.stockQuantity} in stock
            </span>
          ) : (
            <span className="text-red-600">Out of stock</span>
          )}
        </div>

        {/* Compatible Cars */}
        {product.compatibility && product.compatibility.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Compatible with:</p>
            <div className="flex flex-wrap gap-1">
              {product.compatibility.slice(0, 2).map((comp) => (
                <span
                  key={comp.compatibilityId}
                  className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded"
                >
                  {comp.carModel?.brand?.name} {comp.carModel?.name}
                </span>
              ))}
              {product.compatibility.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded">
                  +{product.compatibility.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/marketplace/${product.productId}`}
            className="flex-1 px-4 py-2 text-center text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
          >
            View Details
          </Link>
          
          {userRole === "CUSTOMER" && product.stockQuantity > 0 && (
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ShoppingCart className="w-4 h-4" />
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </button>
          )}
        </div>

        {/* Dealer Contact */}
        {product.dealer?.phoneNumber && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <a
              href={`tel:${product.dealer.phoneNumber}`}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <Phone className="w-4 h-4" />
              Call Dealer
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
