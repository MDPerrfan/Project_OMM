import React from "react";

const HeroSkeleton = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400 animate-pulse">
      {/* Hero left side skeleton */}
      {/* Hero right side skeleton */}
      <div className="w-full sm:w-full bg-gray-300 min-h-[300px] sm:min-h-[400px]"></div>
    </div>
  );
};

export default HeroSkeleton;
