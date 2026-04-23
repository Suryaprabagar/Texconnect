import React from 'react';

export const Skeleton = ({ className, type = 'box' }) => {
  const baseClass = "animate-pulse bg-slate-200 rounded-xl";
  
  if (type === 'circle') {
    return <div className={`${baseClass} rounded-full ${className}`} />;
  }
  
  if (type === 'text') {
    return <div className={`${baseClass} h-4 w-3/4 ${className}`} />;
  }

  return <div className={`${baseClass} ${className}`} />;
};

export const ProductSkeleton = () => (
  <div className="bg-white p-4 rounded-3xl shadow-soft border border-slate-50">
    <Skeleton className="aspect-square w-full mb-4" />
    <Skeleton className="h-6 w-3/4 mb-2" type="text" />
    <Skeleton className="h-4 w-1/2" type="text" />
  </div>
);

export const ListSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center p-4 bg-white rounded-2xl border border-slate-50">
        <Skeleton className="w-12 h-12 mr-4" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" type="text" />
          <Skeleton className="h-3 w-1/4" type="text" />
        </div>
      </div>
    ))}
  </div>
);
