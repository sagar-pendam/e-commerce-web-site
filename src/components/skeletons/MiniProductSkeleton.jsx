import React from 'react';

const MiniProductSkeleton = () => {
  return (
    <div className="flex gap-4 items-center border-b pb-4 animate-pulse">
      {/* Image skeleton */}
      <div className="w-24 h-24 bg-gray-300 rounded" />

      {/* Text skeleton */}
      <div className="flex flex-col gap-2">
        <div className="h-5 w-40 bg-gray-300 rounded" />
        <div className="h-6 w-20 bg-red-300 rounded" />
      </div>
    </div>
  );
};

export default MiniProductSkeleton;
