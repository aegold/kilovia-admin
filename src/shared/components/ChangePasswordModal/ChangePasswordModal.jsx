/**
 * ChangePasswordModal.jsx - Modal for changing user password
 *
 * Features:
 * - Current password, new password, confirm password fields
 * - Password validation (strength requirements)
 * - Show/hide password toggle
 * - Loading state during submission
 * - Error handling
 */

import React, { useState, useEffect } from "react";
import { authService } from "../../services/authService";
import { useToast } from "../Toast";
import "./ChangePasswordModal.css";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password visibility
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate password strength
  const validatePasswordStrength = (password) => {
    const requirements = [];

    if (password.length < 8) {
      requirements.push("Tối thiểu 8 ký tự");
    }
    if (!/[A-Z]/.test(password)) {
      requirements.push("Ít nhất 1 chữ hoa");
    }
    if (!/[a-z]/.test(password)) {
      requirements.push("Ít nhất 1 chữ thường");
    }
    if (!/[0-9]/.test(password)) {
      requirements.push("Ít nhất 1 số");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      requirements.push("Ít nhất 1 ký tự đặc biệt");
    }

    return requirements;
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Old password
    if (!formData.oldPassword) {
      newErrors.oldPassword = "Vui lòng nhập mật khẩu hiện tại";
    }

    // New password
    if (!formData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else {
      const strengthErrors = validatePasswordStrength(formData.newPassword);
      if (strengthErrors.length > 0) {
        newErrors.newPassword = `Mật khẩu chưa đủ mạnh: ${strengthErrors.join(
          ", "
        )}`;
      } else if (formData.newPassword === formData.oldPassword) {
        newErrors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại";
      }
    }

    // Confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.changePassword(
        formData.oldPassword,
        formData.newPassword
      );

      toast.success("Đổi mật khẩu thành công!");
      onClose();
    } catch (error) {
      console.error("Change password failed:", error);

      // Handle different error types
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        if (status === 400) {
          setErrors({ oldPassword: "Mật khẩu hiện tại không đúng" });
        } else if (status === 401) {
          toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        } else {
          toast.error(message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
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
      <div className="modal-container change-password-modal">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Đổi mật khẩu</h2>
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
          {/* Old Password */}
          <div className="form-group">
            <label htmlFor="oldPassword" className="form-label">
              Mật khẩu hiện tại
            </label>
            <div className="password-input-wrapper">
              <input
                type={showOldPassword ? "text" : "password"}
                id="oldPassword"
                name="oldPassword"
                className={`form-input ${
                  errors.oldPassword ? "input-error" : ""
                }`}
                placeholder="Nhập mật khẩu hiện tại"
                value={formData.oldPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowOldPassword(!showOldPassword)}
                tabIndex={-1}
              >
                {showOldPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.oldPassword && (
              <span className="field-error">{errors.oldPassword}</span>
            )}
          </div>

          {/* New Password */}
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              Mật khẩu mới
            </label>
            <div className="password-input-wrapper">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                className={`form-input ${
                  errors.newPassword ? "input-error" : ""
                }`}
                placeholder="Nhập mật khẩu mới"
                value={formData.newPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNewPassword(!showNewPassword)}
                tabIndex={-1}
              >
                {showNewPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.newPassword && (
              <span className="field-error">{errors.newPassword}</span>
            )}
            <div className="password-hint">
              Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số
              và ký tự đặc biệt.
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Xác nhận mật khẩu mới
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className={`form-input ${
                  errors.confirmPassword ? "input-error" : ""
                }`}
                placeholder="Nhập lại mật khẩu mới"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="field-error">{errors.confirmPassword}</span>
            )}
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
                  Đang xử lý...
                </>
              ) : (
                "Đổi mật khẩu"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
