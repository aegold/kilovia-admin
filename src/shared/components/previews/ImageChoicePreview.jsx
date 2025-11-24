/**
 * ImageChoicePreview - Preview component for IMAGE_CHOICE questions
 * Displays question with image options for selection
 */

import React from "react";

export default function ImageChoicePreview({
  prompt,
  detail,
  showAnswer,
  media,
  explanation,
}) {
  const options = detail?.options || [];
  const correctOption = options.find((opt) => opt.correct);

  return (
    <div className="space-y-4">
      {/* Prompt */}
      {prompt && <div className="qlbt-question-text">{prompt}</div>}

      {/* Question Image */}
      {media && media.length > 0 && media[0].url && (
        <div className="qlbt-question-image">
          <img src={media[0].url} alt={media[0].alt || "Hình minh họa"} />
        </div>
      )}

      {/* Image Options Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {options.map((opt) => (
          <label
            key={opt.id}
            className={`relative flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
              showAnswer && opt.correct
                ? "border-green-400 bg-green-50 shadow-lg"
                : "border-gray-200 hover:border-blue-300 hover:shadow-md"
            }`}
          >
            {/* Radio button */}
            <input
              type="radio"
              name="preview_image_choice"
              className="absolute top-2 left-2"
              checked={showAnswer && opt.correct}
              disabled={!showAnswer}
              readOnly
            />

            {/* Option label */}
            <div className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-white border border-gray-300 rounded-full text-xs font-semibold">
              {opt.id}
            </div>

            {/* Image */}
            <div className="mt-2 w-full aspect-square flex items-center justify-center overflow-hidden rounded">
              <img
                src={opt.image?.url}
                alt={opt.image?.alt || `Lựa chọn ${opt.id}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Correct indicator */}
            {showAnswer && opt.correct && (
              <div className="mt-2 text-xs font-medium text-green-600 flex items-center gap-1">
                <span className="text-base">✓</span>
                Đáp án đúng
              </div>
            )}
          </label>
        ))}
      </div>

      {/* Show answer - always display with green box like MCQ */}
      {correctOption && (
        <div className="qlbt-choice-item correct" style={{ marginTop: "1rem" }}>
          <div className="qlbt-choice-letter">{correctOption.id}</div>
          <div className="qlbt-choice-text">
            <span style={{ fontWeight: "600" }}>Đáp án đúng</span>
          </div>
          <div className="qlbt-correct-badge">✓</div>
        </div>
      )}

      {/* Shuffle notice */}
      {detail?.shuffle && (
        <div className="text-xs text-gray-500 italic">
          ℹ️ Các hình ảnh sẽ được xáo trộn khi hiển thị cho học sinh
        </div>
      )}

      {/* Explanation */}
      {explanation && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            backgroundColor: "#eff6ff",
            border: "1px solid #3b82f6",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#1e40af",
              marginBottom: "0.5rem",
            }}
          >
            💡 Giải thích:
          </div>
          <div
            style={{
              fontSize: "0.875rem",
              color: "#374151",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
            }}
          >
            {explanation}
          </div>
        </div>
      )}
    </div>
  );
}
