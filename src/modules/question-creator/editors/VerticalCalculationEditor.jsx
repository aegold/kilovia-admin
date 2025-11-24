import React, { useEffect, useMemo, useState } from "react";
import { KINDS } from "@shared/constants/kinds";
import { makeQuestionEnvelope } from "@shared/utils/envelop";
import {
  validateEnvelope,
  formatValidationErrors,
} from "@shared/validators/envelopeValidators";
import "../styles/QLBT_EditorTheme.css";

export default function VerticalCalculationEditor({
  onEnvelopeChange,
  onSave,
  hierarchy,
  isSaving = false,
  initialEnvelope = null,
}) {
  const [questionTitle, setQuestionTitle] = useState("Thực hiện bài toán sau:");
  const [operationType, setOperationType] = useState("addition"); // addition | subtraction | mixed
  const [numberOfTerms, setNumberOfTerms] = useState(2);
  const [term1, setTerm1] = useState("");
  const [term2, setTerm2] = useState("");
  const [term3, setTerm3] = useState("");
  const [operation2, setOperation2] = useState("+");
  const [operation3, setOperation3] = useState("+");
  const [answer, setAnswer] = useState("");
  const [hint, setHint] = useState("");
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial data from initialEnvelope in edit mode
  useEffect(() => {
    if (initialEnvelope && !isInitialized) {
      console.log(
        "📥 VerticalCalculationEditor: Loading initial envelope",
        initialEnvelope
      );

      if (initialEnvelope.questionTitle) {
        setQuestionTitle(initialEnvelope.questionTitle);
      }

      if (initialEnvelope.detail?.layout) {
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

      if (initialEnvelope.explanation) {
        setHint(initialEnvelope.explanation);
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
    // Validate that we have enough terms
    if (!term1 || !term2) {
      throw new Error("Vui lòng nhập đầy đủ số hạng");
    }
    if (numberOfTerms === 3 && !term3) {
      throw new Error("Vui lòng nhập đầy đủ 3 số hạng");
    }

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
    const envelope = makeQuestionEnvelope({
      kind: KINDS.VERTICAL_CALCULATION,
      prompt,
      detail,
      extras: { explanation: hint || "", questionTitle },
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
  }, [
    questionTitle,
    operationType,
    numberOfTerms,
    term1,
    term2,
    term3,
    operation2,
    operation3,
    answer,
    hint,
  ]);

  return (
    <div className="qlbt-card">
      <div className="qlbt-form-group">
        <label className="qlbt-label">
          Tiêu đề câu hỏi <span className="qlbt-required">*</span>
        </label>
        <input
          className="qlbt-input"
          value={questionTitle}
          onChange={(e) => setQuestionTitle(e.target.value)}
          placeholder="Nhập tiêu đề câu hỏi..."
        />
      </div>

      <div className="qlbt-form-group">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "8px",
            alignItems: "end",
          }}
        >
          <select
            className="qlbt-select"
            value={operationType}
            onChange={(e) => setOperationType(e.target.value)}
          >
            <option value="addition">Cộng (+)</option>
            <option value="subtraction">Trừ (-)</option>
            <option value="mixed">Cộng trừ đan xen</option>
          </select>
          <select
            className="qlbt-select"
            value={numberOfTerms}
            onChange={(e) => setNumberOfTerms(parseInt(e.target.value))}
          >
            <option value={2}>2 số hạng</option>
            <option value={3}>3 số hạng</option>
          </select>
          {operationType === "mixed" && (
            <select
              className="qlbt-select"
              value={operation2}
              onChange={(e) => setOperation2(e.target.value)}
            >
              <option value="+">Dấu cho số hạng 2: +</option>
              <option value="-">Dấu cho số hạng 2: -</option>
            </select>
          )}
          {operationType === "mixed" && numberOfTerms === 3 && (
            <select
              className="qlbt-select"
              value={operation3}
              onChange={(e) => setOperation3(e.target.value)}
            >
              <option value="+">Dấu cho số hạng 3: +</option>
              <option value="-">Dấu cho số hạng 3: -</option>
            </select>
          )}
        </div>
      </div>

      <div className="qlbt-form-group">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "8px",
            alignItems: "end",
          }}
        >
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
      </div>

      <div className="qlbt-form-group">
        <label className="qlbt-label">Đáp án</label>
        <input
          className="qlbt-input"
          placeholder="Kết quả"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      </div>

      <div className="qlbt-form-group">
        <label className="qlbt-label">Giải thích (tùy chọn)</label>
        <textarea
          className="qlbt-textarea"
          style={{ height: "80px" }}
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          placeholder="Giải thích chi tiết đáp án..."
        />
      </div>

      {error && <div className="qlbt-error-text">{error}</div>}
    </div>
  );
}
