import React from "react";

const HeroSkeleton = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400 animate-pulse">
      {/* Hero left side skeleton */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141] w-full px-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 md:w-11 h-[2px] bg-gray-300"></div>
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
          </div>
          <div className="h-8 sm:h-12 lg:h-16 w-3/4 bg-gray-300 rounded mb-4"></div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
            <div className="w-8 md:w-11 h-[2px] bg-gray-300"></div>
          </div>
        </div>
      </div>
      {/* Hero right side skeleton */}
      <div className="w-full sm:w-1/2 bg-gray-300 min-h-[300px] sm:min-h-[400px]"></div>
    </div>
  );
};

export default HeroSkeleton;
