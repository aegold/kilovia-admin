/**
 * MatchingPairsPreview - Preview component for MATCHING_PAIRS questions
 * Displays two columns with items that can be matched
 */

import React from "react";

export default function MatchingPairsPreview({ prompt, detail, showAnswer }) {
  const columns = detail?.columns || [];
  const pairs = detail?.pairs || [];
  const allowPartialCredit = detail?.allowPartialCredit || false;

  // Get column items
  const leftColumn = columns[0] || { label: "Cột A", items: [] };
  const rightColumn = columns[1] || { label: "Cột B", items: [] };

  // Create a map of correct pairs for highlighting
  const pairMap = {};
  pairs.forEach((pair) => {
    pairMap[pair.left] = pair.right;
  });

  return (
    <div className="space-y-4">
      {/* Prompt */}
      {prompt && (
        <div className="text-gray-800 text-base leading-relaxed mb-4">
          {prompt}
        </div>
      )}

      {/* Matching Columns */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-3">
          <div className="text-center font-semibold text-gray-700 pb-2 border-b-2 border-blue-400">
            {leftColumn.label}
          </div>
          <div className="space-y-2">
            {leftColumn.items.map((item, index) => (
              <div
                key={item.id}
                className={`p-3 border-2 rounded-lg ${
                  showAnswer && pairMap[item.id]
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-gray-800">{item.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <div className="text-center font-semibold text-gray-700 pb-2 border-b-2 border-blue-400">
            {rightColumn.label}
          </div>
          <div className="space-y-2">
            {rightColumn.items.map((item, index) => (
              <div
                key={item.id}
                className={`p-3 border-2 rounded-lg ${
                  showAnswer && Object.values(pairMap).includes(item.id)
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="shrink-0 w-6 h-6 flex items-center justify-center bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-800">{item.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Show correct pairs - always display */}
      {pairs.length > 0 && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm text-green-800 font-semibold mb-3">
            Đáp án - Các cặp đúng:
          </div>
          <div className="space-y-2">
            {pairs.map((pair, index) => {
              const leftItem = leftColumn.items.find(
                (item) => item.id === pair.left
              );
              const rightItem = rightColumn.items.find(
                (item) => item.id === pair.right
              );
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 text-sm bg-white p-2 rounded border border-green-300"
                >
                  <span className="text-gray-700">{leftItem?.text}</span>
                  <span className="text-green-600 font-bold">↔</span>
                  <span className="text-gray-700">{rightItem?.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Settings info */}
      <div className="text-xs text-gray-500 italic text-center">
        {allowPartialCredit
          ? "✓ Cho phép tính điểm từng phần"
          : "Chỉ tính điểm khi tất cả các cặp đúng"}
      </div>
    </div>
  );
}
