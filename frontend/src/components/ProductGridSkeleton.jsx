import React from "react";

const ProductGridSkeleton = ({ count = 10 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          {/* Product Image Skeleton */}
          <div className="w-full aspect-square bg-gray-300 rounded"></div>
          {/* Product Name Skeleton */}
          <div className="h-4 w-3/4 bg-gray-300 rounded mt-3"></div>
          {/* Product Price Skeleton */}
          <div className="h-4 w-1/2 bg-gray-300 rounded mt-2"></div>
        </div>
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
