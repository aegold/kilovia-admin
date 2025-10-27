import React, { useEffect, useMemo, useState } from "react";
import { KINDS } from "@shared/constants/kinds";
import { makeQuestionEnvelope } from "@shared/utils/envelop";
import "../styles/QLBT_EditorTheme.css";

export default function VerticalCalculationEditor({
  onEnvelopeChange,
  onSave,
  hierarchy,
  isSaving = false,
  initialEnvelope = null,
}) {
  const [operationType, setOperationType] = useState("addition"); // addition | subtraction | mixed
  const [numberOfTerms, setNumberOfTerms] = useState(2);
  const [term1, setTerm1] = useState("");
  const [term2, setTerm2] = useState("");
  const [term3, setTerm3] = useState("");
  const [operation2, setOperation2] = useState("+");
  const [operation3, setOperation3] = useState("+");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial data from initialEnvelope in edit mode
  useEffect(() => {
    if (initialEnvelope && !isInitialized) {
      console.log(
        "📥 VerticalCalculationEditor: Loading initial envelope",
        initialEnvelope
      );

      if (initialEnvelope.detail?.operationType) {
        setOperationType(initialEnvelope.detail.operationType);
      }

      if (initialEnvelope.detail?.numberOfTerms) {
        setNumberOfTerms(initialEnvelope.detail.numberOfTerms);
      }

      if (
        initialEnvelope.detail?.terms &&
        Array.isArray(initialEnvelope.detail.terms)
      ) {
        const terms = initialEnvelope.detail.terms;
        if (terms[0]) setTerm1(terms[0].toString());
        if (terms[1]) setTerm2(terms[1].toString());
        if (terms[2]) setTerm3(terms[2].toString());
      }

      if (
        initialEnvelope.detail?.operations &&
        Array.isArray(initialEnvelope.detail.operations)
      ) {
        const ops = initialEnvelope.detail.operations;
        if (ops[0]) setOperation2(ops[0]);
        if (ops[1]) setOperation3(ops[1]);
      }

      if (initialEnvelope.detail?.answer !== undefined) {
        setAnswer(initialEnvelope.detail.answer.toString());
      }

      setIsInitialized(true);
    }
  }, [initialEnvelope, isInitialized]);

  const calculated = useMemo(() => {
    const a = parseFloat(term1);
    const b = parseFloat(term2);
    const c = term3 ? parseFloat(term3) : null;
    if (
      isNaN(a) ||
      isNaN(b) ||
      (numberOfTerms === 3 && (c == null || isNaN(c)))
    )
      return null;
    if (operationType === "mixed") {
      let res = a;
      res = operation2 === "+" ? res + b : res - b;
      if (numberOfTerms === 3) res = operation3 === "+" ? res + c : res - c;
      return res;
    }
    if (operationType === "addition")
      return a + b + (numberOfTerms === 3 ? c || 0 : 0);
    return a - b - (numberOfTerms === 3 ? c || 0 : 0);
  }, [
    term1,
    term2,
    term3,
    numberOfTerms,
    operationType,
    operation2,
    operation3,
  ]);

  // Tự động điền đáp án khi có đủ dữ liệu
  useEffect(() => {
    if (term1 && term2 && calculated !== null) {
      setAnswer(String(calculated));
    }
  }, [term1, term2, term3, calculated]);

  const buildEnvelope = () => {
    if (!term1 || !term2) throw new Error("Nhập đủ 2 số");
    if (numberOfTerms === 3 && !term3) throw new Error("Nhập số hạng thứ 3");
    const rows = [
      String(term1),
      String(term2),
      ...(numberOfTerms === 3 ? [String(term3)] : []),
    ];
    const layout =
      operationType === "mixed"
        ? {
            rows,
            operators: [
              operation2,
              ...(numberOfTerms === 3 ? [operation3] : []),
            ],
            mode: operationType,
          }
        : {
            rows,
            operator: operationType === "addition" ? "+" : "-",
            mode: operationType,
          };
    const result = String(answer || calculated || "");
    const detail = { layout, result };
    const prompt = "Thực hiện phép tính theo cột";
    return makeQuestionEnvelope({
      kind: KINDS.VERTICAL_CALCULATION,
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
  }, [
    operationType,
    numberOfTerms,
    term1,
    term2,
    term3,
    operation2,
    operation3,
    answer,
  ]);

  return (
    <div className="qlbt-card space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 items-end">
        <select
          className="border rounded px-2 py-1"
          value={operationType}
          onChange={(e) => setOperationType(e.target.value)}
        >
          <option value="addition">Cộng (+)</option>
          <option value="subtraction">Trừ (-)</option>
          <option value="mixed">Cộng trừ đan xen</option>
        </select>
        <select
          className="border rounded px-2 py-1"
          value={numberOfTerms}
          onChange={(e) => setNumberOfTerms(parseInt(e.target.value))}
        >
          <option value={2}>2 số hạng</option>
          <option value={3}>3 số hạng</option>
        </select>
        {operationType === "mixed" && (
          <select
            className="border rounded px-2 py-1"
            value={operation2}
            onChange={(e) => setOperation2(e.target.value)}
          >
            <option value="+">Dấu cho số hạng 2: +</option>
            <option value="-">Dấu cho số hạng 2: -</option>
          </select>
        )}
        {operationType === "mixed" && numberOfTerms === 3 && (
          <select
            className="border rounded px-2 py-1"
            value={operation3}
            onChange={(e) => setOperation3(e.target.value)}
          >
            <option value="+">Dấu cho số hạng 3: +</option>
            <option value="-">Dấu cho số hạng 3: -</option>
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
        <input
          className="qlbt-input"
          placeholder="Số hạng 1"
          value={term1}
          onChange={(e) => setTerm1(e.target.value)}
        />
        <input
          className="qlbt-input"
          placeholder="Số hạng 2"
          value={term2}
          onChange={(e) => setTerm2(e.target.value)}
        />
        {numberOfTerms === 3 && (
          <input
            className="qlbt-input"
            placeholder="Số hạng 3"
            value={term3}
            onChange={(e) => setTerm3(e.target.value)}
          />
        )}
      </div>
      <div>
        <label className="qlbt-label">Đáp án</label>
        <input
          className="qlbt-input"
          placeholder="Kết quả"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </div>
  );
}
