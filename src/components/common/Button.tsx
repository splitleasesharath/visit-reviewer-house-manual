// ============================================================
// BUTTON COMPONENT
// Split Lease Application - Reusable Button Component
// ============================================================

import React from 'react';

// ============================================================
// TYPES
// ============================================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// ============================================================
// VARIANT STYLES
// ============================================================

const variantStyles = {
  primary: `
    bg-blue-600 text-white
    hover:bg-blue-700
    focus:ring-blue-500
    disabled:bg-blue-300
  `,
  secondary: `
    bg-gray-100 text-gray-900
    hover:bg-gray-200
    focus:ring-gray-500
    disabled:bg-gray-100 disabled:text-gray-400
  `,
  outline: `
    border-2 border-gray-300 text-gray-700 bg-transparent
    hover:bg-gray-50 hover:border-gray-400
    focus:ring-gray-500
    disabled:border-gray-200 disabled:text-gray-400
  `,
  ghost: `
    text-gray-700 bg-transparent
    hover:bg-gray-100
    focus:ring-gray-500
    disabled:text-gray-400
  `,
  danger: `
    bg-red-600 text-white
    hover:bg-red-700
    focus:ring-red-500
    disabled:bg-red-300
  `,
};

// ============================================================
// SIZE STYLES
// ============================================================

const sizeStyles = {
  small: 'px-3 py-1.5 text-sm',
  medium: 'px-4 py-2 text-base',
  large: 'px-6 py-3 text-lg',
};

// ============================================================
// LOADING SPINNER
// ============================================================

const LoadingSpinner: React.FC<{ size: 'small' | 'medium' | 'large' }> = ({ size }) => {
  const spinnerSizes = {
    small: 'h-3 w-3',
    medium: 'h-4 w-4',
    large: 'h-5 w-5',
  };

  return (
    <svg
      className={`animate-spin ${spinnerSizes[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// ============================================================
// BUTTON COMPONENT
// ============================================================

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`
        inline-flex items-center justify-center
        font-medium rounded-lg
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size={size} />
          <span className="ml-2">Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

// ============================================================
// ICON BUTTON COMPONENT
// ============================================================

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  icon: React.ReactNode;
  'aria-label': string;
}

const iconSizeStyles = {
  small: 'p-1.5',
  medium: 'p-2',
  large: 'p-3',
};

export const IconButton: React.FC<IconButtonProps> = ({
  variant = 'ghost',
  size = 'medium',
  icon,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`
        inline-flex items-center justify-center
        rounded-full
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${variantStyles[variant]}
        ${iconSizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {icon}
    </button>
  );
};

// ============================================================
// BUTTON GROUP COMPONENT
// ============================================================

interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  className = '',
}) => {
  return (
    <div
      className={`
        flex
        ${orientation === 'horizontal' ? 'flex-row space-x-2' : 'flex-col space-y-2'}
        ${className}
      `}
      role="group"
    >
      {children}
    </div>
  );
};

export default Button;
