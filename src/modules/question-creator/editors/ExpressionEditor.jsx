import React, { useEffect, useMemo, useState } from "react";
import { KINDS } from "@shared/constants/kinds";
import { makeQuestionEnvelope } from "@shared/utils/envelop";
import "../styles/QLBT_EditorTheme.css";

export default function ExpressionEditor({
  onEnvelopeChange,
  onSave,
  hierarchy,
  isSaving = false,
  initialEnvelope = null,
}) {
  const [operation, setOperation] = useState("multiplication");
  const [operand1, setOperand1] = useState("");
  const [operand2, setOperand2] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("blank_result");
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial data from initialEnvelope in edit mode
  useEffect(() => {
    if (initialEnvelope && !isInitialized) {
      console.log(
        "📥 ExpressionEditor: Loading initial envelope",
        initialEnvelope
      );

      if (initialEnvelope.detail?.operation) {
        setOperation(initialEnvelope.detail.operation);
      }

      if (initialEnvelope.detail?.operand1 !== undefined) {
        setOperand1(initialEnvelope.detail.operand1.toString());
      }

      if (initialEnvelope.detail?.operand2 !== undefined) {
        setOperand2(initialEnvelope.detail.operand2.toString());
      }

      if (initialEnvelope.detail?.result !== undefined) {
        setResult(initialEnvelope.detail.result.toString());
      }

      if (initialEnvelope.detail?.mode) {
        setMode(initialEnvelope.detail.mode);
      }

      setIsInitialized(true);
    }
  }, [initialEnvelope, isInitialized]);

  const symbol = useMemo(() => {
    return operation === "addition"
      ? "+"
      : operation === "subtraction"
      ? "-"
      : operation === "division"
      ? "÷"
      : "×";
  }, [operation]);

  const calculated = useMemo(() => {
    const a = parseFloat(operand1);
    const b = parseFloat(operand2);
    if (isNaN(a) || isNaN(b)) return null;
    switch (operation) {
      case "addition":
        return a + b;
      case "subtraction":
        return a - b;
      case "division":
        return b !== 0 ? a / b : 0;
      default:
        return a * b;
    }
  }, [operation, operand1, operand2]);

  useEffect(() => {
    if (mode === "blank_result" && calculated != null)
      setResult(String(calculated));
  }, [calculated, mode]);

  const buildEnvelope = () => {
    const detail = { operation, operand1, operand2, result, mode };
    const prompt = "Điền số thích hợp vào ô trống:";
    return makeQuestionEnvelope({ kind: KINDS.EXPRESSION, prompt, detail });
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
  }, [operation, operand1, operand2, result, mode]);

  return (
    <div className="qlbt-card space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-end">
        <select
          className="qlbt-select"
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
        >
          <option value="addition">Phép cộng (+)</option>
          <option value="subtraction">Phép trừ (-)</option>
          <option value="multiplication">Phép nhân (×)</option>
          <option value="division">Phép chia (÷)</option>
        </select>
        <select
          className="qlbt-select w-full"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="blank_result">Tìm kết quả (a {symbol} b = ?)</option>
          <option value="blank_operand1">
            Tìm số hạng 1 (? {symbol} b = c)
          </option>
          <option value="blank_operand2">
            Tìm số hạng 2 (a {symbol} ? = c)
          </option>
          <option value="blank_both_operands">
            Tìm 2 số hạng (? {symbol} ? = c)
          </option>
          <option value="blank_all">Tìm cả 3 (? {symbol} ? = ?)</option>
        </select>
      </div>
      <div className="grid grid-cols-3 gap-2 items-end">
        <input
          className="qlbt-input"
          placeholder="Số hạng 1"
          value={operand1}
          onChange={(e) => setOperand1(e.target.value)}
        />
        <div className="text-center">{symbol}</div>
        <input
          className="qlbt-input"
          placeholder="Số hạng 2"
          value={operand2}
          onChange={(e) => setOperand2(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-3 gap-2 items-end">
        <div className="text-center">=</div>
        <input
          className="qlbt-input col-span-2"
          placeholder="Kết quả"
          value={result}
          onChange={(e) => setResult(e.target.value)}
        />
      </div>

      {/* Hint for multiple blanks */}
      {(mode === "blank_both_operands" || mode === "blank_all") && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-sm text-yellow-800 flex items-center gap-2">
            <span>💡</span>
            <span className="font-medium">Gợi ý:</span>
            <span>
              Nên thêm hình ảnh đi kèm để gợi ý cho học sinh tìm số hạng
            </span>
          </div>
        </div>
      )}

      {error && <div className="text-red-600 text-sm">{error}</div>}
    </div>
  );
}
