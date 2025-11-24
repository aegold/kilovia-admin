import React, { useEffect, useState } from "react";
import { KINDS } from "@shared/constants/kinds";
import { makeQuestionEnvelope } from "@shared/utils/envelop";
import {
  validateEnvelope,
  formatValidationErrors,
} from "@shared/validators/envelopeValidators";
import QLBT_ImageUpload from "../components/QLBT_ImageUpload";
import "../styles/QLBT_EditorTheme.css";

export default function FibSingleEditor({
  onEnvelopeChange,
  onSave,
  hierarchy,
  isSaving = false,
  initialEnvelope = null,
}) {
  const [questionTitle, setQuestionTitle] = useState("Thực hiện bài toán sau:");
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [normalizeSpace, setNormalizeSpace] = useState(true);
  const [questionImage, setQuestionImage] = useState(null);
  const [hint, setHint] = useState("");
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial data from initialEnvelope in edit mode
  useEffect(() => {
    if (initialEnvelope && !isInitialized) {
      console.log(
        "📥 FibSingleEditor: Loading initial envelope",
        initialEnvelope
      );

      if (initialEnvelope.questionTitle) {
        setQuestionTitle(initialEnvelope.questionTitle);
      }

      if (initialEnvelope.prompt) {
        setPrompt(initialEnvelope.prompt);
      }

      if (initialEnvelope.detail?.answer) {
        setAnswer(initialEnvelope.detail.answer);
      }

      if (initialEnvelope.detail?.case_sensitive !== undefined) {
        setCaseSensitive(initialEnvelope.detail.case_sensitive);
      }

      if (initialEnvelope.detail?.normalize_space !== undefined) {
        setNormalizeSpace(initialEnvelope.detail.normalize_space);
      }

      if (initialEnvelope.media && initialEnvelope.media.length > 0) {
        const firstImage = initialEnvelope.media[0];
        setQuestionImage({
          url: firstImage.url,
          alt: firstImage.alt || "",
        });
      }

      if (initialEnvelope.explanation) {
        setHint(initialEnvelope.explanation);
      }

      setIsInitialized(true);
    }
  }, [initialEnvelope, isInitialized]);

  const buildEnvelope = () => {
    const detailEnvelope = {
      answer,
      case_sensitive: !!caseSensitive,
      normalize_space: !!normalizeSpace,
    };

    const media = questionImage?.url
      ? [
          {
            type: "image",
            url: questionImage.url,
            alt: questionImage.alt || "",
          },
        ]
      : [];

    const envelope = makeQuestionEnvelope({
      kind: KINDS.FIB_SINGLE,
      prompt,
      detail: detailEnvelope,
      extras: { media, explanation: hint || "", questionTitle },
    });

    // Centralized validation
    const validation = validateEnvelope(envelope);
    if (!validation.valid) {
      throw new Error(formatValidationErrors(validation.errors));
    }

    return envelope;
  };

  useEffect(() => {
    try {
      setError("");
      const env = buildEnvelope();
      onEnvelopeChange && onEnvelopeChange(env);
    } catch (e) {
      onEnvelopeChange && onEnvelopeChange(null);
      setError(e.message || "Dữ liệu không hợp lệ");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    questionTitle,
    prompt,
    answer,
    caseSensitive,
    normalizeSpace,
    questionImage,
    hint,
  ]);

  return (
    <div className="qlbt-card">
      <div className="qlbt-form-group">
        <label className="qlbt-label">
          Tiêu đề câu hỏi <span className="qlbt-required">*</span>
        </label>
        <input
          className="qlbt-input"
          value={questionTitle}
          onChange={(e) => setQuestionTitle(e.target.value)}
          placeholder="Nhập tiêu đề câu hỏi..."
        />
      </div>

      <div className="qlbt-form-group">
        <label className="qlbt-label">Đề bài</label>
        <textarea
          className="qlbt-textarea"
          style={{ height: "80px" }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Nhập đề bài, dùng [____] để đánh dấu ô trống"
        />
      </div>

      <QLBT_ImageUpload
        fieldId="questionImage"
        label="Hình ảnh câu hỏi (tùy chọn)"
        placeholder="Thêm hình minh họa"
        value={questionImage}
        onChange={(id, img) => setQuestionImage(img)}
        accept="image/*"
        maxSize="5MB"
      />

      <div className="qlbt-form-group">
        <label className="qlbt-label">Đáp án</label>
        <input
          className="qlbt-input"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Nhập đáp án đúng"
        />
      </div>

      <div className="qlbt-form-group">
        <label className="qlbt-checkbox-label">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
          />
          Phân biệt hoa/thường
        </label>
      </div>

      <div className="qlbt-form-group">
        <label className="qlbt-checkbox-label">
          <input
            type="checkbox"
            checked={normalizeSpace}
            onChange={(e) => setNormalizeSpace(e.target.checked)}
          />
          Chuẩn hóa khoảng trắng
        </label>
      </div>

      <div className="qlbt-form-group">
        <label className="qlbt-label">Giải thích (tùy chọn)</label>
        <textarea
          className="qlbt-textarea"
          style={{ height: "80px" }}
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          placeholder="Giải thích chi tiết đáp án..."
        />
      </div>

      {error && <div className="qlbt-error-text">{error}</div>}
    </div>
  );
}
