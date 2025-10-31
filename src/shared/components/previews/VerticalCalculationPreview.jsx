/**
 * VerticalCalculationPreview - Preview component for VERTICAL_CALCULATION questions
 * Displays vertical calculation with proper formatting
 */

import React from "react";

export default function VerticalCalculationPreview({
  prompt,
  detail,
  showAnswer,
  media,
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
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Prompt */}
      {prompt && <div className="qlbt-question-text">{prompt}</div>}

      {/* Question Image */}
      {media && media.length > 0 && media[0].url && (
        <div className="qlbt-question-image">
          <img src={media[0].url} alt={media[0].alt || "Hình minh họa"} />
        </div>
      )}

      {/* Vertical Calculation Display */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "inline-block",
            border: "2px solid #d1d5db",
            borderRadius: "8px",
            padding: "1.5rem",
            backgroundColor: "white",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {/* First row (no operator) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "0.75rem",
              }}
            >
              <div style={{ width: "24px" }}></div>
              <div
                style={{
                  width: cellWidth,
                  textAlign: "right",
                  fontWeight: "600",
                  color: "#111827",
                }}
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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      textAlign: "center",
                      fontWeight: "700",
                      color: "#2563eb",
                    }}
                  >
                    {getOperatorSymbol(op)}
                  </div>
                  <div
                    style={{
                      width: cellWidth,
                      textAlign: "right",
                      fontWeight: "600",
                      color: "#111827",
                    }}
                  >
                    {row}
                  </div>
                </div>
              );
            })}

            {/* Horizontal line */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "0.75rem",
              }}
            >
              <div style={{ width: "24px" }}></div>
              <div style={{ width: cellWidth }}>
                <div
                  style={{
                    borderTop: "2px solid #1f2937",
                    margin: "0.25rem 0",
                  }}
                ></div>
              </div>
            </div>

            {/* Result row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "0.75rem",
              }}
            >
              <div style={{ width: "24px" }}></div>
              <div style={{ width: cellWidth, textAlign: "right" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#111827",
                    backgroundColor: "transparent",
                  }}
                >
                  ?
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Show answer - always display with green box like MCQ */}
      {result && (
        <div className="qlbt-choice-item correct" style={{ marginTop: "1rem" }}>
          <div className="qlbt-choice-letter">✓</div>
          <div className="qlbt-choice-text">
            <span style={{ fontWeight: "600" }}>Đáp án:</span>{" "}
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "1.25rem",
                fontWeight: "700",
              }}
            >
              {result}
            </span>
          </div>
        </div>
      )}

      {/* Calculation type info */}
      <div
        style={{
          fontSize: "0.75rem",
          color: "#6b7280",
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        {mode === "addition" && "Phép cộng theo cột"}
        {mode === "subtraction" && "Phép trừ theo cột"}
        {mode === "mixed" && "Phép tính cộng trừ đan xen"}
      </div>
    </div>
  );
}
