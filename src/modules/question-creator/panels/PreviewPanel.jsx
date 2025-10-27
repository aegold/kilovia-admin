// PreviewPanel - Question preview component
import React from "react";
import "../styles/QLBT_EditorTheme.css";

export default function PreviewPanel({ envelope, registry }) {
  if (!envelope) {
    return (
      <div className="qlbt-preview-placeholder">
        <div className="qlbt-placeholder-content">
          <div className="qlbt-placeholder-icon">👁️</div>
          <p style={{ color: "#9ca3af", margin: 0 }}>Chưa có dữ liệu preview</p>
        </div>
      </div>
    );
  }

  const PreviewComponent = registry?.Preview;

  if (!PreviewComponent) {
    return (
      <div className="qlbt-preview-placeholder">
        <div className="qlbt-placeholder-content">
          <div className="qlbt-placeholder-icon">⚠️</div>
          <p style={{ color: "#9ca3af", margin: 0 }}>
            Chưa có component preview cho loại này
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="qlbt-preview-section">
      <div className="qlbt-section-title">👁️ Xem trước</div>
      <div className="qlbt-preview-content">
        <PreviewComponent
          prompt={envelope.prompt}
          detail={envelope.detail}
          media={envelope.media}
          showAnswer={true}
        />
      </div>
    </div>
  );
}
