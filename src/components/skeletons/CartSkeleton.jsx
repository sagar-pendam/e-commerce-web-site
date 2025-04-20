import React from 'react';

const CartSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col gap-6 w-full">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="p-8 flex md:flex-nowrap flex-wrap relative border-2 mb-16 rounded-3xl shadow-xl w-full gap-8"
        >
          {/* Image */}
          <div className="w-48 h-48 bg-gray-300 rounded-md mx-auto" />

          {/* Text & Actions */}
          <div className="flex flex-col gap-3 flex-grow">
            <div className="h-6 w-3/4 bg-gray-300 rounded-md" />
            <div className="h-4 w-full bg-gray-300 rounded-md" />
            <div className="h-4 w-1/3 bg-gray-300 rounded-md" />
            <div className="h-4 w-1/5 bg-gray-300 rounded-md" />

            {/* Buttons (Qty, Delete, Share) */}
            <div className="flex gap-4 mt-2 flex-wrap">
              <div className="h-10 w-24 bg-gray-300 rounded-full" />
              <div className="h-10 w-20 bg-gray-300 rounded-sm" />
              <div className="h-10 w-20 bg-gray-300 rounded-sm" />
            </div>
          </div>

          {/* Price */}
          <div className="h-6 w-16 bg-gray-300 rounded-md self-start" />
        </div>
      ))}
    </div>
  );
};

export default CartSkeleton;
