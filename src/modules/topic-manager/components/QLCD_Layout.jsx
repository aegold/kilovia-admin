/**
 * QLCD_Layout - Layout wrapper for QuanLyChuDe
 */

import React from "react";
import QLCD_Header from "./QLCD_Header";

const QLCD_Layout = ({ children }) => {
  return (
    <div className="qlcd-layout">
      {/* Header removed, using SharedNavbar */}
      <main className="qlcd-main">{children}</main>
    </div>
  );
};

export default QLCD_Layout;
