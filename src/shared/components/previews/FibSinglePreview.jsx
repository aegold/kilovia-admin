/**
 * FibSinglePreview - Preview component for FIB_SINGLE questions
 * Displays fill-in-the-blank question with input field
 */

import React from "react";

export default function FibSinglePreview({ prompt, detail, showAnswer }) {
  const answer = detail?.answer || "";
  const caseSensitive = detail?.case_sensitive || false;
  const normalizeSpace = detail?.normalize_space !== false;

  // Parse prompt to find blank position [____]
  const renderPrompt = () => {
    if (!prompt) return null;

    const parts = prompt.split(/(\[____\])/g);
    return (
      <div className="text-gray-800 text-base leading-relaxed">
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

      {/* Show answer - always display */}
      {answer && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm text-green-800">
            <span className="font-semibold">Đáp án:</span>{" "}
            <span className="font-mono bg-white px-2 py-1 rounded border">
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
