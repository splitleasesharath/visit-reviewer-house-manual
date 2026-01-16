// ============================================================
// USE NOTIFICATIONS HOOK
// Split Lease Application - Toast Notifications Hook
// ============================================================

import { useState, useCallback } from 'react';
import { ToastNotification } from '../types';

// ============================================================
// NOTIFICATION CONFIGURATION
// ============================================================

const DEFAULT_DURATION = 5000; // 5 seconds

// ============================================================
// USE NOTIFICATIONS HOOK
// ============================================================

interface UseNotificationsReturn {
  notifications: ToastNotification[];
  addNotification: (notification: Omit<ToastNotification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  showSuccess: (message: string, duration?: number) => string;
  showError: (message: string, duration?: number) => string;
  showWarning: (message: string, duration?: number) => string;
  showInfo: (message: string, duration?: number) => string;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  // Generate unique ID
  const generateId = (): string => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Add notification
  const addNotification = useCallback(
    (notification: Omit<ToastNotification, 'id'>): string => {
      const id = generateId();
      const newNotification: ToastNotification = {
        ...notification,
        id,
        autoClose: notification.autoClose ?? true,
        duration: notification.duration ?? DEFAULT_DURATION,
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Auto-remove if autoClose is enabled
      if (newNotification.autoClose) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);
      }

      return id;
    },
    []
  );

  // Remove notification by ID
  const removeNotification = useCallback((id: string): void => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback((): void => {
    setNotifications([]);
  }, []);

  // Helper methods for different notification types
  const showSuccess = useCallback(
    (message: string, duration?: number): string => {
      return addNotification({
        type: 'success',
        message,
        duration,
      });
    },
    [addNotification]
  );

  const showError = useCallback(
    (message: string, duration?: number): string => {
      return addNotification({
        type: 'error',
        message,
        autoClose: false, // Errors don't auto-close by default
        duration,
      });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (message: string, duration?: number): string => {
      return addNotification({
        type: 'warning',
        message,
        duration,
      });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (message: string, duration?: number): string => {
      return addNotification({
        type: 'info',
        message,
        duration,
      });
    },
    [addNotification]
  );

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

// ============================================================
// NOTIFICATION CONTEXT (OPTIONAL)
// ============================================================

import { createContext, useContext, ReactNode } from 'react';
import React from 'react';

const NotificationContext = createContext<UseNotificationsReturn | null>(null);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const notifications = useNotifications();

  return (
    <NotificationContext.Provider value={notifications}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): UseNotificationsReturn => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

export default useNotifications;
