import React, { useEffect, useState } from "react";
import { KINDS } from "@shared/constants/kinds";
import { makeQuestionEnvelope } from "@shared/utils/envelop";
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

      if (initialEnvelope.hints && initialEnvelope.hints.length > 0) {
        setHint(initialEnvelope.hints[0]);
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
    if (!question.trim()) throw new Error("Câu hỏi chính là bắt buộc");
    const invalid = blanks.find((b) => !String(b.answer || "").trim());
    if (invalid) throw new Error("Tất cả ô trống phải có đáp án");

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

    return makeQuestionEnvelope({
      kind: KINDS.MULTIPLE_FILL_IN,
      prompt: question,
      detail,
      extras: { media, explanation: hint || "" },
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
  }, [question, questionImage, subQuestion, blanks, hint]);

  return (
    <div className="qlbt-card space-y-4">
      <div className="qlbt-field">
        <label className="qlbt-label">Câu hỏi chính *</label>
        <textarea
          className="qlbt-textarea h-20"
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

      <div className="qlbt-field">
        <label className="qlbt-label">Câu hỏi phụ (tùy chọn)</label>
        <textarea
          className="qlbt-textarea h-16"
          value={subQuestion}
          onChange={(e) => setSubQuestion(e.target.value)}
          placeholder="Nhập câu hỏi phụ..."
        />
      </div>

      <div className="space-y-3">
        <div className="qlbt-section-title">Các ô trống</div>
        {blanks.map((b, i) => (
          <div key={b.id} className="border rounded p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm">Ô trống {i + 1}</div>
              {blanks.length > 2 && (
                <button
                  type="button"
                  className="px-2 py-1 border rounded text-sm"
                  onClick={() => removeBlank(i)}
                >
                  Xóa
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                className="qlbt-input"
                placeholder="Text trước"
                value={b.beforeText}
                onChange={(e) => setBlank(i, { beforeText: e.target.value })}
              />
              <input
                className="qlbt-input"
                placeholder="Text sau"
                value={b.afterText}
                onChange={(e) => setBlank(i, { afterText: e.target.value })}
              />
              <input
                className="qlbt-input"
                placeholder="Đáp án *"
                value={b.answer}
                onChange={(e) => setBlank(i, { answer: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <input
                className="qlbt-input"
                placeholder="Kiểu input (text/number)"
                value={b.inputType}
                onChange={(e) => setBlank(i, { inputType: e.target.value })}
              />
              <input
                className="qlbt-input"
                placeholder="Rộng (vd: 80px)"
                value={b.width}
                onChange={(e) => setBlank(i, { width: e.target.value })}
              />
              <div className="hidden md:block" />
            </div>
            <div className="text-xs text-gray-600">
              Xem trước: {b.beforeText}{" "}
              <span className="bg-gray-100 px-1 rounded">
                {b.answer || "..."}
              </span>{" "}
              {b.afterText}
            </div>
          </div>
        ))}
        {blanks.length < 10 && (
          <button
            type="button"
            className="px-2 py-1 border rounded"
            onClick={addBlank}
          >
            + Thêm ô trống
          </button>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Giải thích (tùy chọn)
        </label>
        <input
          className="border rounded px-2 py-1 w-full"
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          placeholder="Nhập giải thích..."
        />
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}
    </div>
  );
}
