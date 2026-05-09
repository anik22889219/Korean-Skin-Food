import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="w-full aspect-[4/5] bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="w-1/3 h-3 bg-gray-200 rounded-full" />
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-200 rounded-full" />
          <div className="w-4/5 h-4 bg-gray-200 rounded-full" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="w-1/2 h-6 bg-gray-200 rounded-full" />
          <div className="w-10 h-10 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
