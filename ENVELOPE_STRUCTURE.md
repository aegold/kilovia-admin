# 📦 Cấu Trúc Envelope Câu Hỏi

## 📋 Cấu Trúc Cơ Bản

```json
{
  "version": 1,
  "kind": "fib_single",
  "prompt": "Thủ đô của Việt Nam là [____]",
  "media": [],
  "detail": {...},
  "scoring": { "full_points": 1, "partial_points": 0, "penalty": 0 },
  "meta": { "difficulty": "easy", "tags": [], "hierarchy": {...} },
  "explanation": "..."  // Tùy chọn - Có thể dùng cho tất cả 7 loại câu hỏi
}
```

---

## 🔑 Các Trường Cốt Lõi

### `version` (Number)

Giá trị: `1` - Dùng cho tất cả các loại

### `kind` (String)

Định danh loại câu hỏi:

| kind                   | Tên                    |
| ---------------------- | ---------------------- |
| `mcq_single`           | Trắc nghiệm đơn        |
| `fib_single`           | Điền vào chỗ trống đơn |
| `image_choice`         | Chọn hình ảnh          |
| `multiple_fill_in`     | Nhiều chỗ trống        |
| `vertical_calculation` | Phép tính dọc          |
| `expression`           | Biểu thức toán học     |
| `matching_pairs`       | Nối cặp                |

### `prompt` (String)

Nội dung đề bài. Ví dụ: `"Thủ đô của Việt Nam là [____]"`

### `media` (Array)

Hình ảnh đính kèm câu hỏi. Có thể rỗng `[]`.

**Được dùng bởi**: `mcq_single`, `fib_single`, `multiple_fill_in`

```json
"media": [{ "type": "image", "url": "https://...", "alt": "..." }]
```

### `detail` (Object)

Dữ liệu đặc thù của từng loại câu hỏi. Cấu trúc khác nhau tùy theo `kind` (xem bên dưới).

### `scoring` (Object)

```json
"scoring": { "full_points": 1, "partial_points": 0, "penalty": 0 }
```

### `meta` (Object)

```json
"meta": {
  "difficulty": "easy",
  "tags": [],
  "hierarchy": {
    "gradeId": 3, "gradeName": "Lớp 3",
    "subjectId": 5, "subjectName": "Toán Lớp 3",
    "topicId": 12, "topicTitle": "...",
    "subtopicId": 45, "subtopicTitle": "..."
  }
}
```

### `explanation` (String) - TÙY CHỌN

**Giải thích chi tiết đáp án** - hiển thị sau khi học sinh nộp bài.

**⚠️ LƯU Ý:**

- Trường này là **TÙY CHỌN** - có thể không tồn tại trong envelope
- **Có thể dùng cho tất cả 7 loại câu hỏi**: `mcq_single`, `fib_single`, `image_choice`, `multiple_fill_in`, `vertical_calculation`, `expression`, `matching_pairs`
- Kiểu dữ liệu là **string**, không phải array
- Nếu không có giải thích, field này không xuất hiện trong JSON (không để `null` hay `""`)

**Ví dụ:**

```json
"explanation": "Kết quả đúng là 27 vì 12 + 15 = 27"
```

---

## 📊 Cấu Trúc detail Theo Từng Loại

### 1️⃣ `fib_single`

```json
"detail": {
  "answer": "Hà Nội",
  "case_sensitive": false,
  "normalize_space": true
}
```

### 2️⃣ `mcq_single`

```json
"detail": {
  "options": [
    { "id": "A", "text": "Hà Nội", "correct": true },
    { "id": "B", "text": "TP.HCM", "correct": false }
  ],
  "shuffle": true
}
```

### 3️⃣ `image_choice`

```json
"detail": {
  "options": [
    {
      "id": "A",
      "image": { "url": "https://example.com/dog.jpg", "alt": "Con chó" },
      "correct": true
    },
    {
      "id": "B",
      "image": { "url": "https://example.com/cat.jpg", "alt": "Con mèo" },
      "correct": false
    }
  ],
  "shuffle": true
}
```

### 4️⃣ `multiple_fill_in`

```json
"detail": {
  "blocks": [
    { "type": "text", "content": "Tính:", "down_line": true },
    {
      "type": "fill-in-group",
      "id": "blanks_group",
      "items": [
        {
          "type": "fill-in-text",
          "before": "12 + 15 =",
          "input": { "id": "blank1", "type": "text", "width": "80px" },
          "after": "",
          "newLine": false
        }
      ]
    }
  ],
  "answers": [
    { "id": "blank1", "evaluate": true, "expression": "27" }
  ]
}
```

### 5️⃣ `vertical_calculation`

**Toán tử đơn:**

```json
"detail": {
  "layout": { "rows": ["123", "456"], "operator": "+", "mode": "addition" },
  "result": "579"
}
```

**Toán tử hỗn hợp:**

```json
"detail": {
  "layout": { "rows": ["100", "25", "10"], "operators": ["+", "-"], "mode": "mixed" },
  "result": "65"
}
```

### 6️⃣ `expression`

```json
"detail": {
  "operation": "multiplication",
  "operand1": "12",
  "operand2": "5",
  "result": "60",
  "mode": "blank_result"
}
```

**Các chế độ**: `blank_result`, `blank_operand1`, `blank_operand2`, `blank_both_operands`, `blank_all`

### 7️⃣ `matching_pairs`

