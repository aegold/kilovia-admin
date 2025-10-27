/**
 * McqSinglePreview - Preview component for MCQ_SINGLE questions
 * Displays multiple choice question with radio buttons
 */

import React from "react";

export default function McqSinglePreview({
  prompt,
  detail,
  showAnswer,
  media,
}) {
  const options = detail?.options || [];
  const correctOption = options.find((opt) => opt.correct);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Prompt */}
      {prompt && (
        <div className="qlbt-question-text" style={{ whiteSpace: "pre-wrap" }}>
          {prompt}
        </div>
      )}

      {/* Image if exists */}
      {media && media.length > 0 && media[0]?.url && (
        <div
          className="qlbt-question-image"
          style={{
            textAlign: "center",
            margin: "1rem 0",
            padding: "0.75rem",
            background: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #e9ecef",
          }}
        >
          <img
            src={media[0].url}
            alt={media[0].alt || "Question image"}
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
              borderRadius: "8px",
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>
      )}

      {/* Options */}
      <div className="qlbt-choices-preview">
        {options.map((opt) => (
          <div
            key={opt.id}
            className={`qlbt-choice-item ${
              showAnswer && opt.correct ? "correct" : ""
            }`}
          >
            <div className="qlbt-choice-letter">{opt.id}</div>
            <div className="qlbt-choice-text">{opt.text}</div>
            {showAnswer && opt.correct && (
              <span className="qlbt-correct-badge">✓</span>
            )}
          </div>
        ))}
      </div>

      {/* Show answer - always display */}
      {correctOption && (
        <div
          style={{
            marginTop: "0.5rem",
            padding: "0.75rem",
            background: "#f0fdf4",
            border: "1px solid #22c55e",
            borderRadius: "8px",
            fontSize: "0.9rem",
          }}
        >
          <div style={{ color: "#166534" }}>
            <span style={{ fontWeight: "600" }}>Đáp án đúng:</span>{" "}
            {correctOption.id} - {correctOption.text}
          </div>
        </div>
      )}

      {/* Shuffle notice */}
      {detail?.shuffle && (
        <div
          style={{
            fontSize: "0.75rem",
            color: "#6b7280",
            fontStyle: "italic",
            marginTop: "0.5rem",
          }}
        >
          ℹ️ Các phương án sẽ được xáo trộn khi hiển thị cho học sinh
        </div>
      )}
    </div>
  );
}
