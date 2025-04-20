import React from 'react';

const WishlistSkeleton = () => {
  return (
    <div className="animate-pulse w-full flex flex-col gap-4 p-5">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="bg-white border-2 flex flex-wrap items-center flex-col md:flex-row p-5 gap-10 shadow-md rounded-lg w-full"
        >
          {/* Image skeleton */}
          <div className="w-44 h-44 bg-gray-300 rounded-lg" />

          {/* Text and buttons skeleton */}
          <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left w-full md:w-auto">
            <div className="h-6 bg-gray-300 rounded w-3/4 md:w-1/2" />
            <div className="h-4 bg-gray-300 rounded w-1/4 md:w-20" />

            <div className="h-10 w-32 bg-gray-300 rounded-full" />
            <div className="h-10 w-24 bg-gray-300 rounded-full" />
            <div className="h-6 w-24 bg-gray-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default WishlistSkeleton;
