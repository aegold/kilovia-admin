/**
 * RequestPasswordResetModal.jsx - Modal for ADMIN to request password reset
 *
 * Features:
 * - Reason textarea for explaining why reset is needed
 * - Loading state during submission
 * - Success/Error handling
 */

import React, { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import { useToast } from "../Toast";
import "./RequestPasswordResetModal.css";

const RequestPasswordResetModal = ({ isOpen, onClose }) => {
  const toast = useToast();

  // Form state
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setReason("");
      setError("");
    }
  }, [isOpen]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!reason.trim()) {
      setError("Vui lòng nhập lý do yêu cầu đặt lại mật khẩu");
      return;
    }

    if (reason.trim().length < 10) {
      setError("Lý do phải có ít nhất 10 ký tự");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await adminService.requestPasswordReset(reason.trim());

      toast.success(
        "Yêu cầu đặt lại mật khẩu đã được gửi! Vui lòng chờ Super Admin phê duyệt."
      );
      onClose();
    } catch (error) {
      console.error("Request password reset failed:", error);

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        if (status === 400) {
          setError(message || "Yêu cầu không hợp lệ");
        } else if (status === 409) {
          setError("Bạn đã có yêu cầu đang chờ xử lý. Vui lòng đợi phê duyệt.");
        } else {
          setError(message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
        }
      } else if (error.request) {
        toast.error(
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
        );
      } else {
        toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container request-reset-modal">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">🔐 Yêu cầu đặt lại mật khẩu</h2>
          <button
            className="modal-close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form className="modal-body" onSubmit={handleSubmit}>
          {/* Info */}
          <div className="reset-info">
            <p>
              Nếu bạn quên mật khẩu, hãy gửi yêu cầu đặt lại mật khẩu. Super
              Admin sẽ xem xét và phê duyệt yêu cầu của bạn.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="form-error-banner">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Reason */}
          <div className="form-group">
            <label htmlFor="reason" className="form-label">
              Lý do yêu cầu <span className="required">*</span>
            </label>
            <textarea
              id="reason"
              className="form-textarea"
              placeholder="Vui lòng mô tả lý do bạn cần đặt lại mật khẩu..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              disabled={isSubmitting}
              rows={4}
            />
            <div className="form-hint">
              Ví dụ: Quên mật khẩu, cần đặt lại vì lý do bảo mật, v.v.
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="button-spinner"></span>
                  Đang gửi...
                </>
              ) : (
                "Gửi yêu cầu"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestPasswordResetModal;
