/**
 * LoginPage.jsx - Admin Login Page
 *
 * Features:
 * - Username/Password login form
 * - Form validation
 * - Error handling
 * - Redirect after login
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@shared/context/AuthContext";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

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
    // Clear login error on change
    if (loginError) {
      setLoginError("");
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
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
    setLoginError("");

    try {
      await login(formData.username, formData.password);

      // Redirect to intended page or home
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);

      // Handle different error types
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        if (status === 401) {
          setLoginError("Tên đăng nhập hoặc mật khẩu không đúng");
        } else if (status === 403) {
          setLoginError(
            "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên."
          );
        } else if (status === 429) {
          setLoginError("Quá nhiều lần thử. Vui lòng thử lại sau.");
        } else {
          setLoginError(message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
        }
      } else if (error.request) {
        setLoginError(
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
        );
      } else {
        setLoginError("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading if checking auth
  if (isLoading) {
    return (
      <div className="login-page">
        <div className="login-loading">
          <div className="loading-spinner"></div>
          <p>Đang kiểm tra phiên đăng nhập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo / Header */}
        <div className="login-header">
          <h1 className="login-title">Kilovia Admin</h1>
          <p className="login-subtitle">Đăng nhập để tiếp tục</p>
        </div>

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Login Error */}
          {loginError && (
            <div className="login-error-banner">
              <span className="error-icon">⚠️</span>
              <span>{loginError}</span>
            </div>
          )}

          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Tên đăng nhập
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
              autoComplete="username"
              autoFocus
            />
            {errors.username && (
              <span className="field-error">{errors.username}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-input ${errors.password ? "input-error" : ""}`}
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="button-spinner"></span>
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p>© 2025 Kilovia. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
