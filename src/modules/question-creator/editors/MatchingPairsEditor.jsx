import React, { useEffect, useState } from "react";
import { KINDS } from "@shared/constants/kinds";
import { makeQuestionEnvelope } from "@shared/utils/envelop";
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
    // Basic validation
    if (!columns.length || !pairs.length) {
      throw new Error("Columns and pairs are required");
    }
    const detail = {
      columns,
      pairs,
      allowPartialCredit,
    };
    return makeQuestionEnvelope({
      kind: KINDS.MATCHING_PAIRS,
      prompt,
      detail,
    });
  };

  useEffect(() => {
    try {
      setError("");
      const env = buildEnvelope();
      onEnvelopeChange && onEnvelopeChange(env);
    } catch (e) {
      onEnvelopeChange && onEnvelopeChange(null);
      // Chỉ hiển thị message lỗi cần thiết
      if (e.issues && e.issues.length > 0) {
        setError(e.issues[0].message);
      } else {
        setError(e.message || "Dữ liệu không hợp lệ");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, columns, pairs, allowPartialCredit]);

  return (
    <div className="qlbt-card space-y-3">
      <div className="qlbt-field">
        <label className="qlbt-label">Đề bài</label>
        <textarea
          className="qlbt-textarea h-20"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Nhập đề bài..."
        />
      </div>

      <div className="qlbt-section-title">Các cột</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {columns.map((col, colIndex) => (
          <div key={colIndex} className="border rounded p-3 space-y-2">
            <div className="qlbt-label">Cột {colIndex + 1}</div>
            <input
              className="qlbt-input"
              value={col.label}
              onChange={(e) => setColumn(colIndex, { label: e.target.value })}
              placeholder="Tiêu đề cột"
            />
            <div className="space-y-1">
              {col.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex gap-2 items-center">
                  <input
                    className="qlbt-input flex-1"
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
                    className="px-2 py-1 border rounded text-sm"
                    onClick={() => removeColumnItem(colIndex, itemIndex)}
                  >
                    Xóa
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="px-2 py-1 border rounded text-sm"
                onClick={() => addColumnItem(colIndex)}
              >
                + Thêm item
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="qlbt-section-title">Các cặp đúng</div>
      <div className="space-y-2">
        {pairs.map((pair, pairIndex) => (
          <div key={pairIndex} className="flex gap-2 items-center">
            <select
              className="qlbt-select"
              value={pair.left}
              onChange={(e) => setPair(pairIndex, { left: e.target.value })}
            >
              <option value="">Chọn từ cột 1</option>
              {columns[0]?.items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.text}
                </option>
              ))}
            </select>
            <span>↔</span>
            <select
              className="qlbt-select"
              value={pair.right}
              onChange={(e) => setPair(pairIndex, { right: e.target.value })}
            >
              <option value="">Chọn từ cột 2</option>
              {columns[1]?.items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.text}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="px-2 py-1 border rounded text-sm"
              onClick={() => removePair(pairIndex)}
            >
              Xóa
            </button>
          </div>
        ))}
        <button
          type="button"
          className="px-2 py-1 border rounded"
          onClick={addPair}
        >
          + Thêm cặp
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={allowPartialCredit}
          onChange={(e) => setAllowPartialCredit(e.target.checked)}
        />
        Cho phép tính điểm từng phần
      </label>

      {error && <div className="text-red-600 text-sm">{error}</div>}
    </div>
  );
}
