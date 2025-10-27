/**
 * QuestionTable.jsx - Table view for question management
 *
 * Features:
 * - Sortable columns
 * - Checkbox bulk selection
 * - Action buttons per row
 * - Compact hierarchy display
 */

import React, { useState, useEffect } from "react";
import "./QuestionTable.css";
import { KINDS } from "@shared/constants/kinds";

const QuestionTable = ({
  questions,
  loading,
  onEdit,
  onDelete,
  onPreview,
  onBulkDelete,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });

  // Clear selection when questions change
  useEffect(() => {
    setSelectedIds([]);
  }, [questions]);

  // Toggle single checkbox
  const handleCheckboxChange = (questionId) => {
    setSelectedIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  // Toggle all checkboxes
  const handleSelectAll = () => {
    if (selectedIds.length === questions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(questions.map((q) => q.id));
    }
  };

  // Sort handler
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Sort questions
  const sortedQuestions = React.useMemo(() => {
    let sorted = [...questions];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Handle nested keys (e.g., meta.hierarchy.gradeName)
        if (sortConfig.key === "hierarchy") {
          aVal = a.meta?.hierarchy?.gradeName || "";
          bVal = b.meta?.hierarchy?.gradeName || "";
        }

        // Handle dates
        if (sortConfig.key === "created_at") {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }

        if (aVal < bVal) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sorted;
  }, [questions, sortConfig]);

  // Get kind label and icon
  const getKindInfo = (kind) => {
    const kindMap = {
      [KINDS.MCQ_SINGLE]: {
        label: "Trắc nghiệm",
        icon: "⭕",
        color: "#4CAF50",
      },
      [KINDS.FIB_SINGLE]: { label: "Điền chỗ", icon: "✏️", color: "#2196F3" },
      [KINDS.IMAGE_CHOICE]: { label: "Chọn ảnh", icon: "🖼️", color: "#FF9800" },
      [KINDS.MULTIPLE_FILL_IN]: {
        label: "Điền nhiều",
        icon: "📝",
        color: "#9C27B0",
      },
      [KINDS.VERTICAL_CALCULATION]: {
        label: "Tính dọc",
        icon: "🔢",
        color: "#F44336",
      },
      [KINDS.EXPRESSION]: { label: "Biểu thức", icon: "➗", color: "#00BCD4" },
      [KINDS.MATCHING_PAIRS]: {
        label: "Nối cặp",
        icon: "🔗",
        color: "#FF5722",
      },
    };
    return kindMap[kind] || { label: kind, icon: "❓", color: "#757575" };
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Truncate text
  const truncate = (text, maxLength = 60) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Get answer display
  const getAnswerDisplay = (question) => {
    const envelope = question.envelope;
    if (!envelope) return "-";

    // Use envelope.kind instead of question.question_type
    const kind = envelope.kind;

    switch (kind) {
      case KINDS.MCQ_SINGLE:
        const correctOption = envelope.detail?.options?.find(
          (opt) => opt.correct
        );
        return correctOption
          ? `${correctOption.id}. ${correctOption.text}`
          : "-";

      case KINDS.FIB_SINGLE:
        return envelope.detail?.answer || "-";

      case KINDS.MULTIPLE_FILL_IN:
        const answers = envelope.detail?.answers || [];
        return answers.join(", ") || "-";

      case KINDS.VERTICAL_CALCULATION:
        return envelope.detail?.result || "-";

      case KINDS.EXPRESSION:
        const op1 = envelope.detail?.operand1 || "?";
        const op2 = envelope.detail?.operand2 || "?";
        const result = envelope.detail?.result || "?";
        const operation = envelope.detail?.operation || "+";
        const opSymbol =
          {
            addition: "+",
            subtraction: "-",
            multiplication: "×",
            division: "÷",
          }[operation] || operation;
        return `${op1} ${opSymbol} ${op2} = ${result}`;

      case KINDS.IMAGE_CHOICE:
        const correctImage = envelope.detail?.options?.find(
          (opt) => opt.correct
        );
        return correctImage ? correctImage.image?.alt || "Ảnh đúng" : "-";

      case KINDS.MATCHING_PAIRS:
        const pairsCount = envelope.detail?.pairs?.length || 0;
        return `${pairsCount} cặp`;

      default:
        return "-";
    }
  };

  // Bulk delete handler
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (
      window.confirm(
        `Bạn có chắc muốn xóa ${selectedIds.length} câu hỏi đã chọn?`
      )
    ) {
      onBulkDelete?.(selectedIds);
      setSelectedIds([]);
    }
  };

  if (loading) {
    return (
      <div className="question-table-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải danh sách câu hỏi...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="question-table-empty">
        <div className="empty-icon">📝</div>
        <h3>Chưa có câu hỏi nào</h3>
        <p>Tạo câu hỏi mới để bắt đầu quản lý</p>
      </div>
    );
  }

  return (
    <div className="question-table-container">
      {/* Table */}
      <div className="table-wrapper">
        <table className="question-table">
          <thead>
            <tr>
              <th
                className="col-kind sortable"
                onClick={() => handleSort("question_type")}
              >
                Loại câu hỏi
                {sortConfig.key === "question_type" && (
                  <span className="sort-icon">
                    {sortConfig.direction === "asc" ? " ▲" : " ▼"}
                  </span>
                )}
              </th>
              <th className="col-prompt">Nội dung câu hỏi</th>
              <th className="col-answer">Đáp án</th>
              <th
                className="col-hierarchy sortable"
                onClick={() => handleSort("hierarchy")}
              >
                Phân cấp
                {sortConfig.key === "hierarchy" && (
                  <span className="sort-icon">
                    {sortConfig.direction === "asc" ? " ▲" : " ▼"}
                  </span>
                )}
              </th>
              <th
                className="col-date sortable"
                onClick={() => handleSort("created_at")}
              >
                Ngày tạo
                {sortConfig.key === "created_at" && (
                  <span className="sort-icon">
                    {sortConfig.direction === "asc" ? " ▲" : " ▼"}
                  </span>
                )}
              </th>
              <th className="col-actions">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {sortedQuestions.map((question) => {
              // Use envelope.kind instead of question.question_type for kind info
              const kind = question.envelope?.kind || "";
              const kindInfo = getKindInfo(kind);
              const hierarchy = question.meta?.hierarchy;
              const isSelected = selectedIds.includes(question.id);

              return (
                <tr key={question.id} className={isSelected ? "selected" : ""}>
                  <td className="col-kind">
                    <div
                      className="kind-badge"
                      style={{ backgroundColor: kindInfo.color }}
                    >
                      <span className="kind-icon">{kindInfo.icon}</span>
                      <span className="kind-label">{kindInfo.label}</span>
                    </div>
                  </td>
                  <td className="col-prompt" title={question.prompt || ""}>
                    {truncate(question.prompt || "-", 80)}
                  </td>
                  <td className="col-answer" title={getAnswerDisplay(question)}>
                    {truncate(getAnswerDisplay(question), 40)}
                  </td>
                  <td className="col-hierarchy">
                    {hierarchy ? (
                      <div
                        className="hierarchy-container"
                        title={`${hierarchy.gradeName} › ${
                          hierarchy.subjectName
                        } › ${hierarchy.topicTitle} › ${
                          hierarchy.subtopicTitle || ""
                        }`}
                      >
                        {/* Line 1: Grade > Subject */}
                        <div className="hierarchy-line">
                          <span className="hierarchy-item grade">
                            {hierarchy.gradeName}
                          </span>
                          <span className="hierarchy-sep">›</span>
                          <span className="hierarchy-item subject">
                            {hierarchy.subjectName}
                          </span>
                        </div>
                        {/* Line 2: Topic > Subtopic */}
                        <div className="hierarchy-line">
                          <span className="hierarchy-item topic">
                            {truncate(hierarchy.topicTitle, 25)}
                          </span>
                          {hierarchy.subtopicTitle && (
                            <>
                              <span className="hierarchy-sep">›</span>
                              <span className="hierarchy-item subtopic">
                                {truncate(hierarchy.subtopicTitle, 25)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="no-hierarchy">-</span>
                    )}
                  </td>
                  <td className="col-date">
                    {formatDate(question.created_at)}
                  </td>
                  <td className="col-actions">
                    <div className="action-buttons">
                      <button
                        className="btn-action btn-preview"
                        onClick={() => onPreview?.(question)}
                        title="Xem trước"
                      >
                        👁️
                      </button>
                      <button
                        className="btn-action btn-edit"
                        onClick={() => onEdit?.(question)}
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => onDelete?.(question.id)}
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionTable;
