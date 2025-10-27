/**
 * ExpressionPreview - Preview component for EXPRESSION questions
 * Displays mathematical expression with blanks
 */

import React from "react";

export default function ExpressionPreview({
  prompt,
  detail,
  showAnswer,
  media,
}) {
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
      return (
        <span
          style={{
            fontWeight: "700",
            fontSize: "1.5rem",
            color: "#1f2937",
          }}
        >
          {value}
        </span>
      );
    }

    // Always show "?" for blank fields
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "80px",
          height: "48px",
          fontSize: "1.875rem",
          fontWeight: "700",
          color: "#60a5fa",
          borderBottom: "3px solid #60a5fa",
        }}
      >
        ?
      </span>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Prompt */}
      {prompt && <div className="qlbt-question-text">{prompt}</div>}

      {/* Question Image */}
      {media && media.length > 0 && media[0].url && (
        <div className="qlbt-question-image">
          <img src={media[0].url} alt={media[0].alt || "Hình minh họa"} />
        </div>
      )}

      {/* Expression Display */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "1rem",
            padding: "2rem",
            backgroundColor: "white",
            border: "2px solid #d1d5db",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Operand 1 */}
          {renderField(operand1, isBlank.operand1, "Số hạng 1")}

          {/* Operator */}
          <span
            style={{
              fontSize: "1.875rem",
              fontWeight: "700",
              color: "#2563eb",
            }}
          >
            {symbol}
          </span>

          {/* Operand 2 */}
          {renderField(operand2, isBlank.operand2, "Số hạng 2")}

          {/* Equal sign */}
          <span
            style={{
              fontSize: "1.875rem",
              fontWeight: "700",
              color: "#4b5563",
            }}
          >
            =
          </span>

          {/* Result */}
          {renderField(result, isBlank.result, "Kết quả")}
        </div>
      </div>

      {/* Show answers - always display with green box like MCQ */}
      <div className="qlbt-choice-item correct" style={{ marginTop: "1rem" }}>
        <div className="qlbt-choice-letter">✓</div>
        <div className="qlbt-choice-text">
          <span style={{ fontWeight: "600" }}>Đáp án:</span>{" "}
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
          >
            {operand1} {symbol} {operand2} = {result}
          </span>
        </div>
      </div>

      {/* Mode description */}
      <div
        style={{
          fontSize: "0.75rem",
          color: "#6b7280",
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        {mode === "blank_result" && `Tìm kết quả`}
        {mode === "blank_operand1" && `Tìm số hạng 1`}
        {mode === "blank_operand2" && `Tìm số hạng 2`}
        {mode === "blank_both_operands" && `Tìm cả 2 số hạng`}
        {mode === "blank_all" && `Tìm tất cả các giá trị`}
      </div>

      {/* Hint for multiple blanks */}
      {(mode === "blank_both_operands" || mode === "blank_all") && (
        <div
          style={{
            marginTop: "0.5rem",
            padding: "0.75rem",
            backgroundColor: "#fefce8",
            border: "1px solid #fde047",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              fontSize: "0.875rem",
              color: "#854d0e",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span>💡</span>
            <span>Nên có hình ảnh đi kèm để gợi ý cho học sinh</span>
          </div>
        </div>
      )}
    </div>
  );
}
