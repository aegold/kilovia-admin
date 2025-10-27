/**
 * VerticalCalculationPreview - Preview component for VERTICAL_CALCULATION questions
 * Displays vertical calculation with proper formatting
 */

import React from "react";

export default function VerticalCalculationPreview({
  prompt,
  detail,
  showAnswer,
}) {
  const layout = detail?.layout || {};
  const result = detail?.result || "";
  const rows = layout.rows || [];
  const mode = layout.mode || "addition";

  // Get operator symbol
  const getOperatorSymbol = (op) => {
    if (op === "+") return "+";
    if (op === "-") return "-";
    return op;
  };

  // For mixed mode, we have multiple operators
  const operators = layout.operators || [];
  const mainOperator =
    mode === "addition" ? "+" : mode === "subtraction" ? "-" : operators[0];

  // Find the longest number to set width
  const maxLength = Math.max(
    ...rows.map((r) => String(r).length),
    String(result).length
  );
  const cellWidth = `${Math.max(maxLength * 16, 60)}px`;

  return (
    <div className="space-y-4">
      {/* Prompt */}
      {prompt && (
        <div className="text-gray-800 text-base leading-relaxed mb-4">
          {prompt}
        </div>
      )}

      {/* Vertical Calculation Display */}
      <div className="flex justify-center">
        <div className="inline-block border-2 border-gray-300 rounded-lg p-6 bg-white shadow-sm">
          <div className="font-mono text-xl space-y-2">
            {/* First row (no operator) */}
            <div className="flex items-center justify-end gap-3">
              <div className="w-6"></div>
              <div
                className="text-right font-semibold"
                style={{ width: cellWidth }}
              >
                {rows[0]}
              </div>
            </div>

            {/* Subsequent rows with operators */}
            {rows.slice(1).map((row, index) => {
              const op = mode === "mixed" ? operators[index] : mainOperator;
              return (
                <div
                  key={index}
                  className="flex items-center justify-end gap-3"
                >
                  <div className="w-6 text-center font-bold text-blue-600">
                    {getOperatorSymbol(op)}
                  </div>
                  <div
                    className="text-right font-semibold"
                    style={{ width: cellWidth }}
                  >
                    {row}
                  </div>
                </div>
              );
            })}

            {/* Horizontal line */}
            <div className="flex items-center justify-end gap-3">
              <div className="w-6"></div>
              <div style={{ width: cellWidth }}>
                <div className="border-t-2 border-gray-800"></div>
              </div>
            </div>

            {/* Result row */}
            <div className="flex items-center justify-end gap-3">
              <div className="w-6"></div>
              <div className="text-right" style={{ width: cellWidth }}>
                <span className="inline-flex items-center justify-center text-2xl font-bold text-blue-400">
                  ?
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Show answer - always display */}
      {result && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm text-green-800">
            <span className="font-semibold">Đáp án:</span>{" "}
            <span className="font-mono text-lg font-bold">{result}</span>
          </div>
        </div>
      )}

      {/* Calculation type info */}
      <div className="text-xs text-gray-500 text-center italic">
        {mode === "addition" && "Phép cộng theo cột"}
        {mode === "subtraction" && "Phép trừ theo cột"}
        {mode === "mixed" && "Phép tính cộng trừ đan xen"}
      </div>
    </div>
  );
}
