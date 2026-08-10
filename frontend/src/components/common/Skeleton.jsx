import React from 'react';

export const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-muted rounded-md ${className}`} />
);

export const ProductSkeleton = () => (
  <div className="bg-card border border-border rounded-2xl overflow-hidden p-4 space-y-4 h-full flex flex-col">
    <Skeleton className="aspect-[4/3] w-full rounded-xl animate-pulse bg-slate-200 dark:bg-slate-800" />
    <div className="space-y-2 flex-grow">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-1/4 animate-pulse bg-slate-200 dark:bg-slate-800" />
        <Skeleton className="h-4 w-1/4 animate-pulse bg-slate-200 dark:bg-slate-800" />
      </div>
      <Skeleton className="h-6 w-3/4 rounded animate-pulse bg-slate-200 dark:bg-slate-800" />
      <Skeleton className="h-4 w-1/2 rounded animate-pulse bg-slate-200 dark:bg-slate-800" />
    </div>
    <div className="flex justify-between items-center pt-2">
      <div className="space-y-1">
        <Skeleton className="h-3 w-12 animate-pulse bg-slate-200 dark:bg-slate-800" />
        <Skeleton className="h-6 w-16 animate-pulse bg-slate-200 dark:bg-slate-800" />
      </div>
      <Skeleton className="h-10 w-10 rounded-full animate-pulse bg-slate-200 dark:bg-slate-800" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <div className="w-full space-y-4">
    <div className="flex space-x-4">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-8 flex-1 animate-pulse bg-slate-200 dark:bg-slate-800" />
      ))}
    </div>
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4 py-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-6 flex-1 animate-pulse bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <Skeleton className="h-12 w-12 rounded-xl animate-pulse bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-4 w-8 animate-pulse bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-20 animate-pulse bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-8 w-24 animate-pulse bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-32 animate-pulse bg-slate-200 dark:bg-slate-800" />
        <Skeleton className="h-4 w-16 animate-pulse bg-slate-200 dark:bg-slate-800" />
      </div>
      <TableSkeleton rows={4} cols={5} />
    </div>
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="grid md:grid-cols-2 gap-8 md:gap-12 py-8">
    <div className="space-y-4">
      <Skeleton className="aspect-square w-full rounded-2xl animate-pulse bg-slate-200 dark:bg-slate-800" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-xl animate-pulse bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
    </div>
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20 animate-pulse bg-slate-200 dark:bg-slate-800" />
        <Skeleton className="h-10 w-3/4 rounded animate-pulse bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-24 animate-pulse bg-slate-200 dark:bg-slate-800" />
        <Skeleton className="h-4 w-12 animate-pulse bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="space-y-1">
        <Skeleton className="h-4 w-16 animate-pulse bg-slate-200 dark:bg-slate-800" />
        <Skeleton className="h-8 w-32 animate-pulse bg-slate-200 dark:bg-slate-800" />
      </div>
      <Skeleton className="h-20 w-full rounded-xl animate-pulse bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex gap-4">
          <Skeleton className="h-12 flex-1 rounded-xl animate-pulse bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-12 flex-1 rounded-xl animate-pulse bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-12 w-12 rounded-xl animate-pulse bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  </div>
);
