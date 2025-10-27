import React, { useEffect, useState } from "react";
import { KINDS } from "@shared/constants/kinds";
import { makeQuestionEnvelope } from "@shared/utils/envelop";
import QLBT_ImageUpload from "../components/QLBT_ImageUpload";
import "../styles/QLBT_EditorTheme.css";

const initialOptions = [
  { id: "A", text: "" },
  { id: "B", text: "" },
];

export default function McqSingleEditor({
  onEnvelopeChange,
  onSave,
  hierarchy,
  isSaving = false,
  initialEnvelope = null,
}) {
  const [prompt, setPrompt] = useState("");
  const [options, setOptions] = useState(initialOptions);
  const [answer, setAnswer] = useState("A");
  const [shuffle, setShuffle] = useState(true);
  const [questionImage, setQuestionImage] = useState(null);
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial data from initialEnvelope in edit mode
  useEffect(() => {
    if (initialEnvelope && !isInitialized) {
      console.log(
        "📥 McqSingleEditor: Loading initial envelope",
        initialEnvelope
      );

      // Load prompt
      if (initialEnvelope.prompt) {
        setPrompt(initialEnvelope.prompt);
      }

      // Load options
      if (initialEnvelope.detail?.options) {
        setOptions(
          initialEnvelope.detail.options.map((opt) => ({
            id: opt.id,
            text: opt.text,
          }))
        );

        // Find correct answer
        const correctOption = initialEnvelope.detail.options.find(
          (opt) => opt.correct
        );
        if (correctOption) {
          setAnswer(correctOption.id);
        }
      }

      // Load shuffle setting
      if (initialEnvelope.detail?.shuffle !== undefined) {
        setShuffle(initialEnvelope.detail.shuffle);
      }

      // Load image
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

  const addOption = () => {
    const nextId = String.fromCharCode("A".charCodeAt(0) + options.length);
    setOptions([...options, { id: nextId, text: "" }]);
    if (!answer) setAnswer(nextId);
  };

  const removeOption = (idx) => {
    const next = options.filter((_, i) => i !== idx);
    const removed = options[idx];
    let nextAnswer = answer;
    if (removed && removed.id === answer) {
      nextAnswer = next.length ? next[0].id : "";
    }
    setOptions(next);
    setAnswer(nextAnswer);
  };

  const setOption = (idx, patch) => {
    const next = [...options];
    next[idx] = { ...next[idx], ...patch };
    setOptions(next);
  };

  const buildEnvelope = () => {
    // Basic validation
    if (!options.length || !answer) {
      throw new Error("Options and answer are required");
    }
    const detail = {
      options: options.map((o) => ({ ...o, correct: o.id === answer })),
      shuffle,
    };
    return makeQuestionEnvelope({
      kind: KINDS.MCQ_SINGLE,
      prompt,
      detail,
      extras: {
        media: questionImage?.url
          ? [
              {
                type: "image",
                url: questionImage.url,
                alt: questionImage.alt || "",
              },
            ]
          : [],
      },
    });
  };

  useEffect(() => {
    try {
      setError("");
      const env = buildEnvelope();
      onEnvelopeChange && onEnvelopeChange(env);
    } catch (e) {
      onEnvelopeChange && onEnvelopeChange(null);
      // Chỉ hiển thị message lỗi cần thiết
      if (e.issues && e.issues.length > 0) {
        setError(e.issues[0].message);
      } else {
        setError(e.message || "Dữ liệu không hợp lệ");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, options, answer, shuffle, questionImage]);

  return (
    <div className="qlbt-card">
      <div className="qlbt-form-group">
        <label className="qlbt-label">
          Đề bài <span className="qlbt-required">*</span>
        </label>
        <textarea
          className="qlbt-textarea"
          style={{ minHeight: "80px" }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Nhập đề bài..."
        />
      </div>

      <div className="qlbt-form-group">
        <QLBT_ImageUpload
          fieldId="questionImage"
          label="Hình ảnh câu hỏi (tùy chọn)"
          placeholder="Thêm hình minh họa"
          value={questionImage}
          onChange={(id, img) => setQuestionImage(img)}
          accept="image/*"
          maxSize="5MB"
        />
      </div>

      <div className="qlbt-form-group">
        <div className="qlbt-section-title">
          Phương án <span className="qlbt-required">*</span>
        </div>
        <div className="qlbt-choices-container">
          {options.map((opt, i) => (
            <div key={opt.id} className="qlbt-choice-input-group">
              <span
                style={{
                  width: "32px",
                  textAlign: "center",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                {opt.id}
              </span>
              <input
                className="qlbt-input qlbt-choice-input"
                value={opt.text}
                onChange={(e) => setOption(i, { text: e.target.value })}
                placeholder={`Nhập phương án ${opt.id}`}
              />
              <label
                className="qlbt-radio-option"
                style={{ whiteSpace: "nowrap" }}
              >
                <input
                  type="radio"
                  checked={answer === opt.id}
                  onChange={() => setAnswer(opt.id)}
                />
                <span>Đúng</span>
              </label>
              {options.length > 2 && (
                <button
                  type="button"
                  className="qlbt-btn-remove"
                  onClick={() => removeOption(i)}
                  title="Xóa phương án"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="qlbt-btn-add"
            onClick={addOption}
            disabled={options.length >= 6}
          >
            + Thêm phương án
          </button>
        </div>
      </div>

      <div className="qlbt-form-group">
        <label className="qlbt-checkbox-label">
          <input
            type="checkbox"
            checked={shuffle}
            onChange={(e) => setShuffle(e.target.checked)}
          />
          <span>Xáo trộn phương án khi hiển thị</span>
        </label>
      </div>

      {error && <div className="qlbt-error">{error}</div>}
    </div>
  );
}
