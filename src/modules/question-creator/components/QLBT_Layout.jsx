/**
 * QLBT_Layout - Layout wrapper component for QuanLyBaiTap
 *
 * NEW COMPONENT - Written from scratch, NO REUSE
 * Reference existing layout patterns only
 */

import React, { useState } from "react";
import QLBT_Header from "./QLBT_Header";
import QLBT_MainContent from "./QLBT_MainContent";

const QLBT_Layout = () => {
  const [resetKey, setResetKey] = useState(0); // Key to force reset MainContent

  const handleResetToKindPicker = () => {
    // Force MainContent to reset by changing key
    setResetKey((prev) => prev + 1);
  };

  return (
    <div className="qlbt-layout">
      {/* Main Content Area (Full Width) - Header removed, using SharedNavbar */}
      <main className="qlbt-main-content-full">
        <QLBT_MainContent key={resetKey} />
      </main>
    </div>
  );
};

export default QLBT_Layout;
