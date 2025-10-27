/**
 * QLBT_ImageUpload - Image Upload Component
 *
 * NEW COMPONENT - Image upload with preview
 */

import React, { useState, useRef } from "react";
import "../styles/QLBT_QuanLyBaiTap.css";

const QLBT_ImageUpload = ({
  fieldId,
  label,
  placeholder,
  value,
  onChange,
  accept = "image/*",
  maxSize = "5MB",
}) => {
  const [preview, setPreview] = useState(value?.url || null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh");
      return;
    }

    // Validate file size (5MB default)
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeBytes) {
      alert(`File quá lớn. Kích thước tối đa: ${maxSize}`);
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Create image object for form data
    const imageData = {
      file: file,
      url: previewUrl,
      name: file.name,
      size: file.size,
      type: file.type,
      alt: `Hình ảnh: ${file.name}`,
    };

    // Call onChange with image data
    onChange(fieldId, imageData);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onChange(fieldId, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="qlbt-form-group">
      <label className="qlbt-form-label">{label}</label>

      <div className="qlbt-image-upload">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          style={{ display: "none" }}
        />

        {/* Upload area */}
        <div
          className={`qlbt-upload-area ${dragOver ? "drag-over" : ""} ${
            preview ? "has-image" : ""
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={!preview ? handleClickUpload : undefined}
        >
          {preview ? (
            /* Image preview */
            <div className="qlbt-image-preview">
              <img src={preview} alt="Preview" className="qlbt-preview-image" />
              <div className="qlbt-image-actions">
                <button
                  type="button"
                  className="qlbt-btn qlbt-btn-sm qlbt-btn-danger"
                  onClick={handleRemoveImage}
                >
                  Xóa
                </button>
              </div>
            </div>
          ) : (
            /* Upload prompt */
            <div className="qlbt-upload-prompt">
              <div className="qlbt-upload-icon">
                <span>📷</span>
              </div>
              <div className="qlbt-upload-text">
                <p>
                  <strong>Nhấp để chọn hình ảnh</strong>
                </p>
                <p>hoặc kéo thả file vào đây</p>
                <p className="qlbt-upload-note">
                  Hỗ trợ: JPG, PNG, GIF (tối đa {maxSize})
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Help text */}
        {placeholder && <p className="qlbt-field-help">{placeholder}</p>}
      </div>
    </div>
  );
};

export default QLBT_ImageUpload;
