/**
 * MatchingPairsPreview - Preview component for MATCHING_PAIRS questions
 * Displays two columns with items that can be matched
 */

import React from "react";

export default function MatchingPairsPreview({
  prompt,
  detail,
  showAnswer,
  media,
  explanation,
}) {
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
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Prompt */}
      {prompt && <div className="qlbt-question-text">{prompt}</div>}

      {/* Question Image */}
      {media && media.length > 0 && media[0].url && (
        <div className="qlbt-question-image">
          <img src={media[0].url} alt={media[0].alt || "Hình minh họa"} />
        </div>
      )}

      {/* Matching Columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        {/* Left Column */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <div
            style={{
              textAlign: "center",
              fontWeight: "600",
              color: "#374151",
              paddingBottom: "0.5rem",
              borderBottom: "2px solid #60a5fa",
            }}
          >
            {leftColumn.label}
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {leftColumn.items.map((item, index) => (
              <div
                key={item.id}
                style={{
                  padding: "0.75rem",
                  border:
                    showAnswer && pairMap[item.id]
                      ? "2px solid #4ade80"
                      : "2px solid #d1d5db",
                  borderRadius: "8px",
                  backgroundColor:
                    showAnswer && pairMap[item.id] ? "#f0fdf4" : "white",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#dbeafe",
                      color: "#1d4ed8",
                      borderRadius: "50%",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                    }}
                  >
                    {index + 1}
                  </span>
                  <span style={{ color: "#1f2937" }}>{item.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <div
            style={{
              textAlign: "center",
              fontWeight: "600",
              color: "#374151",
              paddingBottom: "0.5rem",
              borderBottom: "2px solid #60a5fa",
            }}
          >
            {rightColumn.label}
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {rightColumn.items.map((item, index) => (
              <div
                key={item.id}
                style={{
                  padding: "0.75rem",
                  border:
                    showAnswer && Object.values(pairMap).includes(item.id)
                      ? "2px solid #4ade80"
                      : "2px solid #d1d5db",
                  borderRadius: "8px",
                  backgroundColor:
                    showAnswer && Object.values(pairMap).includes(item.id)
                      ? "#f0fdf4"
                      : "white",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f3e8ff",
                      color: "#7c3aed",
                      borderRadius: "50%",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                    }}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span style={{ color: "#1f2937" }}>{item.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Show correct pairs - always display with green boxes like MCQ */}
      {pairs.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <div
            className="qlbt-section-title"
            style={{ marginBottom: "0.75rem" }}
          >
            Đáp án - Các cặp đúng:
          </div>
          <div className="qlbt-choices-container">
            {pairs.map((pair, index) => {
              const leftItem = leftColumn.items.find(
                (item) => item.id === pair.left
              );
              const rightItem = rightColumn.items.find(
                (item) => item.id === pair.right
              );
              return (
                <div key={index} className="qlbt-choice-item correct">
                  <div className="qlbt-choice-letter">{index + 1}</div>
                  <div className="qlbt-choice-text">
                    <span>{leftItem?.text}</span>
                    <span
                      style={{
                        margin: "0 0.5rem",
                        color: "#22c55e",
                        fontWeight: "700",
                      }}
                    >
                      ↔
                    </span>
                    <span>{rightItem?.text}</span>
                  </div>
                  <div className="qlbt-correct-badge">✓</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Settings info */}
      <div
        style={{
          fontSize: "0.75rem",
          color: "#6b7280",
          fontStyle: "italic",
          textAlign: "center",
        }}
      >
        {allowPartialCredit
          ? "✓ Cho phép tính điểm từng phần"
          : "Chỉ tính điểm khi tất cả các cặp đúng"}
      </div>

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
