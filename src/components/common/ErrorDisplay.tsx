// ============================================================
// ERROR DISPLAY COMPONENT
// Split Lease Application - Error Message Display
// ============================================================

import React from 'react';
import { ApiError } from '../../types';

// ============================================================
// TYPES
// ============================================================

interface ErrorDisplayProps {
  error: ApiError | string | null;
  title?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'inline' | 'banner' | 'fullPage';
  className?: string;
}

// ============================================================
// ICONS
// ============================================================

const AlertIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ============================================================
// HELPER FUNCTIONS
// ============================================================

const getErrorMessage = (error: ApiError | string | null): string => {
  if (!error) return 'An unknown error occurred';
  if (typeof error === 'string') return error;
  return error.message || 'An unexpected error occurred';
};

const getErrorTitle = (error: ApiError | string | null, defaultTitle?: string): string => {
  if (defaultTitle) return defaultTitle;
  if (!error) return 'Error';
  if (typeof error === 'string') return 'Error';

  switch (error.code) {
    case 400:
      return 'Invalid Request';
    case 401:
      return 'Unauthorized';
    case 403:
      return 'Access Denied';
    case 404:
      return 'Not Found';
    case 429:
      return 'Too Many Requests';
    case 500:
      return 'Server Error';
    default:
      return 'Error';
  }
};

// ============================================================
// INLINE ERROR COMPONENT
// ============================================================

const InlineError: React.FC<ErrorDisplayProps> = ({
  error,
  onDismiss,
  className = '',
}) => {
  if (!error) return null;

  return (
    <div
      className={`
        flex items-center gap-2 p-3
        bg-red-50 border border-red-200 rounded-md
        text-red-700 text-sm
        ${className}
      `}
      role="alert"
    >
      <AlertIcon className="h-4 w-4 flex-shrink-0" />
      <span className="flex-1">{getErrorMessage(error)}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-red-100 rounded-full transition-colors"
          aria-label="Dismiss error"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

// ============================================================
// BANNER ERROR COMPONENT
// ============================================================

const BannerError: React.FC<ErrorDisplayProps> = ({
  error,
  title,
  onRetry,
  onDismiss,
  className = '',
}) => {
  if (!error) return null;

  return (
    <div
      className={`
        bg-red-50 border-l-4 border-red-500 p-4
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-start">
        <AlertIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            {getErrorTitle(error, title)}
          </h3>
          <p className="mt-1 text-sm text-red-700">
            {getErrorMessage(error)}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-500 underline"
            >
              Try again
            </button>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 p-1 hover:bg-red-100 rounded-full transition-colors"
            aria-label="Dismiss error"
          >
            <CloseIcon className="h-5 w-5 text-red-500" />
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================
// FULL PAGE ERROR COMPONENT
// ============================================================

const FullPageError: React.FC<ErrorDisplayProps> = ({
  error,
  title,
  onRetry,
  className = '',
}) => {
  if (!error) return null;

  return (
    <div
      className={`
        flex flex-col items-center justify-center
        min-h-[400px] p-8 text-center
        ${className}
      `}
      role="alert"
    >
      <div className="w-16 h-16 mb-4 rounded-full bg-red-100 flex items-center justify-center">
        <AlertIcon className="h-8 w-8 text-red-500" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {getErrorTitle(error, title)}
      </h2>
      <p className="text-gray-600 max-w-md mb-6">
        {getErrorMessage(error)}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="
            px-6 py-2 bg-blue-600 text-white rounded-lg
            hover:bg-blue-700 transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          "
        >
          Try Again
        </button>
      )}
    </div>
  );
};

// ============================================================
// MAIN ERROR DISPLAY COMPONENT
// ============================================================

export const ErrorDisplay: React.FC<ErrorDisplayProps> = (props) => {
  const { variant = 'inline' } = props;

  switch (variant) {
    case 'banner':
      return <BannerError {...props} />;
    case 'fullPage':
      return <FullPageError {...props} />;
    default:
      return <InlineError {...props} />;
  }
};

// ============================================================
// ACCESS DENIED COMPONENT
// ============================================================

interface AccessDeniedProps {
  message?: string;
  onLogin?: () => void;
  onGoBack?: () => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  message = 'You do not have permission to access this content.',
  onLogin,
  onGoBack,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
        <svg
          className="h-8 w-8 text-yellow-600"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
      <p className="text-gray-600 max-w-md mb-6">{message}</p>
      <div className="flex gap-4">
        {onGoBack && (
          <button
            onClick={onGoBack}
            className="
              px-6 py-2 border border-gray-300 text-gray-700 rounded-lg
              hover:bg-gray-50 transition-colors
            "
          >
            Go Back
          </button>
        )}
        {onLogin && (
          <button
            onClick={onLogin}
            className="
              px-6 py-2 bg-blue-600 text-white rounded-lg
              hover:bg-blue-700 transition-colors
            "
          >
            Log In
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================
// EXPIRED CONTENT COMPONENT
// ============================================================

interface ExpiredContentProps {
  message?: string;
  expirationDate?: string;
  onRequestAccess?: () => void;
}

export const ExpiredContent: React.FC<ExpiredContentProps> = ({
  message = 'This content has expired and is no longer available.',
  expirationDate,
  onRequestAccess,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <svg
          className="h-8 w-8 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Content Expired</h2>
      <p className="text-gray-600 max-w-md mb-2">{message}</p>
      {expirationDate && (
        <p className="text-sm text-gray-500 mb-6">
          Expired on: {new Date(expirationDate).toLocaleDateString()}
        </p>
      )}
      {onRequestAccess && (
        <button
          onClick={onRequestAccess}
          className="
            px-6 py-2 bg-blue-600 text-white rounded-lg
            hover:bg-blue-700 transition-colors
          "
        >
          Request New Access
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
