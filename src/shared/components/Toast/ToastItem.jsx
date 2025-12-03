/**
 * ToastItem.jsx - Individual toast notification component
 */

import React, { useState, useEffect } from "react";

// Toast icons by type
const TOAST_ICONS = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

const ToastItem = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  // Handle close with animation
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300); // Match animation duration
  };

  // Auto-trigger exit animation before removal
  useEffect(() => {
    if (toast.duration > 0) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
      }, toast.duration - 300);

      return () => clearTimeout(exitTimer);
    }
  }, [toast.duration]);

  return (
    <div
      className={`toast-item toast-${toast.type} ${
        isExiting ? "toast-exit" : ""
      }`}
      role="alert"
    >
      {/* Icon */}
      <div className="toast-icon">{TOAST_ICONS[toast.type]}</div>

      {/* Content */}
      <div className="toast-content">
        {toast.title && <div className="toast-title">{toast.title}</div>}
        {toast.message && <div className="toast-message">{toast.message}</div>}
      </div>

      {/* Close Button */}
      <button
        className="toast-close"
        onClick={handleClose}
        aria-label="Đóng thông báo"
      >
        ×
      </button>
    </div>
  );
};

export default ToastItem;
