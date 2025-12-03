/**
 * SharedNavbar - Navigation bar dùng chung cho tất cả modules
 * Cho phép di chuyển giữa các trang và quay về trang chủ
 * Hiển thị thông tin user và nút logout
 */

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRoleDisplayName, ROLES } from "../constants/roles";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { RequestPasswordResetModal } from "./RequestPasswordResetModal";
import "./SharedNavbar.css";

const SharedNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  // Dropdown state
  const [showUserMenu, setShowUserMenu] = useState(false);
  // Change password modal state
  const [showChangePassword, setShowChangePassword] = useState(false);
  // Request password reset modal state
  const [showRequestReset, setShowRequestReset] = useState(false);

  // Navigation items - some may be role-specific
  const navItems = [
    {
      path: "/quan-ly-bai-tap",
      label: "Tạo Câu Hỏi",
      description: "Tạo và chỉnh sửa câu hỏi",
    },
    {
      path: "/quan-ly-cau-hoi",
      label: "Quản Lý Câu Hỏi",
      description: "Xem, tìm kiếm và quản lý",
    },
    {
      path: "/quan-ly-chu-de",
      label: "Quản Lý Chủ Đề",
      description: "Tổ chức Topics & SubTopics",
    },
    // SUPER_ADMIN only
    {
      path: "/quan-ly-admin",
      label: "Quản Lý Admin",
      description: "Quản lý tài khoản admin",
      roles: [ROLES.SUPER_ADMIN],
    },
    {
      path: "/nhat-ky-hoat-dong",
      label: "Nhật Ký",
      description: "Xem lịch sử hoạt động hệ thống",
      roles: [ROLES.SUPER_ADMIN],
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role);
  });

  // Handle logout
  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
    navigate("/login");
  };

  // Handle change password
  const handleChangePassword = () => {
    setShowUserMenu(false);
    setShowChangePassword(true);
  };

  // Handle request password reset (for ADMIN only)
  const handleRequestReset = () => {
    setShowUserMenu(false);
    setShowRequestReset(true);
  };

  // Close menu when clicking outside
  const handleMenuBlur = (e) => {
    // Delay to allow click events on menu items
    setTimeout(() => {
      setShowUserMenu(false);
    }, 150);
  };

  return (
    <nav className="shared-navbar">
      <div className="navbar-container">
        {/* Logo / Home Button */}
        <button
          className="navbar-home"
          onClick={() => navigate("/")}
          title="Về trang chủ"
        >
          <span className="home-text">Kilovia Admin</span>
        </button>

        {/* Navigation Links */}
        <div className="navbar-links">
          {filteredNavItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
              title={item.description}
            >
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Section - User Info & Logout */}
        <div className="navbar-right">
          {isAuthenticated && user ? (
            <div className="navbar-user-container">
              <button
                className="navbar-user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                onBlur={handleMenuBlur}
              >
                <div className="user-avatar">
                  {user.fullName?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <div className="user-info">
                  <span className="user-name">
                    {user.fullName || user.username}
                  </span>
                  <span className="user-role">
                    {getRoleDisplayName(user.role)}
                  </span>
                </div>
                <span
                  className={`dropdown-arrow ${showUserMenu ? "open" : ""}`}
                >
                  ▼
                </span>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <span className="dropdown-email">{user.email}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  {/* Super Admin: direct password change */}
                  {user?.role === ROLES.SUPER_ADMIN && (
                    <button
                      className="dropdown-item"
                      onClick={handleChangePassword}
                    >
                      Đổi mật khẩu
                    </button>
                  )}
                  {/* Admin: request password reset (needs Super Admin approval) */}
                  {user?.role === ROLES.ADMIN && (
                    <button
                      className="dropdown-item"
                      onClick={handleRequestReset}
                    >
                      Yêu cầu đặt lại MK
                    </button>
                  )}
                  <button className="dropdown-item" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="navbar-login-button"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />

      {/* Request Password Reset Modal */}
      <RequestPasswordResetModal
        isOpen={showRequestReset}
        onClose={() => setShowRequestReset(false)}
      />
    </nav>
  );
};

export default SharedNavbar;