```json
"detail": {
  "columns": [
    {
      "id": "colA",
      "label": "Cột A",
      "items": [
        { "id": "item1", "text": "Chó" },
        { "id": "item2", "text": "Mèo" }
      ]
    },
    {
      "id": "colB",
      "label": "Cột B",
      "items": [
        { "id": "item3", "text": "Gâu gâu" },
        { "id": "item4", "text": "Meo meo" }
      ]
    }
  ],
  "pairs": [
    { "left": "item1", "right": "item3" },
    { "left": "item2", "right": "item4" }
  ],
  "allowPartialCredit": false
}
```

---

## 📝 Ví Dụ Đầy Đủ

### Ví Dụ FIB_SINGLE

```json
{
  "version": 1,
  "kind": "fib_single",
  "prompt": "Thủ đô của Việt Nam là [____]",
  "media": [
    { "type": "image", "url": "https://example.com/hanoi.jpg", "alt": "Hà Nội" }
  ],
  "detail": {
    "answer": "Hà Nội",
    "case_sensitive": false,
    "normalize_space": true
  },
  "scoring": { "full_points": 1, "partial_points": 0, "penalty": 0 },
  "meta": {
    "difficulty": "easy",
    "tags": [],
    "hierarchy": {
      "gradeId": 3,
      "gradeName": "Lớp 3",
      "subjectId": 6,
      "subjectName": "Địa lý Lớp 3",
      "topicId": 15,
      "topicTitle": "Địa lý Việt Nam",
      "subtopicId": 48,
      "subtopicTitle": "Thủ đô và các thành phố"
    }
  }
}
```

### Ví Dụ MCQ_SINGLE

```json
{
  "version": 1,
  "kind": "mcq_single",
  "prompt": "12 + 15 = ?",
  "media": [],
  "detail": {
    "options": [
      { "id": "A", "text": "25", "correct": false },
      { "id": "B", "text": "27", "correct": true },
      { "id": "C", "text": "28", "correct": false }
    ],
    "shuffle": true
  },
  "scoring": { "full_points": 1, "partial_points": 0, "penalty": 0 },
  "meta": {
    "difficulty": "easy",
    "tags": [],
    "hierarchy": {
      "gradeId": 1,
      "gradeName": "Lớp 1",
      "subjectId": 1,
      "subjectName": "Toán Lớp 1",
      "topicId": 2,
      "topicTitle": "Phép cộng",
      "subtopicId": 8,
      "subtopicTitle": "Cộng trong phạm vi 100"
    }
  }
}
```

### Ví Dụ MULTIPLE_FILL_IN

```json
{
  "version": 1,
  "kind": "multiple_fill_in",
  "prompt": "Tính kết quả:",
  "media": [],
  "detail": {
    "blocks": [
      { "type": "text", "content": "Điền đáp án:", "down_line": true },
      {
        "type": "fill-in-group",
        "id": "blanks_group",
        "items": [
          {
            "type": "fill-in-text",
            "before": "5 + 3 =",
            "input": { "id": "blank1", "type": "text", "width": "80px" },
            "after": "",
            "newLine": false
          }
        ]
      }
    ],
    "answers": [{ "id": "blank1", "evaluate": true, "expression": "8" }]
  },
  "explanation": "Phép cộng: 5 + 3 = 8",
  "scoring": { "full_points": 1, "partial_points": 0, "penalty": 0 },
  "meta": {
    "difficulty": "easy",
    "tags": [],
    "hierarchy": {
      "gradeId": 1,
      "gradeName": "Lớp 1",
      "subjectId": 1,
      "subjectName": "Toán Lớp 1",
      "topicId": 1,
      "topicTitle": "Số và phép tính",
      "subtopicId": 3,
      "subtopicTitle": "Phép cộng và trừ"
    }
  }
}
```

---

## 🎯 Tóm Tắt

### ✅ Các Trường Luôn Có (Bắt Buộc)

1. `version` - Phiên bản envelope (1)
2. `kind` - Loại câu hỏi
3. `prompt` - Đề bài
4. `media` - Mảng hình ảnh (có thể rỗng)
5. `detail` - Dữ liệu đặc thù theo kind
6. `scoring` - Cấu hình điểm số
7. `meta` - Metadata và hierarchy

### ⚠️ Các Trường Tùy Chọn

1. `explanation` (String) - Giải thích chi tiết:
   - **CHỈ** được dùng bởi `image_choice` và `multiple_fill_in`
   - Là trường **string**, không phải array
   - Ví dụ: `"explanation": "Kết quả đúng là 27 vì 12 + 15 = 27"`

### 🔍 Lưu Ý Quan Trọng

- `detail` structure **khác nhau** cho từng `kind`
- `media` có thể **rỗng** `[]` nếu không có hình
- `explanation` là **string** (không phải array `hints[]`) - chỉ dùng cho `image_choice` và `multiple_fill_in`
- `meta.hierarchy` được **thêm tự động** khi lưu câu hỏi
- Backend lưu **toàn bộ envelope** vào column `question_detail` (JSON)

---

## 🚨 Phase 1 Migration Notes

### Thay Đổi Quan Trọng:

1. **Loại bỏ trường `hints` array** - Không còn sử dụng
2. **Chỉ sử dụng `explanation` string** - Cho `image_choice` và `multiple_fill_in`
3. **Centralized validation** - Tất cả editors dùng `validateEnvelope()`
4. **Hierarchy validation** - Bắt buộc chọn đủ: Khối → Môn → Chủ đề → Chủ đề con
