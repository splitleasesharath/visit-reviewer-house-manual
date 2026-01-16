// ============================================================
// HEADER SECTION COMPONENT
// Split Lease Application - House Manual Header
// ============================================================

import React from 'react';
import { HeaderSectionProps, BreadcrumbItem } from '../../types';
import { formatLastUpdated } from '../../utils';

// ============================================================
// ICONS
// ============================================================

const BackIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const HomeIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

// ============================================================
// BREADCRUMB COMPONENT
// ============================================================

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronIcon className="h-4 w-4 text-gray-400" />}
          {item.onClick || item.href ? (
            <button
              onClick={item.onClick}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gray-500">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// ============================================================
// HEADER SECTION COMPONENT
// ============================================================

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  title,
  propertyName,
  propertyAddress,
  lastUpdated,
  onBack,
  showBreadcrumb = false,
  breadcrumbItems = [],
}) => {
  // Default breadcrumb items if not provided
  const defaultBreadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', onClick: onBack },
    { label: propertyName || 'Property' },
    { label: 'House Manual' },
  ];

  const breadcrumb = breadcrumbItems.length > 0 ? breadcrumbItems : defaultBreadcrumbItems;

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
      {/* Breadcrumb */}
      {showBreadcrumb && (
        <div className="mb-4">
          <Breadcrumb items={breadcrumb} />
        </div>
      )}

      <div className="flex items-start justify-between">
        {/* Left Side - Back Button & Title */}
        <div className="flex items-start space-x-4">
          {onBack && (
            <button
              onClick={onBack}
              className="
                mt-1 p-2 -ml-2
                text-gray-400 hover:text-gray-600
                hover:bg-gray-100 rounded-full
                transition-colors
              "
              aria-label="Go back"
            >
              <BackIcon className="h-5 w-5" />
            </button>
          )}

          <div>
            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {title || 'House Manual'}
            </h1>

            {/* Property Info */}
            {(propertyName || propertyAddress) && (
              <div className="mt-1 flex items-center space-x-2 text-gray-600">
                <HomeIcon className="h-4 w-4" />
                <div className="text-sm">
                  {propertyName && <span className="font-medium">{propertyName}</span>}
                  {propertyName && propertyAddress && <span> &middot; </span>}
                  {propertyAddress && <span>{propertyAddress}</span>}
                </div>
              </div>
            )}

            {/* Last Updated */}
            {lastUpdated && (
              <p className="mt-1 text-xs text-gray-500">
                {formatLastUpdated(lastUpdated)}
              </p>
            )}
          </div>
        </div>

        {/* Right Side - Optional Actions Slot */}
        <div className="flex items-center space-x-2">
          {/* This space can be used for action buttons */}
        </div>
      </div>
    </header>
  );
};

// ============================================================
// COMPACT HEADER VARIANT
// ============================================================

interface CompactHeaderProps {
  title: string;
  onBack?: () => void;
  rightContent?: React.ReactNode;
}

export const CompactHeader: React.FC<CompactHeaderProps> = ({
  title,
  onBack,
  rightContent,
}) => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <BackIcon className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>
        </div>
        {rightContent && <div>{rightContent}</div>}
      </div>
    </header>
  );
};

export default HeaderSection;
