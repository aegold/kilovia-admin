/**
 * TopicModal - Modal for creating/editing topics
 */

import React, { useState, useEffect } from "react";
import { topicService } from "../../services/topicService";

const TopicModal = ({ topic, subjectGradeId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    topicTitle: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (topic) {
      setFormData({
        topicTitle: topic.topicTitle || "",
      });
    }
  }, [topic]);

  const validate = () => {
    const newErrors = {};

    if (!formData.topicTitle.trim()) {
      newErrors.topicTitle = "Tên chủ đề không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      const data = {
        ...formData,
        subjectGradeId,
      };

      if (topic) {
        // Update existing
        await topicService.updateTopic(topic.id, data);
      } else {
        // Create new
        await topicService.createTopic(data);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving topic:", error);
      alert("Có lỗi khi lưu chủ đề!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="qlcd-modal-overlay" onClick={onClose}>
      <div className="qlcd-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="qlcd-modal-header">
          <h3 className="qlcd-modal-title">
            {topic ? "Chỉnh Sửa Chủ Đề" : "Thêm Chủ Đề Mới"}
          </h3>
          <button className="qlcd-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="qlcd-modal-body">
            {/* Topic Title */}
            <div className="qlcd-form-group">
              <label className="qlcd-form-label qlcd-form-label-required">
                Tên Chủ Đề:
              </label>
              <input
                type="text"
                name="topicTitle"
                className={`qlcd-form-input ${
                  errors.topicTitle ? "error" : ""
                }`}
                value={formData.topicTitle}
                onChange={handleChange}
                placeholder="Ví dụ: Số và phép tính"
                disabled={submitting}
              />
              {errors.topicTitle && (
                <div className="qlcd-form-error">{errors.topicTitle}</div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="qlcd-modal-footer">
            <button
              type="button"
              className="qlcd-btn"
              onClick={onClose}
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="qlcd-btn qlcd-btn-primary"
              disabled={submitting}
            >
              {submitting ? "Đang lưu..." : topic ? "Cập Nhật" : "Thêm Mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TopicModal;
