/**
 * FibSinglePreview - Preview component for FIB_SINGLE questions
 * Displays fill-in-the-blank question with input field
 */

import React from "react";

export default function FibSinglePreview({
  prompt,
  detail,
  showAnswer,
  media,
}) {
  const answer = detail?.answer || "";
  const caseSensitive = detail?.case_sensitive || false;
  const normalizeSpace = detail?.normalize_space !== false;

  // Parse prompt to find blank position [____]
  const renderPrompt = () => {
    if (!prompt) return null;

    const parts = prompt.split(/(\[____\])/g);
    return (
      <div className="qlbt-question-text">
        {parts.map((part, index) => {
          if (part === "[____]") {
            return (
              <span key={index} className="inline-flex items-center mx-1">
                <input
                  type="text"
                  className="border-b-2 border-blue-400 px-2 py-1 w-32 text-center focus:outline-none focus:border-blue-600"
                  placeholder="..."
                  value={showAnswer ? answer : ""}
                  readOnly
                />
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Prompt with blank */}
      {renderPrompt()}

      {/* Question Image */}
      {media && media.length > 0 && media[0].url && (
        <div className="qlbt-question-image">
          <img src={media[0].url} alt={media[0].alt || "Hình minh họa"} />
        </div>
      )}

      {/* Show answer - always display with green box like MCQ */}
      {answer && (
        <div className="qlbt-choice-item correct" style={{ marginTop: "1rem" }}>
          <div className="qlbt-choice-letter">✓</div>
          <div className="qlbt-choice-text">
            <span style={{ fontWeight: "600" }}>Đáp án:</span>{" "}
            <span style={{ fontFamily: "monospace", fontSize: "1.05rem" }}>
              {answer}
            </span>
          </div>
        </div>
      )}

      {/* Settings info */}
      <div className="text-xs text-gray-500 space-y-1">
        {caseSensitive && <div>🔤 Phân biệt chữ hoa/thường</div>}
        {!caseSensitive && <div>🔡 Không phân biệt chữ hoa/thường</div>}
        {normalizeSpace && <div>␣ Chuẩn hóa khoảng trắng</div>}
      </div>
    </div>
  );
}
