import React, { useEffect, useState } from "react";
import { KINDS } from "@shared/constants/kinds";
import { makeQuestionEnvelope } from "@shared/utils/envelop";
import {
  validateEnvelope,
  formatValidationErrors,
} from "@shared/validators/envelopeValidators";
import QLBT_ImageUpload from "../components/QLBT_ImageUpload";
import "../styles/QLBT_EditorTheme.css";

export default function MultipleFillInEditor({
  onEnvelopeChange,
  onSave,
  hierarchy,
  isSaving = false,
  initialEnvelope = null,
}) {
  const [question, setQuestion] = useState("");
  const [questionImage, setQuestionImage] = useState(null);
  const [subQuestion, setSubQuestion] = useState("");
  const [blanks, setBlanks] = useState([
    {
      id: "blank1",
      beforeText: "",
      afterText: "",
      answer: "",
      inputType: "text",
      width: "80px",
    },
    {
      id: "blank2",
      beforeText: "",
      afterText: "",
      answer: "",
      inputType: "text",
      width: "80px",
    },
  ]);
  const [hint, setHint] = useState("");
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial data from initialEnvelope in edit mode
  useEffect(() => {
    if (initialEnvelope && !isInitialized) {
      console.log(
        "📥 MultipleFillInEditor: Loading initial envelope",
        initialEnvelope
      );

      if (initialEnvelope.prompt) {
        setQuestion(initialEnvelope.prompt);
      }

      if (initialEnvelope.detail?.subQuestion) {
        setSubQuestion(initialEnvelope.detail.subQuestion);
      }

      if (
        initialEnvelope.detail?.blanks &&
        Array.isArray(initialEnvelope.detail.blanks)
      ) {
        setBlanks(initialEnvelope.detail.blanks);
      }

      if (initialEnvelope.explanation) {
        setHint(initialEnvelope.explanation);
      }

      if (initialEnvelope.media && initialEnvelope.media.length > 0) {
        const firstImage = initialEnvelope.media[0];
        setQuestionImage({
          url: firstImage.url,
          alt: firstImage.alt || "",
        });
      }

      setIsInitialized(true);
    }
  }, [initialEnvelope, isInitialized]);

  const setBlank = (idx, patch) => {
    const next = [...blanks];
    next[idx] = { ...next[idx], ...patch };
    setBlanks(next);
  };
  const addBlank = () => {
    if (blanks.length < 10)
      setBlanks([
        ...blanks,
        {
          id: `blank${blanks.length + 1}`,
          beforeText: "",
          afterText: "",
          answer: "",
          inputType: "text",
          width: "80px",
        },
      ]);
  };
  const removeBlank = (idx) => {
    if (blanks.length > 2) setBlanks(blanks.filter((_, i) => i !== idx));
  };

  const buildEnvelope = () => {
    const detail = {
      blocks: [
        ...(question.trim()
          ? [{ type: "text", content: question.trim(), down_line: true }]
          : []),
        ...(questionImage?.url
          ? [
              {
                type: "image",
                src: questionImage.url,
                alt: questionImage.alt || "Hình minh họa",
                width: "400px",
                align: "center",
              },
            ]
          : []),
        ...(subQuestion.trim()
          ? [{ type: "text", content: subQuestion.trim(), down_line: true }]
          : []),
        {
          type: "fill-in-group",
          id: "blanks_group",
          items: blanks.map((b, index) => ({
            type: "fill-in-text",
            before: b.beforeText,
            input: {
              id: b.id,
              type: b.inputType,
              width: b.width,
              placeholder: "...",
            },
            after: b.afterText,
            newLine: index > 0,
          })),
        },
      ],
      answers: blanks.map((b) => ({
        id: b.id,
        evaluate: true,
        expression: String(b.answer).trim(),
      })),
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
      kind: KINDS.MULTIPLE_FILL_IN,
      prompt: question,
      detail,
      extras: { media, explanation: hint || "" },
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
  }, [question, questionImage, subQuestion, blanks, hint]);

  return (
    <div className="qlbt-card">
      <div className="qlbt-form-group">
        <label className="qlbt-label">Câu hỏi chính *</label>
        <textarea
          className="qlbt-textarea"
          style={{ height: "80px" }}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Nhập câu hỏi..."
        />
      </div>

      <QLBT_ImageUpload
        fieldId="questionImage"
        label="Hình minh họa (tùy chọn)"
        value={questionImage}
        onChange={(id, img) => setQuestionImage(img)}
        accept="image/*"
        maxSize="5MB"
      />

      <div className="qlbt-form-group">
        <label className="qlbt-label">Câu hỏi phụ (tùy chọn)</label>
        <textarea
          className="qlbt-textarea"
          style={{ height: "64px" }}
          value={subQuestion}
          onChange={(e) => setSubQuestion(e.target.value)}
          placeholder="Nhập câu hỏi phụ..."
        />
      </div>

      <div className="qlbt-form-group">
        <div className="qlbt-section-title">Các ô trống</div>
        <div className="qlbt-choices-container">
          {blanks.map((b, i) => (
            <div
              key={b.id}
              className="qlbt-choice-item"
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Ô trống {i + 1}
                </div>
                {blanks.length > 2 && (
                  <button
                    type="button"
                    className="qlbt-btn-remove"
                    onClick={() => removeBlank(i)}
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Main 3 inputs in vertical layout */}
              <div style={{ width: "100%", marginBottom: "8px" }}>
                <label
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    color: "#6b7280",
                    display: "block",
                    marginBottom: "3px",
                  }}
                >
                  Text trước ô trống (tùy chọn)
                </label>
                <input
                  className="qlbt-input"
                  placeholder="Ví dụ: Kết quả của phép tính là"
                  value={b.beforeText}
                  onChange={(e) => setBlank(i, { beforeText: e.target.value })}
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ width: "100%", marginBottom: "8px" }}>
                <label
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    color: "#6b7280",
                    display: "block",
                    marginBottom: "3px",
                  }}
                >
                  Đáp án <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  className="qlbt-input"
                  placeholder="Nhập đáp án đúng"
                  value={b.answer}
                  onChange={(e) => setBlank(i, { answer: e.target.value })}
                  style={{ fontWeight: "500", width: "100%" }}
                />
              </div>

              <div style={{ width: "100%", marginBottom: "10px" }}>
                <label
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    color: "#6b7280",
                    display: "block",
                    marginBottom: "3px",
                  }}
                >
                  Text sau ô trống (tùy chọn)
                </label>
                <input
                  className="qlbt-input"
                  placeholder="Ví dụ: đơn vị đo"
                  value={b.afterText}
                  onChange={(e) => setBlank(i, { afterText: e.target.value })}
                  style={{ width: "100%" }}
                />
              </div>

              {/* Preview - compact version below all inputs */}
              <div
                style={{
                  width: "100%",
                  fontSize: "0.75rem",
                  color: "#6b7280",
                  paddingTop: "8px",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <span style={{ fontWeight: "500", marginRight: "6px" }}>
                  Xem trước:
                </span>
                {b.beforeText && <span>{b.beforeText} </span>}
                <span
                  style={{
                    backgroundColor: "#dbeafe",
                    padding: "2px 8px",
                    borderRadius: "3px",
                    border: "1px solid #3b82f6",
                    fontWeight: "600",
                    color: "#1e40af",
                    fontSize: "0.75rem",
                  }}
                >
                  {b.answer || "____"}
                </span>
                {b.afterText && <span> {b.afterText}</span>}
              </div>
            </div>
          ))}
        </div>
        {blanks.length < 10 && (
          <button type="button" className="qlbt-btn-add" onClick={addBlank}>
            + Thêm ô trống
          </button>
        )}
      </div>

      <div className="qlbt-form-group">
        <label className="qlbt-label">Giải thích (tùy chọn)</label>
        <input
          className="qlbt-input"
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          placeholder="Nhập giải thích..."
        />
      </div>

      {error && <div className="qlbt-error-text">{error}</div>}
    </div>
  );
}
