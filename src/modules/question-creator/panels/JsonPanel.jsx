// JsonPanel - JSON import/export panel
import React, { useState } from "react";
import "../styles/QLBT_EditorTheme.css";

export default function JsonPanel({ currentKind, onImportValid, envelope }) {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState("");
  const [showEnvelope, setShowEnvelope] = useState(false);

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onImportValid(parsed);
      setError("");
      setJsonText("");
    } catch (err) {
      setError("JSON không hợp lệ: " + err.message);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="qlbt-section-title">📋 JSON Editor</div>

      {/* Current envelope display - Collapsible */}
      {envelope && (
        <div style={{ marginBottom: "0.5rem" }}>
          <button
            type="button"
            onClick={() => setShowEnvelope(!showEnvelope)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
              background: "transparent",
              border: "none",
              padding: "0.5rem 0",
              cursor: "pointer",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ transition: "transform 0.2s" }}>
              {showEnvelope ? "▼" : "▶"}
            </span>
            <span>Envelope hiện tại {showEnvelope ? "(ẩn)" : "(xem)"}</span>
          </button>

          {showEnvelope && (
            <pre
              style={{
                background: "#ffffff",
                color: "#1f2937",
                padding: "1rem",
                borderRadius: "8px",
                fontSize: "0.8rem",
                overflow: "auto",
                maxHeight: "300px",
                fontFamily: '"Fira Code", "Courier New", monospace',
                margin: 0,
                lineHeight: "1.6",
                border: "2px solid #e5e7eb",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              {JSON.stringify(envelope, null, 2)}
            </pre>
          )}
        </div>
      )}

      {/* Import section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div
          style={{
            fontSize: "0.875rem",
            fontWeight: "500",
            color: "#374151",
          }}
        >
          Import JSON:
        </div>
        <textarea
          className="qlbt-textarea"
          style={{
            fontFamily: '"Courier New", monospace',
            fontSize: "0.8rem",
            minHeight: "120px",
          }}
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder='{"kind": "mcq_single", "prompt": "...", ...}'
        />
        {error && <div className="qlbt-error">{error}</div>}
        <button
          className="qlbt-btn qlbt-btn-primary"
          style={{ alignSelf: "flex-start" }}
          onClick={handleImport}
        >
          📥 Import JSON
        </button>
      </div>
    </div>
  );
}
