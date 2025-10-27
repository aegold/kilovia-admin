/**
 * QuanLyBaiTap - Ultra-Simple Question Management System
 * Main entry point for question creation and management
 *
 * MIGRATED TO VITE - Strategy B (Shared Core)
 */

import React from "react";
import QLBT_Layout from "./components/QLBT_Layout";
import "./styles/QLBT_QuanLyBaiTap.css";

const QuanLyBaiTap = () => {
  return (
    <div className="qlbt-main-container">
      <QLBT_Layout />
    </div>
  );
};

export default QuanLyBaiTap;
