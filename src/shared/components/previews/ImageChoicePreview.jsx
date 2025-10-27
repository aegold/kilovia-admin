/**
 * ImageChoicePreview - Preview component for IMAGE_CHOICE questions
 * Displays question with image options for selection
 */

import React from "react";

export default function ImageChoicePreview({ prompt, detail, showAnswer }) {
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

      {/* Show answer - always display */}
      {correctOption && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm text-green-800">
            <span className="font-semibold">Đáp án:</span> {correctOption.id}
          </div>
        </div>
      )}

      {/* Shuffle notice */}
      {detail?.shuffle && (
        <div className="text-xs text-gray-500 italic">
          ℹ️ Các hình ảnh sẽ được xáo trộn khi hiển thị cho học sinh
        </div>
      )}
    </div>
  );
}
