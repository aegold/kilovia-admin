import React, { useEffect, useState } from "react";
import { KINDS } from "@shared/constants/kinds";
import { makeQuestionEnvelope } from "@shared/utils/envelop";
import {
  validateEnvelope,
  formatValidationErrors,
} from "@shared/validators/envelopeValidators";
import QLBT_ImageUpload from "../components/QLBT_ImageUpload";
import "../styles/QLBT_EditorTheme.css";

export default function ImageChoiceEditor({
  onEnvelopeChange,
  onSave,
  hierarchy,
  isSaving = false,
  initialEnvelope = null,
}) {
  const [questionTitle, setQuestionTitle] = useState("Thực hiện bài toán sau:");
  const [prompt, setPrompt] = useState("");
  const [questionImage, setQuestionImage] = useState(null);
  const [choiceImages, setChoiceImages] = useState([null, null]);
  const [correctChoice, setCorrectChoice] = useState(null); // index
  const [hint, setHint] = useState("");
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial data from initialEnvelope in edit mode
  useEffect(() => {
    if (initialEnvelope && !isInitialized) {
      console.log(
        "📥 ImageChoiceEditor: Loading initial envelope",
        initialEnvelope
      );

      if (initialEnvelope.questionTitle) {
        setQuestionTitle(initialEnvelope.questionTitle);
      }

      if (initialEnvelope.prompt) {
        setPrompt(initialEnvelope.prompt);
      }

      if (initialEnvelope.detail?.choices) {
        const choices = initialEnvelope.detail.choices.map((choice) => ({
          url: choice.image,
          alt: choice.label || "",
        }));
        setChoiceImages(choices);

        // Find correct choice index
        const correctIdx = initialEnvelope.detail.choices.findIndex(
          (c) => c.correct
        );
        if (correctIdx >= 0) {
          setCorrectChoice(correctIdx);
        }
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

  const setChoiceImage = (index, img) => {
    const next = [...choiceImages];
    next[index] = img;
    setChoiceImages(next);
    if (correctChoice != null && !next[correctChoice]) {
      setCorrectChoice(null);
    }
  };

  const addChoice = () => {
    if (choiceImages.length < 6) setChoiceImages([...choiceImages, null]);
  };
  const removeChoice = (i) => {
    if (choiceImages.length <= 2) return;
    const next = choiceImages.filter((_, idx) => idx !== i);
    setChoiceImages(next);
    if (correctChoice === i) setCorrectChoice(null);
    else if (correctChoice > i) setCorrectChoice(correctChoice - 1);
  };

  const buildEnvelope = () => {
    const images = choiceImages
      .map((img, idx) => ({ idx, img }))
      .filter((c) => c.img && c.img.url);

    const detail = {
      options: images.map((c, i) => ({
        id: String.fromCharCode(65 + i),
        image: {
          url: c.img.url,
          alt: c.img.alt || "",
          file: c.img.file || null, // ✅ Preserve file object for upload
        },
        correct: images[i].idx === correctChoice,
      })),
      shuffle: true,
    };

    const media = questionImage?.url
      ? [
          {
            type: "image",
            url: questionImage.url,
            alt: questionImage.alt || "",
            file: questionImage.file || null, // ✅ Preserve file object for upload
          },
        ]
      : [];

    const envelope = makeQuestionEnvelope({
      kind: KINDS.IMAGE_CHOICE,
      prompt,
      detail,
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
  }, [questionTitle, prompt, questionImage, choiceImages, correctChoice, hint]);

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
          placeholder="Nhập đề bài..."
        />
      </div>

      <QLBT_ImageUpload
        fieldId="questionImage"
        label="Hình ảnh câu hỏi (tùy chọn)"
        value={questionImage}
        onChange={(id, img) => setQuestionImage(img)}
        accept="image/*"
        maxSize="5MB"
      />

      <div className="qlbt-form-group">
        <div className="qlbt-section-title">Hình ảnh đáp án (2-6)</div>
        <div className="qlbt-choices-container">
          {choiceImages.map((img, idx) => (
            <div key={idx} className="qlbt-choice-item">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <div style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                  Lựa chọn {String.fromCharCode(65 + idx)}
                </div>
                {choiceImages.length > 2 && (
                  <button
                    type="button"
                    className="qlbt-btn-remove"
                    onClick={() => removeChoice(idx)}
                  >
                    Xóa
                  </button>
                )}
              </div>
              <QLBT_ImageUpload
                fieldId={`choice-${idx}`}
                label=""
                value={img}
                onChange={(id, image) => setChoiceImage(idx, image)}
                accept="image/*"
                maxSize="3MB"
              />
              {img && img.url && (
                <label
                  className="qlbt-checkbox-label"
                  style={{ fontSize: "0.875rem", marginTop: "8px" }}
                >
                  <input
                    type="radio"
                    name="correct"
                    checked={correctChoice === idx}
                    onChange={() => setCorrectChoice(idx)}
                  />
                  Đáp án đúng
                </label>
              )}
            </div>
          ))}
        </div>
        {choiceImages.length < 6 && (
          <button type="button" className="qlbt-btn-add" onClick={addChoice}>
            + Thêm hình
          </button>
        )}
      </div>

      <div className="qlbt-form-group">
        <label className="qlbt-label">Giải thích (tùy chọn)</label>
        <textarea
          className="qlbt-textarea"
          style={{ height: "64px" }}
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          placeholder="Giải thích chi tiết..."
        />
      </div>

      {error && <div className="qlbt-error-text">{error}</div>}
    </div>
  );
}
