import React from "react";

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200 rounded-lg ${className}`}
    ></div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ 
  rows = 5, 
  cols = 5 
}) => {
  return (
    <div className="w-full space-y-4">
      {/* Header Skeleton */}
      <div className="flex gap-4 pb-4 border-b border-slate-100">
        {[...Array(cols)].map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows Skeleton */}
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4 py-4 border-b border-slate-50 last:border-0">
          {[...Array(cols)].map((_, j) => (
            <Skeleton key={j} className="h-10 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
