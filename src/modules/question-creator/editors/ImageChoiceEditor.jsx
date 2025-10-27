import React, { useEffect, useState } from "react";
import { KINDS } from "@shared/constants/kinds";
import { makeQuestionEnvelope } from "@shared/utils/envelop";
import QLBT_ImageUpload from "../components/QLBT_ImageUpload";
import "../styles/QLBT_EditorTheme.css";

export default function ImageChoiceEditor({
  onEnvelopeChange,
  onSave,
  hierarchy,
  isSaving = false,
  initialEnvelope = null,
}) {
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
    // Validate minimal: need prompt + at least one image + correctChoice set
    if (!prompt.trim()) throw new Error("Cần nhập đề bài");
    const images = choiceImages
      .map((img, idx) => ({ idx, img }))
      .filter((c) => c.img && c.img.url);
    if (images.length < 2) throw new Error("Cần ít nhất 2 hình đáp án");
    if (
      correctChoice == null ||
      !choiceImages[correctChoice] ||
      !choiceImages[correctChoice].url
    )
      throw new Error("Chọn 1 đáp án đúng");

    const detail = {
      options: images.map((c, i) => ({
        id: String.fromCharCode(65 + i),
        image: { url: c.img.url, alt: c.img.alt || "" },
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
          },
        ]
      : [];

    return makeQuestionEnvelope({
      kind: KINDS.IMAGE_CHOICE,
      prompt,
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
  }, [prompt, questionImage, choiceImages, correctChoice, hint]);

  return (
    <div className="qlbt-card space-y-3">
      <div className="qlbt-field">
        <label className="qlbt-label">Đề bài</label>
        <textarea
          className="qlbt-textarea h-20"
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

      <div className="space-y-2">
        <div className="qlbt-section-title">Hình ảnh đáp án (2-6)</div>
        {choiceImages.map((img, idx) => (
          <div key={idx} className="border rounded p-2 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                Lựa chọn {String.fromCharCode(65 + idx)}
              </div>
              {choiceImages.length > 2 && (
                <button
                  type="button"
                  className="px-2 py-1 border rounded text-sm"
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
              <label className="text-sm flex items-center gap-2">
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
        {choiceImages.length < 6 && (
          <button
            type="button"
            className="px-2 py-1 border rounded"
            onClick={addChoice}
          >
            + Thêm hình
          </button>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Giải thích (tùy chọn)
        </label>
        <textarea
          className="border rounded px-2 py-1 w-full h-16"
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          placeholder="Giải thích chi tiết..."
        />
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}
    </div>
  );
}
