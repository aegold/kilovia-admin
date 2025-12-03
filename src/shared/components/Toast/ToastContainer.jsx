/**
 * ToastContainer.jsx - Container for toast notifications
 *
 * Renders all active toasts in a fixed position
 */

import React from "react";
import ToastItem from "./ToastItem";
import "./Toast.css";

const ToastContainer = ({ toasts, onRemove }) => {
  if (!toasts || toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

export default ToastContainer;
