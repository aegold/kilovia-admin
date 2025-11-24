/**
 * MultipleFillInPreview - Preview component for MULTIPLE_FILL_IN questions
 * Displays question with multiple fill-in-the-blank fields
 */

import React from "react";

export default function MultipleFillInPreview({
  prompt,
  detail,
  showAnswer,
  media,
  explanation,
}) {
  const blocks = detail?.blocks || [];
  const answers = detail?.answers || [];

  const renderBlock = (block, index) => {
    switch (block.type) {
      case "text":
        return (
          <div
            key={index}
            className={`qlbt-question-text ${
              block.down_line ? "mb-3" : "mb-2"
            }`}
          >
            {block.content}
          </div>
        );

      case "image":
        return (
          <div key={index} className="mb-4 flex justify-center">
            <img
              src={block.src}
              alt={block.alt || "Hình minh họa"}
              className="max-w-full h-auto rounded-lg border"
              style={{
                width: block.width || "auto",
                maxWidth: "400px",
              }}
            />
          </div>
        );

      case "fill-in-group":
        return (
          <div key={index} style={{ marginBottom: "1.5rem" }}>
            {(block.items || []).map((item, itemIndex) => {
              const answer = answers.find((a) => a.id === item.input?.id);
              return (
                <div
                  key={itemIndex}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginTop: item.newLine ? "12px" : "0",
                    marginBottom: "8px",
                  }}
                >
                  {item.before && (
                    <span style={{ fontSize: "0.95rem", color: "#374151" }}>
                      {item.before}
                    </span>
                  )}
                  <input
                    type={item.input?.type || "text"}
                    placeholder="____"
                    value=""
                    style={{
                      width: item.input?.width || "80px",
                      padding: "6px 12px",
                      border: "2px dashed #3b82f6",
                      borderRadius: "6px",
                      textAlign: "center",
                      backgroundColor: "#eff6ff",
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      color: "#1e40af",
                      outline: "none",
                    }}
                    readOnly
                  />
                  {item.after && (
                    <span style={{ fontSize: "0.95rem", color: "#374151" }}>
                      {item.after}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Render all blocks (image is included in blocks) */}
      {blocks.map((block, index) => renderBlock(block, index))}

      {/* Show answers - with green boxes like MCQ */}
      {answers.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <div
            className="qlbt-section-title"
            style={{ marginBottom: "0.75rem" }}
          >
            Đáp án:
          </div>
          <div className="qlbt-choices-container">
            {answers.map((answer, index) => (
              <div key={index} className="qlbt-choice-item correct">
                <div className="qlbt-choice-letter">{index + 1}</div>
                <div className="qlbt-choice-text">
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      marginRight: "0.5rem",
                    }}
                  >
                    {answer.id}:
                  </span>
                  <span style={{ fontWeight: "600" }}>{answer.expression}</span>
                </div>
                <div className="qlbt-correct-badge">✓</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explanation */}
      {explanation && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            backgroundColor: "#eff6ff",
            border: "1px solid #3b82f6",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#1e40af",
              marginBottom: "0.5rem",
            }}
          >
            💡 Giải thích:
          </div>
          <div
            style={{
              fontSize: "0.875rem",
              color: "#374151",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
            }}
          >
            {explanation}
          </div>
        </div>
      )}
    </div>
  );
}
