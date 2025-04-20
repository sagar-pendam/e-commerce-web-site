import React from 'react';

const OrdersSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col gap-6 w-full">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="flex flex-col gap-4 p-5 w-full border-2 rounded-lg shadow-lg"
        >
          {/* Order ID */}
          <div className="h-6 w-1/3 bg-gray-300 rounded-md" />

          {/* Order Date */}
          <div className="h-5 w-1/4 bg-gray-300 rounded-md" />

          {/* Total Amount */}
          <div className="h-5 w-1/4 bg-gray-300 rounded-md" />

          {/* Address */}
          <div className="h-5 w-1/2 bg-gray-300 rounded-md" />

          {/* Status */}
          <div className="h-5 w-1/5 bg-gray-300 rounded-md" />

          {/* Items Title */}
          <div className="h-6 w-20 bg-gray-300 rounded-md" />

          {/* Product Details Section */}
          <div className="flex flex-col gap-4">
            {/* Product Image */}
            <div className="w-44 h-44 bg-gray-300 rounded-md" />

            {/* Product Text Info */}
            <div className="flex flex-col gap-3">
              <div className="h-5 w-2/3 bg-gray-300 rounded-md" />
              <div className="h-5 w-1/4 bg-gray-300 rounded-md" />
              <div className="h-5 w-1/6 bg-gray-300 rounded-md" />
              <div className="h-5 w-28 bg-gray-300 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersSkeleton;
