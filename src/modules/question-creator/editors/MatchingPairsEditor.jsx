import React, { useEffect, useState } from "react";
import { KINDS } from "@shared/constants/kinds";
import { makeQuestionEnvelope } from "@shared/utils/envelop";
import {
  validateEnvelope,
  formatValidationErrors,
} from "@shared/validators/envelopeValidators";
import "../styles/QLBT_EditorTheme.css";

export default function MatchingPairsEditor({
  onEnvelopeChange,
  onSave,
  hierarchy,
  isSaving = false,
  initialEnvelope = null,
}) {
  const [prompt, setPrompt] = useState("");
  const [columns, setColumns] = useState([
    {
      id: "colA",
      label: "Cột A",
      items: [
        { id: "item1", text: "" },
        { id: "item2", text: "" },
      ],
    },
    {
      id: "colB",
      label: "Cột B",
      items: [
        { id: "item3", text: "" },
        { id: "item4", text: "" },
      ],
    },
  ]);
  const [pairs, setPairs] = useState([]);
  const [allowPartialCredit, setAllowPartialCredit] = useState(false);
  const [hint, setHint] = useState("");
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial data from initialEnvelope in edit mode
  useEffect(() => {
    if (initialEnvelope && !isInitialized) {
      console.log(
        "📥 MatchingPairsEditor: Loading initial envelope",
        initialEnvelope
      );

      if (initialEnvelope.prompt) {
        setPrompt(initialEnvelope.prompt);
      }

      if (
        initialEnvelope.detail?.columns &&
        Array.isArray(initialEnvelope.detail.columns)
      ) {
        setColumns(initialEnvelope.detail.columns);
      }

      if (
        initialEnvelope.detail?.pairs &&
        Array.isArray(initialEnvelope.detail.pairs)
      ) {
        setPairs(initialEnvelope.detail.pairs);
      }

      if (initialEnvelope.detail?.allowPartialCredit !== undefined) {
        setAllowPartialCredit(initialEnvelope.detail.allowPartialCredit);
      }

      if (initialEnvelope.explanation) {
        setHint(initialEnvelope.explanation);
      }

      setIsInitialized(true);
    }
  }, [initialEnvelope, isInitialized]);

  const setColumn = (colIndex, patch) => {
    const next = [...columns];
    next[colIndex] = { ...next[colIndex], ...patch };
    setColumns(next);
  };

  const setColumnItem = (colIndex, itemIndex, patch) => {
    const next = [...columns];
    const nextItems = [...next[colIndex].items];
    nextItems[itemIndex] = { ...nextItems[itemIndex], ...patch };
    next[colIndex] = { ...next[colIndex], items: nextItems };
    setColumns(next);
  };

  const addColumnItem = (colIndex) => {
    const next = [...columns];
    const nextItems = [...next[colIndex].items];
    nextItems.push({ id: `item_${Date.now()}`, text: "" });
    next[colIndex] = { ...next[colIndex], items: nextItems };
    setColumns(next);
  };

  const removeColumnItem = (colIndex, itemIndex) => {
    const next = [...columns];
    const nextItems = next[colIndex].items.filter((_, i) => i !== itemIndex);
    next[colIndex] = { ...next[colIndex], items: nextItems };
    setColumns(next);
  };

  const addPair = () => {
    setPairs([...pairs, { left: "", right: "" }]);
  };

  const setPair = (pairIndex, patch) => {
    const next = [...pairs];
    next[pairIndex] = { ...next[pairIndex], ...patch };
    setPairs(next);
  };

  const removePair = (pairIndex) => {
    setPairs(pairs.filter((_, i) => i !== pairIndex));
  };

  const buildEnvelope = () => {
    const detail = {
      columns,
      pairs,
      allowPartialCredit,
    };
    const extras = {
      explanation: hint || "",
    };
    const envelope = makeQuestionEnvelope({
      kind: KINDS.MATCHING_PAIRS,
      prompt,
      detail,
      extras,
    });

    // Centralized validation
    const validation = validateEnvelope(envelope);
    if (!validation.valid) {
      throw new Error(formatValidationErrors(validation.errors));
    }

    return envelope;
  };

  useEffect(() => {
    try {
      setError("");
      const env = buildEnvelope();
      onEnvelopeChange && onEnvelopeChange(env);
    } catch (e) {
      onEnvelopeChange && onEnvelopeChange(null);
      setError(e.message || "Dữ liệu không hợp lệ");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, columns, pairs, allowPartialCredit, hint]);

  return (
    <div className="qlbt-card">
      <div className="qlbt-form-group">
        <label className="qlbt-label">Đề bài</label>
        <textarea
          className="qlbt-textarea"
          style={{ height: "80px" }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Nhập đề bài..."
        />
      </div>

      <div className="qlbt-form-group">
        <div className="qlbt-section-title">Các cột</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {columns.map((col, colIndex) => (
            <div
              key={colIndex}
              style={{
                padding: "16px",
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            >
              {/* Column Header */}
              <div style={{ marginBottom: "12px" }}>
                <label className="qlbt-label" style={{ marginBottom: "6px" }}>
                  {colIndex === 0 ? "Cột 1" : "Cột 2"}
                </label>
                <input
                  className="qlbt-input"
                  value={col.label}
                  onChange={(e) =>
                    setColumn(colIndex, { label: e.target.value })
                  }
                  placeholder="Tiêu đề cột"
                />
              </div>

              {/* Column Items */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {col.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: colIndex === 0 ? "#dbeafe" : "#f3e8ff",
                        color: colIndex === 0 ? "#1d4ed8" : "#7c3aed",
                        borderRadius: "50%",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        flexShrink: 0,
                      }}
                    >
                      {colIndex === 0
                        ? itemIndex + 1
                        : String.fromCharCode(65 + itemIndex)}
                    </div>
                    <input
                      className="qlbt-input"
                      style={{ flex: 1 }}
                      value={item.text}
                      onChange={(e) =>
                        setColumnItem(colIndex, itemIndex, {
                          text: e.target.value,
                        })
                      }
                      placeholder={`Item ${itemIndex + 1}`}
                    />
                    <button
                      type="button"
                      className="qlbt-btn-remove"
                      onClick={() => removeColumnItem(colIndex, itemIndex)}
                      disabled={col.items.length <= 2}
                      style={{
                        opacity: col.items.length <= 2 ? 0.5 : 1,
                        cursor:
                          col.items.length <= 2 ? "not-allowed" : "pointer",
                        minWidth: "60px",
                        padding: "6px 12px",
                        fontSize: "0.875rem",
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="qlbt-btn-add"
                  onClick={() => addColumnItem(colIndex)}
                  style={{ marginTop: "4px" }}
                >
                  + Thêm item
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="qlbt-form-group">
        <div className="qlbt-section-title">Các cặp đúng</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {pairs.map((pair, pairIndex) => (
            <div
              key={pairIndex}
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                padding: "12px",
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#22c55e",
                  color: "white",
                  borderRadius: "50%",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  flexShrink: 0,
                }}
              >
                {pairIndex + 1}
              </div>
              <select
                className="qlbt-select"
                style={{ flex: 1 }}
                value={pair.left}
                onChange={(e) => setPair(pairIndex, { left: e.target.value })}
              >
                <option value="">-- Chọn từ cột 1 --</option>
                {columns[0]?.items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.text || "(chưa nhập)"}
                  </option>
                ))}
              </select>
              <span
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  color: "#22c55e",
                  flexShrink: 0,
                }}
              >
                ↔
              </span>
              <select
                className="qlbt-select"
                style={{ flex: 1 }}
                value={pair.right}
                onChange={(e) => setPair(pairIndex, { right: e.target.value })}
              >
                <option value="">-- Chọn từ cột 2 --</option>
                {columns[1]?.items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.text || "(chưa nhập)"}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="qlbt-btn-remove"
                onClick={() => removePair(pairIndex)}
                style={{
                  flexShrink: 0,
                  minWidth: "60px",
                  padding: "6px 12px",
                  fontSize: "0.875rem",
                }}
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="qlbt-btn-add"
          onClick={addPair}
          style={{ marginTop: "8px" }}
        >
          + Thêm cặp
        </button>
      </div>

      <div className="qlbt-form-group">
        <label className="qlbt-label">Giải thích (tùy chọn)</label>
        <textarea
          className="qlbt-textarea"
          style={{ height: "60px" }}
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          placeholder="Nhập giải thích cho câu hỏi..."
        />
      </div>

      {error && <div className="qlbt-error-text">{error}</div>}
    </div>
  );
}
