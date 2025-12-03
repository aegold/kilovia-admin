/**
 * DeleteConfirmModal.jsx - Confirmation dialog for deleting admin
 */

import React, { useState } from "react";
import "./DeleteConfirmModal.css";

const DeleteConfirmModal = ({ isOpen, onClose, admin, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle confirm
  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  // Don't render if not open
  if (!isOpen || !admin) {
    return null;
  }

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isDeleting) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container delete-confirm-modal">
        {/* Content */}
        <div className="delete-content">
          <h2>Xác nhận xóa Admin</h2>
          <p>
            Bạn có chắc chắn muốn xóa quản trị viên{" "}
            <strong>{admin.username}</strong>?
          </p>
          <p className="delete-warning">
            Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến admin
            này sẽ bị xóa vĩnh viễn.
          </p>
        </div>

        {/* Admin info card */}
        <div className="delete-admin-card">
          <div className="admin-avatar">
            {admin.fullName?.charAt(0)?.toUpperCase() ||
              admin.username?.charAt(0)?.toUpperCase() ||
              "A"}
          </div>
          <div className="admin-info">
            <span className="admin-name">
              {admin.fullName || admin.username}
            </span>
            <span className="admin-email">{admin.email}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="delete-actions">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Hủy
          </button>
          <button
            className="btn btn-danger"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="button-spinner"></span>
                Đang xóa...
              </>
            ) : (
              "Xóa Admin"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
