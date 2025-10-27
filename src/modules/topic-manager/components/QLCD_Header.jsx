/**
 * QLCD_Header - Header for QuanLyChuDe
 */

import React from "react";
import { useNavigate } from "react-router-dom";

const QLCD_Header = () => {
  const navigate = useNavigate();

  return (
    <header className="qlcd-header">
      <div className="qlcd-header-left">
        <button
          className="qlcd-back-btn"
          onClick={() => navigate("/")}
          title="Về trang chủ"
        >
          ←
        </button>
        <h1 className="qlcd-header-title">Quản Lý Chủ Đề</h1>
      </div>
      <div className="qlcd-header-right">
        <span className="qlcd-header-hint">
          Quản lý Topics và SubTopics cho hệ thống
        </span>
      </div>
    </header>
  );
};

export default QLCD_Header;
