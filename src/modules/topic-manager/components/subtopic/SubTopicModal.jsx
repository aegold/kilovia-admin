/**
 * SubTopicModal - Modal for creating/editing subtopics
 */

import React, { useState, useEffect } from "react";
import { subTopicService } from "../../services/topicService";

const SubTopicModal = ({ subTopic, topicId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    subTopicTitle: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (subTopic) {
      setFormData({
        subTopicTitle: subTopic.subTopicTitle || "",
      });
    }
  }, [subTopic]);

  const validate = () => {
    const newErrors = {};

    if (!formData.subTopicTitle.trim()) {
      newErrors.subTopicTitle = "Tên chủ đề con không được để trống";
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
        topicId,
      };

      if (subTopic) {
        // Update existing
        await subTopicService.updateSubTopic(subTopic.id, data);
      } else {
        // Create new
        await subTopicService.createSubTopic(data);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving subtopic:", error);
      alert("Có lỗi khi lưu chủ đề con!");
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
            {subTopic ? "Chỉnh Sửa Chủ Đề Con" : "Thêm Chủ Đề Con Mới"}
          </h3>
          <button className="qlcd-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="qlcd-modal-body">
            {/* SubTopic Title */}
            <div className="qlcd-form-group">
              <label className="qlcd-form-label qlcd-form-label-required">
                Tên Chủ Đề Con:
              </label>
              <input
                type="text"
                name="subTopicTitle"
                className={`qlcd-form-input ${
                  errors.subTopicTitle ? "error" : ""
                }`}
                value={formData.subTopicTitle}
                onChange={handleChange}
                placeholder="Ví dụ: Nhận biết số từ 0 đến 20"
                disabled={submitting}
              />
              {errors.subTopicTitle && (
                <div className="qlcd-form-error">{errors.subTopicTitle}</div>
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
              {submitting ? "Đang lưu..." : subTopic ? "Cập Nhật" : "Thêm Mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubTopicModal;
