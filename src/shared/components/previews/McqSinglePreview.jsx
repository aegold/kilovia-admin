/**
 * McqSinglePreview - Preview component for MCQ_SINGLE questions
 * Displays multiple choice question with radio buttons
 */

import React from "react";

export default function McqSinglePreview({ prompt, detail, showAnswer }) {
  const options = detail?.options || [];
  const correctOption = options.find((opt) => opt.correct);

  return (
    <div className="space-y-4">
      {/* Prompt */}
      {prompt && (
        <div className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
          {prompt}
        </div>
      )}

      {/* Options */}
      <div className="space-y-2">
        {options.map((opt) => (
          <label
            key={opt.id}
            className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
              showAnswer && opt.correct
                ? "bg-green-50 border-green-300"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="preview_mcq"
              className="mt-1"
              checked={showAnswer && opt.correct}
              disabled={!showAnswer}
              readOnly
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">{opt.id}.</span>
                <span className="text-gray-800">{opt.text}</span>
              </div>
              {showAnswer && opt.correct && (
                <div className="mt-1 text-sm text-green-600 font-medium">
                  ✓ Đáp án đúng
                </div>
              )}
            </div>
          </label>
        ))}
      </div>

      {/* Show answer - always display */}
      {correctOption && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm text-green-800">
            <span className="font-semibold">Đáp án:</span> {correctOption.id} -{" "}
            {correctOption.text}
          </div>
        </div>
      )}

      {/* Shuffle notice */}
      {detail?.shuffle && (
        <div className="text-xs text-gray-500 italic">
          ℹ️ Các phương án sẽ được xáo trộn khi hiển thị cho học sinh
        </div>
      )}
    </div>
  );
}
