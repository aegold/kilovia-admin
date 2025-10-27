/**
 * QLCH_Header - Header component for QuanLyCauHoi (Question Management)
 * Similar to QLBT_Header but for question list page
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import "./QLCH_Header.css";

const QLCH_Header = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoToCreateQuestion = () => {
    navigate("/quan-ly-bai-tap");
  };

  return (
    <header className="qlch-header-nav">
      <div className="qlch-header-content">
        {/* Left section - Home + Title */}
        <div className="qlch-header-left">
          <button
            className="qlch-btn qlch-btn-home"
            onClick={handleGoHome}
            title="Quay về trang chủ"
          >
            ← Trang Chủ
          </button>
          <div className="qlch-header-divider"></div>
          <div className="qlch-header-title-section">
            <h1 className="qlch-title">Quản Lý Câu Hỏi</h1>
            <p className="qlch-subtitle">
              Xem, tìm kiếm và quản lý tất cả câu hỏi đã tạo
            </p>
          </div>
        </div>

        {/* Right section - Create Question Button */}
        <div className="qlch-header-right">
          <button
            className="qlch-btn qlch-btn-create"
            onClick={handleGoToCreateQuestion}
            title="Tạo câu hỏi mới"
          >
            <span className="btn-icon">➕</span>
            <span className="btn-label">Tạo Câu Hỏi</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default QLCH_Header;
