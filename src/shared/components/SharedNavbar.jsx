/**
 * SharedNavbar - Navigation bar dùng chung cho tất cả modules
 * Cho phép di chuyển giữa các trang và quay về trang chủ
 */

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SharedNavbar.css";

const SharedNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: "/quan-ly-bai-tap",
      icon: "✏️",
      label: "Tạo Câu Hỏi",
      description: "Tạo và chỉnh sửa câu hỏi",
    },
    {
      path: "/quan-ly-cau-hoi",
      icon: "📋",
      label: "Quản Lý Câu Hỏi",
      description: "Xem, tìm kiếm và quản lý",
    },
    {
      path: "/quan-ly-chu-de",
      icon: "📚",
      label: "Quản Lý Chủ Đề",
      description: "Tổ chức Topics & SubTopics",
    },
  ];

  return (
    <nav className="shared-navbar">
      <div className="navbar-container">
        {/* Logo / Home Button */}
        <button
          className="navbar-home"
          onClick={() => navigate("/")}
          title="Về trang chủ"
        >
          <span className="home-icon">🎓</span>
          <span className="home-text">Kilovia Admin</span>
        </button>

        {/* Navigation Links */}
        <div className="navbar-links">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
              title={item.description}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Section - Optional */}
        <div className="navbar-right">
          <div className="navbar-user">
            <span className="user-icon">👤</span>
            <span className="user-name">Admin</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SharedNavbar;
