/**
 * QLBT_Header - Header component for QuanLyBaiTap
 *
 * 🚨 NEW COMPONENT - Written from scratch
 */

import React from "react";
import { useNavigate } from "react-router-dom";

const QLBT_Header = ({ onResetToKindPicker }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleTitleClick = () => {
    // Reset về kind picker screen
    if (onResetToKindPicker) {
      onResetToKindPicker();
    }
  };

  const handleGoToQuestionList = () => {
    navigate("/quan-ly-cau-hoi");
  };

  return (
    <header className="qlbt-header">
      <div className="qlbt-header-content">
        {/* Left section - Home + Title */}
        <div className="qlbt-header-left">
          <button
            className="qlbt-btn qlbt-btn-home"
            onClick={handleGoHome}
            title="Quay về trang chủ"
          >
            ← Trang Chủ
          </button>
          <div className="qlbt-header-divider"></div>
          <div
            className="qlbt-header-title-section qlbt-header-title-clickable"
            onClick={handleTitleClick}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === "Enter" && handleTitleClick()}
            title="Click để về trang chọn dạng câu hỏi"
          >
            <h1 className="qlbt-title">📝Tạo Câu Hỏi</h1>
          </div>
        </div>

        {/* Right section - Navigation to Question List */}
        <div className="qlbt-header-right">
          <button
            className="qlbt-btn qlbt-btn-view-list"
            onClick={handleGoToQuestionList}
            title="Xem danh sách tất cả câu hỏi"
          >
            <span className="btn-icon">📊</span>
            <span className="btn-label">Quản Lý Câu Hỏi</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default QLBT_Header;
