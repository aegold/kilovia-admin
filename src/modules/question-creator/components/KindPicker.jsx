import React, { useMemo, useState } from "react";
import { KINDS } from "@shared/constants/kinds";
import "../styles/KindPicker.css";

export default function KindPicker({ value, onChange }) {
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    // List of available question kinds
    const iconOf = (kind) => {
      switch (kind) {
        case "mcq_single":
          return "☑️";
        case "fib_single":
          return "📝";
        case "image_choice":
          return "🖼️";
        case "multiple_fill_in":
          return "🔡";
        case "vertical_calculation":
          return "🧮";
        case "expression":
          return "∑";
        case "matching_pairs":
          return "🔗";
        default:
          return "❓";
      }
    };
    const nameOf = (kind) => {
      switch (kind) {
        case "mcq_single":
          return "Trắc nghiệm 1 đáp án";
        case "fib_single":
          return "Điền 1 ô trống";
        case "image_choice":
          return "Trắc nghiệm hình ảnh";
        case "multiple_fill_in":
          return "Điền nhiều ô trống";
        case "vertical_calculation":
          return "Phép tính theo cột";
        case "expression":
          return "Biểu thức toán";
        case "matching_pairs":
          return "Ghép cặp đáp án";
        default:
          return kind;
      }
    };
    const descOf = (kind) => {
      switch (kind) {
        case "mcq_single":
          return "Câu hỏi với nhiều lựa chọn, chọn 1 đáp án đúng";
        case "fib_single":
          return "Câu hỏi yêu cầu điền đáp án vào ô trống";
        case "image_choice":
          return "Câu hỏi với các lựa chọn là hình ảnh";
        case "multiple_fill_in":
          return "Câu hỏi có nhiều ô trống cần điền";
        case "vertical_calculation":
          return "Phép tính cộng/trừ theo chiều dọc";
        case "expression":
          return "Biểu thức với các phép tính (+, -, ×, ÷)";
        case "matching_pairs":
          return "Ghép các item từ 2 cột với nhau";
        default:
          return "";
      }
    };
    // All available kinds from KINDS constant
    const allKinds = Object.values(KINDS);
    return allKinds.map((kind) => ({
      value: kind,
      label: nameOf(kind),
      icon: iconOf(kind),
      description: descOf(kind),
      tags: [kind],
    }));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(q) ||
        it.value.toLowerCase().includes(q) ||
        (it.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }, [items, query]);

  return (
    <div className="kp-container">
      <div className="kp-search">
        <input
          className="kp-search-input"
          placeholder="Tìm dạng câu hỏi..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="kp-grid">
        {filtered.map((k) => (
          <button
            key={k.value}
            type="button"
            className={`kp-card ${value === k.value ? "kp-card--active" : ""}`}
            onClick={() => onChange && onChange(k.value)}
          >
            <div className="kp-card-head">
              <div className="kp-card-icon">{k.icon}</div>
              <div className="kp-card-title">{k.label}</div>
            </div>
            {k.description && (
              <div className="kp-card-desc">{k.description}</div>
            )}
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="kp-empty col-span-2">Không tìm thấy dạng phù hợp</div>
        )}
      </div>
    </div>
  );
}
