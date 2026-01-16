// ============================================================
// TOAST NOTIFICATION COMPONENT
// Split Lease Application - Toast Notifications
// ============================================================

import React, { useEffect, useState } from 'react';
import { ToastNotification } from '../../types';

// ============================================================
// TYPES
// ============================================================

interface ToastProps {
  notification: ToastNotification;
  onDismiss: (id: string) => void;
}

interface ToastContainerProps {
  notifications: ToastNotification[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

// ============================================================
// ICONS
// ============================================================

const SuccessIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ErrorIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const WarningIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const InfoIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ============================================================
// TOAST STYLES
// ============================================================

const toastStyles = {
  success: {
    container: 'bg-green-50 border-green-200',
    icon: 'text-green-500',
    text: 'text-green-800',
    closeHover: 'hover:bg-green-100',
  },
  error: {
    container: 'bg-red-50 border-red-200',
    icon: 'text-red-500',
    text: 'text-red-800',
    closeHover: 'hover:bg-red-100',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200',
    icon: 'text-yellow-500',
    text: 'text-yellow-800',
    closeHover: 'hover:bg-yellow-100',
  },
  info: {
    container: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-500',
    text: 'text-blue-800',
    closeHover: 'hover:bg-blue-100',
  },
};

const toastIcons = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
};

// ============================================================
// POSITION STYLES
// ============================================================

const positionStyles = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

// ============================================================
// SINGLE TOAST COMPONENT
// ============================================================

export const Toast: React.FC<ToastProps> = ({ notification, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const styles = toastStyles[notification.type];
  const Icon = toastIcons[notification.type];

  useEffect(() => {
    // Trigger enter animation
    const enterTimer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(enterTimer);
  }, []);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onDismiss(notification.id);
    }, 200); // Match animation duration
  };

  return (
    <div
      className={`
        flex items-start gap-3 p-4
        border rounded-lg shadow-lg
        max-w-sm w-full
        transform transition-all duration-200 ease-out
        ${styles.container}
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      role="alert"
    >
      <Icon className={`h-5 w-5 flex-shrink-0 ${styles.icon}`} />
      <p className={`flex-1 text-sm ${styles.text}`}>{notification.message}</p>
      <button
        onClick={handleDismiss}
        className={`
          p-1 rounded-full transition-colors
          ${styles.closeHover}
        `}
        aria-label="Dismiss notification"
      >
        <CloseIcon className={`h-4 w-4 ${styles.icon}`} />
      </button>
    </div>
  );
};

// ============================================================
// TOAST CONTAINER COMPONENT
// ============================================================

export const ToastContainer: React.FC<ToastContainerProps> = ({
  notifications,
  onDismiss,
  position = 'top-right',
}) => {
  if (notifications.length === 0) return null;

  return (
    <div
      className={`
        fixed z-50
        ${positionStyles[position]}
        flex flex-col gap-2
      `}
    >
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

export default Toast;
