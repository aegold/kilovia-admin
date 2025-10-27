/**
 * ExpressionPreview - Preview component for EXPRESSION questions
 * Displays mathematical expression with blanks
 */

import React from "react";

export default function ExpressionPreview({ prompt, detail, showAnswer }) {
  const operation = detail?.operation || "multiplication";
  const operand1 = detail?.operand1 || "";
  const operand2 = detail?.operand2 || "";
  const result = detail?.result || "";
  const mode = detail?.mode || "blank_result";

  // Get operator symbol
  const getSymbol = (op) => {
    switch (op) {
      case "addition":
        return "+";
      case "subtraction":
        return "-";
      case "division":
        return "÷";
      case "multiplication":
      default:
        return "×";
    }
  };

  const symbol = getSymbol(operation);

  // Determine which fields are blanks based on mode
  const isBlank = {
    operand1:
      mode === "blank_operand1" ||
      mode === "blank_both_operands" ||
      mode === "blank_all",
    operand2:
      mode === "blank_operand2" ||
      mode === "blank_both_operands" ||
      mode === "blank_all",
    result: mode === "blank_result" || mode === "blank_all",
  };

  const renderField = (value, isBlankField, label) => {
    if (!isBlankField) {
      return <span className="font-bold text-2xl text-gray-800">{value}</span>;
    }

    // Always show "?" for blank fields
    return (
      <span className="inline-flex items-center justify-center w-20 h-12 text-3xl font-bold text-blue-400 border-b-3 border-blue-400">
        ?
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Prompt */}
      {prompt && (
        <div className="text-gray-800 text-base leading-relaxed mb-4">
          {prompt}
        </div>
      )}

      {/* Expression Display */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-4 p-8 bg-white border-2 border-gray-300 rounded-lg shadow-sm">
          {/* Operand 1 */}
          {renderField(operand1, isBlank.operand1, "Số hạng 1")}

          {/* Operator */}
          <span className="text-3xl font-bold text-blue-600">{symbol}</span>

          {/* Operand 2 */}
          {renderField(operand2, isBlank.operand2, "Số hạng 2")}

          {/* Equal sign */}
          <span className="text-3xl font-bold text-gray-600">=</span>

          {/* Result */}
          {renderField(result, isBlank.result, "Kết quả")}
        </div>
      </div>

      {/* Show answers - always display full answer */}
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="text-sm text-green-800">
          <span className="font-semibold">Đáp án:</span>
          <div className="mt-2 font-mono text-base">
            {operand1} {symbol} {operand2} = {result}
          </div>
        </div>
      </div>

      {/* Mode description */}
      <div className="text-xs text-gray-500 text-center italic">
        {mode === "blank_result" && `Tìm kết quả`}
        {mode === "blank_operand1" && `Tìm số hạng 1`}
        {mode === "blank_operand2" && `Tìm số hạng 2`}
        {mode === "blank_both_operands" && `Tìm cả 2 số hạng`}
        {mode === "blank_all" && `Tìm tất cả các giá trị`}
      </div>

      {/* Hint for multiple blanks */}
      {(mode === "blank_both_operands" || mode === "blank_all") && (
        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-sm text-yellow-800 flex items-center gap-2">
            <span>💡</span>
            <span>Nên có hình ảnh đi kèm để gợi ý cho học sinh</span>
          </div>
        </div>
      )}
    </div>
  );
}
