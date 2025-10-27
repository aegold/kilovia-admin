/**
 * QuestionPreviewModal - Modal for previewing questions
 *
 * Features:
 * - Full question preview with envelope data
 * - Reuses preview components from QuanLyBaiTap
 * - Shows hierarchy info
 * - Quick actions: Edit, Close
 */

import React from "react";
import { getPreviewComponent } from "@shared/components/previewRegistry";
import { KINDS } from "@shared/constants/kinds";
import "./QuestionPreviewModal.css";

const QuestionPreviewModal = ({ question, onClose, onEdit }) => {
  if (!question) return null;

  const envelope = question.envelope || {};
  const kind = envelope.kind || "";
  const hierarchy = question.meta?.hierarchy || {};

  // Get preview component based on kind
  const PreviewComponent = getPreviewComponent(kind);

  // Get kind display info
  const getKindInfo = (kind) => {
    const kindMap = {
      [KINDS.MCQ_SINGLE]: {
        label: "Trắc nghiệm 1 đáp án",
        icon: "⭕",
        color: "#4CAF50",
      },
      [KINDS.FIB_SINGLE]: {
        label: "Điền 1 ô trống",
        icon: "✏️",
        color: "#2196F3",
      },
      [KINDS.IMAGE_CHOICE]: {
        label: "Chọn hình ảnh",
        icon: "🖼️",
        color: "#FF9800",
      },
      [KINDS.MULTIPLE_FILL_IN]: {
        label: "Điền nhiều ô trống",
        icon: "📝",
        color: "#9C27B0",
      },
      [KINDS.VERTICAL_CALCULATION]: {
        label: "Tính toán dọc",
        icon: "🔢",
        color: "#F44336",
      },
      [KINDS.EXPRESSION]: {
        label: "Biểu thức toán học",
        icon: "➗",
        color: "#00BCD4",
      },
      [KINDS.MATCHING_PAIRS]: {
        label: "Ghép cặp",
        icon: "🔗",
        color: "#FF5722",
      },
    };
    return (
      kindMap[kind] || {
        label: kind || "Không xác định",
        icon: "❓",
        color: "#757575",
      }
    );
  };

  const kindInfo = getKindInfo(kind);

  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="preview-modal-header">
          <div className="preview-modal-title">
            <div
              className="kind-badge"
              style={{ backgroundColor: kindInfo.color }}
            >
              <span className="kind-icon">{kindInfo.icon}</span>
              <span className="kind-label">{kindInfo.label}</span>
            </div>
            <h3>Xem trước câu hỏi</h3>
          </div>
          <button
            className="preview-modal-close"
            onClick={onClose}
            title="Đóng"
          >
            ✕
          </button>
        </div>

        {/* Hierarchy Info */}
        {hierarchy && (
          <div className="preview-modal-hierarchy">
            <div className="hierarchy-label">📍 Phân cấp:</div>
            <div className="hierarchy-breadcrumb">
              <span className="breadcrumb-item">
                {hierarchy.gradeName || "?"}
              </span>
              <span className="breadcrumb-sep">›</span>
              <span className="breadcrumb-item">
                {hierarchy.subjectName || "?"}
              </span>
              <span className="breadcrumb-sep">›</span>
              <span className="breadcrumb-item">
                {hierarchy.topicTitle || "?"}
              </span>
              {hierarchy.subtopicTitle && (
                <>
                  <span className="breadcrumb-sep">›</span>
                  <span className="breadcrumb-item">
                    {hierarchy.subtopicTitle}
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Question ID */}
        <div className="preview-modal-id">
          ID: <strong>#{question.id}</strong>
        </div>

        {/* Content - Preview Component */}
        <div className="preview-modal-content">
          {PreviewComponent ? (
            <PreviewComponent
              prompt={envelope.prompt}
              detail={envelope.detail}
              media={envelope.media}
              showAnswer={true}
            />
          ) : (
            <div className="preview-error">
              <div className="error-icon">⚠️</div>
              <p>Không thể hiển thị preview cho dạng câu hỏi này</p>
              <small>Kind: {kind}</small>
            </div>
          )}
        </div>

        {/* Additional Info */}
        {envelope.explanation && (
          <div className="preview-modal-explanation">
            <div className="explanation-label">💡 Giải thích:</div>
            <div className="explanation-content">{envelope.explanation}</div>
          </div>
        )}

        {envelope.hints && envelope.hints.length > 0 && (
          <div className="preview-modal-hints">
            <div className="hints-label">🔍 Gợi ý:</div>
            <ul className="hints-list">
              {envelope.hints.map((hint, index) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="preview-modal-footer">
          <button
            className="btn-preview-edit"
            onClick={() => {
              onEdit?.(question);
              onClose();
            }}
          >
            ✏️ Chỉnh sửa
          </button>
          <button className="btn-preview-close" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPreviewModal;
