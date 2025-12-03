/**
 * ToastContext.jsx - Toast Notification Context Provider
 *
 * Features:
 * - Global toast notifications
 * - Multiple toast types: success, error, warning, info
 * - Auto dismiss with configurable duration
 * - Stack multiple toasts
 */

import React, { createContext, useContext, useState, useCallback } from "react";
import ToastContainer from "./ToastContainer";

// Create context
const ToastContext = createContext(null);

// Default toast duration (ms)
const DEFAULT_DURATION = 5000;

/**
 * Toast Provider Component
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  /**
   * Add a new toast
   * @param {object} toast - Toast config
   * @param {string} toast.type - 'success' | 'error' | 'warning' | 'info'
   * @param {string} toast.title - Toast title
   * @param {string} toast.message - Toast message
   * @param {number} toast.duration - Auto dismiss duration (ms), 0 = no auto dismiss
   * @returns {string} Toast ID
   */
  const addToast = useCallback(
    ({ type = "info", title, message, duration = DEFAULT_DURATION }) => {
      const id = `toast_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 9)}`;

      const newToast = {
        id,
        type,
        title,
        message,
        duration,
        createdAt: Date.now(),
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    []
  );

  /**
   * Remove a toast by ID
   * @param {string} id - Toast ID
   */
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Remove all toasts
   */
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Shorthand methods
  const success = useCallback(
    (message, title = "Thành công") => {
      return addToast({ type: "success", title, message });
    },
    [addToast]
  );

  const error = useCallback(
    (message, title = "Lỗi") => {
      return addToast({ type: "error", title, message, duration: 7000 });
    },
    [addToast]
  );

  const warning = useCallback(
    (message, title = "Cảnh báo") => {
      return addToast({ type: "warning", title, message });
    },
    [addToast]
  );

  const info = useCallback(
    (message, title = "Thông báo") => {
      return addToast({ type: "info", title, message });
    },
    [addToast]
  );

  // Context value
  const value = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    // Shorthand methods
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

/**
 * Custom hook to use Toast Context
 * @returns {object} Toast context value
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export default ToastContext;
