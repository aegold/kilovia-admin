/**
 * AdminModal.jsx - Modal for creating/editing admin
 */

import React, { useState, useEffect } from "react";
import { ROLES } from "@shared/constants/roles";
import "./AdminModal.css";

const AdminModal = ({ isOpen, onClose, admin, onSave }) => {
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    role: "ADMIN",
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Is editing mode
  const isEdit = !!admin;

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (admin) {
        // Edit mode - populate form
        setFormData({
          username: admin.username || "",
          email: admin.email || "",
          password: "", // Don't populate password
          fullName: admin.fullName || "",
          role: admin.role || "ADMIN",
          isActive: admin.isActive ?? true,
        });
      } else {
        // Create mode - reset form
        setFormData({
          username: "",
          email: "",
          password: "",
          fullName: "",
          role: "ADMIN",
          isActive: true,
        });
      }
      setErrors({});
      setSubmitError("");
      setShowPassword(false);
    }
  }, [isOpen, admin]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear field error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (submitError) {
      setSubmitError("");
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Username (required for create)
    if (!isEdit) {
      if (!formData.username.trim()) {
        newErrors.username = "Vui lòng nhập tên đăng nhập";
      } else if (formData.username.length < 3) {
        newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username =
          "Tên đăng nhập chỉ được chứa chữ, số và dấu gạch dưới";
      }
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Password (required for create)
    if (!isEdit) {
      if (!formData.password) {
        newErrors.password = "Vui lòng nhập mật khẩu";
      } else {
        const passwordErrors = validatePasswordStrength(formData.password);
        if (passwordErrors.length > 0) {
          newErrors.password = `Mật khẩu chưa đủ mạnh: ${passwordErrors.join(
            ", "
          )}`;
        }
      }
    }

    // Full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate password strength
  const validatePasswordStrength = (password) => {
    const requirements = [];
    if (password.length < 8) requirements.push("Tối thiểu 8 ký tự");
    if (!/[A-Z]/.test(password)) requirements.push("Ít nhất 1 chữ hoa");
    if (!/[a-z]/.test(password)) requirements.push("Ít nhất 1 chữ thường");
    if (!/[0-9]/.test(password)) requirements.push("Ít nhất 1 số");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      requirements.push("Ít nhất 1 ký tự đặc biệt");
    return requirements;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Prepare data
      const dataToSave = isEdit
        ? {
            email: formData.email,
            fullName: formData.fullName,
            role: formData.role,
            isActive: formData.isActive,
          }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            role: formData.role,
            isActive: formData.isActive,
          };

      await onSave(dataToSave, isEdit);
    } catch (err) {
      setSubmitError(err.message || "Đã có lỗi xảy ra");
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
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container admin-modal">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {isEdit ? "Chỉnh sửa Admin" : "Tạo Admin mới"}
          </h2>
          <button
            className="modal-close"
            onClick={onClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form className="modal-body" onSubmit={handleSubmit}>
          {/* Submit Error */}
          {submitError && (
            <div className="form-error-banner">
              <span>{submitError}</span>
            </div>
          )}

          {/* Username (only for create) */}
          {!isEdit && (
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Tên đăng nhập <span className="required">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className={`form-input ${errors.username ? "input-error" : ""}`}
                placeholder="Nhập tên đăng nhập"
                value={formData.username}
                onChange={handleChange}
                disabled={isSubmitting}
                autoComplete="off"
              />
              {errors.username && (
                <span className="field-error">{errors.username}</span>
              )}
            </div>
          )}

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? "input-error" : ""}`}
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              autoComplete="off"
            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          {/* Password (only for create) */}
          {!isEdit && (
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Mật khẩu <span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`form-input ${
                    errors.password ? "input-error" : ""
                  }`}
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? "Ẩn" : "Xem"}
                </button>
              </div>
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
              <div className="password-hint">
                Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường,
                số và ký tự đặc biệt.
              </div>
            </div>
          )}

          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Họ và tên <span className="required">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className={`form-input ${errors.fullName ? "input-error" : ""}`}
              placeholder="Nhập họ và tên"
              value={formData.fullName}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.fullName && (
              <span className="field-error">{errors.fullName}</span>
            )}
          </div>

          {/* Role */}
          <div className="form-group">
            <label htmlFor="role" className="form-label">
              Vai trò
            </label>
            <select
              id="role"
              name="role"
              className="form-input form-select"
              value={formData.role}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value={ROLES.ADMIN}>Admin</option>
              <option value={ROLES.SUPER_ADMIN}>Super Admin</option>
            </select>
          </div>

          {/* Active Status */}
          <div className="form-group form-checkbox-group">
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <span className="checkbox-custom"></span>
              <span>Kích hoạt tài khoản</span>
            </label>
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
                  Đang lưu...
                </>
              ) : isEdit ? (
                "Cập nhật"
              ) : (
                "Tạo Admin"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;
