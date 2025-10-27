import React, { useEffect, useState } from "react";
import { KINDS } from "@shared/constants/kinds";
import { makeQuestionEnvelope } from "@shared/utils/envelop";
import QLBT_ImageUpload from "../components/QLBT_ImageUpload";
import "../styles/QLBT_EditorTheme.css";

export default function FibSingleEditor({
  onEnvelopeChange,
  onSave,
  hierarchy,
  isSaving = false,
  initialEnvelope = null,
}) {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [normalizeSpace, setNormalizeSpace] = useState(true);
  const [questionImage, setQuestionImage] = useState(null);
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial data from initialEnvelope in edit mode
  useEffect(() => {
    if (initialEnvelope && !isInitialized) {
      console.log(
        "📥 FibSingleEditor: Loading initial envelope",
        initialEnvelope
      );

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

      setIsInitialized(true);
    }
  }, [initialEnvelope, isInitialized]);

  const buildEnvelope = () => {
    // Basic validation
    if (!answer.trim()) {
      throw new Error("Answer is required");
    }
    const detailEnvelope = {
      answer,
      case_sensitive: !!caseSensitive,
      normalize_space: !!normalizeSpace,
    };
    return makeQuestionEnvelope({
      kind: KINDS.FIB_SINGLE,
      prompt,
      detail: detailEnvelope,
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
  }, [prompt, answer, caseSensitive, normalizeSpace, questionImage]);

  return (
    <div className="qlbt-card space-y-3">
      <div className="qlbt-field">
        <label className="qlbt-label">Đề bài</label>
        <textarea
          className="qlbt-textarea h-20"
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

      <div className="qlbt-field">
        <label className="qlbt-label">Đáp án</label>
        <input
          className="qlbt-input"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Nhập đáp án đúng"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={caseSensitive}
          onChange={(e) => setCaseSensitive(e.target.checked)}
        />
        Phân biệt hoa/thường
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={normalizeSpace}
          onChange={(e) => setNormalizeSpace(e.target.checked)}
        />
        Chuẩn hóa khoảng trắng
      </label>

      {error && <div className="text-red-600 text-sm">{error}</div>}
    </div>
  );
}
