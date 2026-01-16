// ============================================================
// LOADING SPINNER COMPONENT
// Split Lease Application - Reusable Loading Indicator
// ============================================================

import React from 'react';

// ============================================================
// TYPES
// ============================================================

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

// ============================================================
// SIZE MAPPINGS
// ============================================================

const sizeClasses = {
  small: 'h-4 w-4 border-2',
  medium: 'h-8 w-8 border-2',
  large: 'h-12 w-12 border-3',
};

const textSizeClasses = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg',
};

// ============================================================
// COMPONENT
// ============================================================

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'border-blue-600',
  text,
  fullScreen = false,
  className = '',
}) => {
  const spinner = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          ${color}
          border-t-transparent
          rounded-full
          animate-spin
        `}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className={`mt-2 text-gray-600 ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// ============================================================
// SKELETON LOADER
// ============================================================

interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export const Skeleton: React.FC<SkeletonProps> = ({
  width = 'w-full',
  height = 'h-4',
  rounded = 'md',
  className = '',
}) => {
  return (
    <div
      className={`
        ${width}
        ${height}
        ${roundedClasses[rounded]}
        bg-gray-200
        animate-pulse
        ${className}
      `}
    />
  );
};

// ============================================================
// CONTENT SKELETON
// ============================================================

export const ContentSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 p-4">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton width="w-3/4" height="h-8" />
        <Skeleton width="w-1/2" height="h-4" />
      </div>

      {/* Content skeleton */}
      <div className="space-y-3 pt-4">
        <Skeleton height="h-4" />
        <Skeleton height="h-4" />
        <Skeleton width="w-2/3" height="h-4" />
      </div>

      {/* Section skeleton */}
      <div className="space-y-3 pt-4">
        <Skeleton width="w-1/3" height="h-6" />
        <Skeleton height="h-4" />
        <Skeleton height="h-4" />
        <Skeleton width="w-5/6" height="h-4" />
      </div>

      {/* Section skeleton */}
      <div className="space-y-3 pt-4">
        <Skeleton width="w-1/4" height="h-6" />
        <Skeleton height="h-4" />
        <Skeleton width="w-3/4" height="h-4" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
