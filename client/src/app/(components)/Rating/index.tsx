/**
 * Rating Component
 *
 * A reusable star rating display component that shows a rating from 1-5 stars.
 * Features:
 * - Displays filled stars for the rating value
 * - Shows unfilled stars for remaining positions
 * - Uses Lucide icons for consistent styling
 * - Supports fractional ratings (rounds down to nearest integer)
 *
 * Usage:
 * <Rating rating={4} /> // Shows 4 filled stars and 1 unfilled star
 */

import { Star } from "lucide-react";
import React from "react";

// Component props type definition
type RatingProps = {
  rating: number;  // Rating value from 1-5
};

const Rating = ({ rating }: RatingProps) => {
  return [1, 2, 3, 4, 5].map((index) => (
    <Star
      key={index}  // Unique key for React's reconciliation
      color={index <= rating ? "#FFC107" : "#E4E5E9"}  // Gold color for filled stars, grey for unfilled
      className="w-4 h-4"  // Fixed size for consistency
    />
  ));
};

export default Rating;
