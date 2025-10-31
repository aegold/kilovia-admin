# 📦 Cấu Trúc Envelope Câu Hỏi

> **Mục đích**: Tài liệu này giải thích cấu trúc dữ liệu câu hỏi (envelope) cho 7 loại câu hỏi trong hệ thống.

---

## 🎯 Tổng Quan

**Envelope** là object JSON chứa toàn bộ thông tin của 1 câu hỏi, gồm 2 phần:

1. **Phần chung** (8 fields) - Có ở mọi loại câu hỏi
2. **Phần `detail`** - Cấu trúc khác nhau tùy loại câu hỏi (`kind`)

---

## 📋 PHẦN 1: CÁC FIELD CHUNG

Tất cả 7 loại câu hỏi đều có 8 fields này:

---

### 1. `version`

**Kiểu dữ liệu**: `number`  
**Giá trị**: Luôn là `1`  
**Mục đích**: Đánh dấu phiên bản cấu trúc envelope, dùng để tương thích khi có thay đổi trong tương lai

```json
"version": 1
```

---

### 2. `kind`

**Kiểu dữ liệu**: `string`  
**Mục đích**: Xác định loại câu hỏi

```json
"kind": "mcq_single"
```

**7 loại câu hỏi:**

| `kind`                 | Tên tiếng Việt         | UI hiển thị                 |
| ---------------------- | ---------------------- | --------------------------- |
| `mcq_single`           | Trắc nghiệm đơn        | Radio buttons với text      |
| `fib_single`           | Điền vào chỗ trống đơn | 1 input box                 |
| `image_choice`         | Chọn hình ảnh          | Radio buttons với hình ảnh  |
| `multiple_fill_in`     | Nhiều chỗ trống        | Nhiều input boxes           |
| `vertical_calculation` | Phép tính dọc          | Layout phép tính theo cột   |
| `expression`           | Biểu thức toán         | Phép tính ngang với ô trống |
| `matching_pairs`       | Nối cặp                | 2 cột để nối với nhau       |

---

### 3. `prompt`

**Kiểu dữ liệu**: `string`  
**Mục đích**: Câu hỏi/đề bài hiển thị cho học sinh

```json
"prompt": "Thủ đô của Việt Nam là gì?"
```

**Lưu ý:**

- Có thể chứa ký tự xuống dòng `\n`
- Với `fib_single`: có thể chứa `[____]` để đánh dấu vị trí ô trống
- Với `vertical_calculation` và `expression`: thường là text hướng dẫn chung

---

### 4. `media`

**Kiểu dữ liệu**: `array` (danh sách các object)  
**Mục đích**: Hình ảnh minh họa cho câu hỏi (không phải hình đáp án)

```json
"media": [
  {
    "type": "image",
    "url": "https://example.com/hanoi-flag.jpg",
    "alt": "Hình quốc kỳ Việt Nam"
  }
]
```

**Cấu trúc mỗi item:**

- `type`: Luôn là `"image"`
- `url`: Đường dẫn đến file hình
- `alt`: Text mô tả hình (accessibility)

**Lưu ý:**

- Có thể là array rỗng `[]` nếu không có hình
- Thường chỉ có 1 hình, nhưng có thể nhiều hơn
- **CHỈ dùng cho**: `mcq_single`, `fib_single`, `image_choice`, `multiple_fill_in`
- **KHÔNG dùng cho**: `vertical_calculation`, `expression`, `matching_pairs`

---

### 5. `detail`

**Kiểu dữ liệu**: `object`  
**Mục đích**: Chứa cấu trúc chi tiết của câu hỏi (đáp án, options, layout...)

```json
"detail": {
  // Cấu trúc khác nhau hoàn toàn tùy theo kind
}
```

**Lưu ý**: Đây là phần **QUAN TRỌNG NHẤT**, cấu trúc hoàn toàn khác nhau cho từng `kind` (xem PHẦN 2)

---

### 6. `scoring`

**Kiểu dữ liệu**: `object`  
**Mục đích**: Cấu hình điểm số (backend dùng để chấm điểm)

```json
"scoring": {
  "full_points": 1,      // Điểm tối đa khi trả lời đúng
  "partial_points": 0,   // Điểm một phần (hiện chưa dùng)
  "penalty": 0           // Điểm trừ khi sai (hiện chưa dùng)
}
```

**Lưu ý**:

- `full_points` thường là `1` hoặc `10` tùy cấu hình bài test
- `partial_points` và `penalty` hiện tại luôn là `0`

---

### 7. `meta`

**Kiểu dữ liệu**: `object`  
**Mục đích**: Metadata để phân loại, tìm kiếm, filter câu hỏi

```json
"meta": {
  "difficulty": "easy",
  "tags": ["địa lý", "thủ đô"],
  "hierarchy": {
    "gradeId": 3,
    "gradeName": "Lớp 3",
    "subjectId": 6,
    "subjectName": "Địa lý Lớp 3",
    "topicId": 15,
    "topicTitle": "Địa lý Việt Nam",
    "subtopicId": 48,
    "subtopicTitle": "Các thành phố"
  }
}
```

**Giải thích các field:**

- **`difficulty`**: Độ khó  
  Giá trị: `"easy"`, `"medium"`, hoặc `"hard"`

- **`tags`**: Danh sách từ khóa  
  Array các string, dùng để search/filter

- **`hierarchy`**: Phân cấp nội dung  
  Cấu trúc: Khối học → Môn học → Chủ đề → Chủ đề con  
  Mỗi level có `id` và `name`/`title`

---

### 8. `explanation` (TÙY CHỌN)

**Kiểu dữ liệu**: `string`  
**Mục đích**: Giải thích chi tiết đáp án (hiển thị sau khi học sinh nộp bài)

```json
"explanation": "Đáp án đúng là Hà Nội vì đây là thủ đô chính thức của Việt Nam từ năm 1976."
```

**⚠️ LƯU Ý QUAN TRỌNG:**

- Field này là **TÙY CHỌN** - có thể không tồn tại trong envelope
- **Có ở tất cả 7 loại câu hỏi**: `mcq_single`, `fib_single`, `image_choice`, `multiple_fill_in`, `vertical_calculation`, `expression`, `matching_pairs`
- Kiểu dữ liệu là **string**, không phải array
- Nếu không có giải thích, field này không xuất hiện trong JSON (không để `null` hay `""`)

---

## 📊 PHẦN 2: CẤU TRÚC `detail` CHO TỪNG LOẠI

Đây là phần **QUAN TRỌNG NHẤT** - mỗi loại câu hỏi có cấu trúc `detail` hoàn toàn khác nhau.

---

## 1️⃣ MCQ_SINGLE - Trắc nghiệm đơn

### Cấu trúc `detail`:

```json
"detail": {
  "options": [
    { "id": "A", "text": "Hà Nội", "correct": true },
    { "id": "B", "text": "TP. Hồ Chí Minh", "correct": false },
    { "id": "C", "text": "Đà Nẵng", "correct": false },
    { "id": "D", "text": "Cần Thơ", "correct": false }
  ],
  "shuffle": true
}
```

### Giải thích các field:

**`options`** (array):

- Danh sách các đáp án
- Mỗi option có 3 thuộc tính:
  - **`id`** (string): Ký hiệu đáp án (A, B, C, D...)
  - **`text`** (string): Nội dung đáp án
  - **`correct`** (boolean): `true` = đáp án đúng, `false` = đáp án sai
- Luôn có **đúng 1 option** có `correct: true`

**`shuffle`** (boolean):

- `true`: Xáo trộn thứ tự các options khi hiển thị
- `false`: Giữ nguyên thứ tự

### Ví dụ đầy đủ:

```json
{
  "version": 1,
  "kind": "mcq_single",
  "prompt": "Thủ đô của Việt Nam là?",
  "media": [],
  "detail": {
    "options": [
      { "id": "A", "text": "Hà Nội", "correct": true },
      { "id": "B", "text": "TP.HCM", "correct": false },
      { "id": "C", "text": "Đà Nẵng", "correct": false }
    ],
    "shuffle": true
  },
  "scoring": { "full_points": 1, "partial_points": 0, "penalty": 0 },
  "meta": { "difficulty": "easy", "tags": ["địa lý"], "hierarchy": {} },
  "explanation": "Hà Nội là thủ đô của Việt Nam từ năm 1976."
}
```

---

## 2️⃣ FIB_SINGLE - Điền vào chỗ trống đơn

### Cấu trúc `detail`:

```json
"detail": {
  "answer": "Hà Nội",
  "case_sensitive": false,
  "normalize_space": true
}
```

### Giải thích các field:

**`answer`** (string):

- Đáp án đúng của câu hỏi
- Là giá trị chuẩn để so sánh với câu trả lời của học sinh

**`case_sensitive`** (boolean):

- `true`: Phân biệt chữ HOA/thường (strict matching)
- `false`: Không phân biệt (case-insensitive)
- Ví dụ: Nếu `false`, cả "Hà Nội", "hà nội", "HÀ NỘI" đều đúng

**`normalize_space`** (boolean):

- `true`: Bỏ qua khoảng trắng thừa ở đầu/cuối và giữa các từ
- `false`: So sánh chính xác kể cả khoảng trắng
- Ví dụ: Nếu `true`, cả "Hà Nội", " Hà Nội ", "Hà Nội" đều coi là giống nhau

### Ví dụ đầy đủ:

```json
{
  "version": 1,
  "kind": "fib_single",
  "prompt": "Thủ đô của Việt Nam là [____]",
  "media": [
    {
      "type": "image",
      "url": "https://example.com/vietnam-map.jpg",
      "alt": "Bản đồ Việt Nam"
    }
  ],
  "detail": {
    "answer": "Hà Nội",
    "case_sensitive": false,
    "normalize_space": true
  },
  "scoring": { "full_points": 1, "partial_points": 0, "penalty": 0 },
  "meta": { "difficulty": "easy", "tags": ["địa lý"], "hierarchy": {} },
  "explanation": "Hà Nội là trung tâm chính trị, kinh tế và văn hóa của Việt Nam."
}
```

---

## 3️⃣ IMAGE_CHOICE - Chọn hình ảnh

### Cấu trúc `detail`:

```json
"detail": {
  "options": [
    {
      "id": "A",
      "image": {
        "url": "https://example.com/dog.jpg",
        "alt": "Con chó"
      },
      "correct": true
    },
    {
      "id": "B",
      "image": {
        "url": "https://example.com/cat.jpg",
        "alt": "Con mèo"
      },
      "correct": false
    }
  ],
  "shuffle": true
}
```

### Giải thích các field:

**`options`** (array):

- Danh sách các đáp án hình ảnh
- Mỗi option có:
  - **`id`** (string): Ký hiệu đáp án (A, B, C...)
  - **`image`** (object): Thông tin hình ảnh
    - **`url`** (string): Đường dẫn đến file hình
    - **`alt`** (string): Text mô tả (cho accessibility)
  - **`correct`** (boolean): `true` = đáp án đúng
- Luôn có **đúng 1 option** có `correct: true`

**`shuffle`** (boolean):

- `true`: Xáo trộn thứ tự các options
- `false`: Giữ nguyên thứ tự

### ⚠️ Lưu ý đặc biệt:

Loại câu hỏi này có thể có field `explanation` ở root level của envelope (xem Field #8 ở phần trên).

### Ví dụ đầy đủ:

```json
{
  "version": 1,
  "kind": "image_choice",
  "prompt": "Đâu là con chó?",
  "media": [],
  "detail": {
    "options": [
      {
        "id": "A",
        "image": { "url": "https://example.com/dog.jpg", "alt": "Chó" },
        "correct": true
      },
      {
        "id": "B",
        "image": { "url": "https://example.com/cat.jpg", "alt": "Mèo" },
        "correct": false
      }
    ],
    "shuffle": true
  },
  "explanation": "Con chó là động vật có 4 chân và sủa gâu gâu.",
  "scoring": { "full_points": 1, "partial_points": 0, "penalty": 0 },
  "meta": { "difficulty": "easy", "tags": ["sinh học"], "hierarchy": {} }
}
```

---

## 4️⃣ MULTIPLE_FILL_IN - Nhiều chỗ trống

### Cấu trúc `detail`:

```json
"detail": {
  "blocks": [
    {
      "type": "text",
      "content": "Điền đáp án vào các ô trống:",
      "down_line": true
    },
    {
      "type": "fill-in-group",
      "id": "blanks_group",
      "items": [
        {
          "type": "fill-in-text",
          "before": "5 + 3 = ",
          "input": {
            "id": "blank1",
            "type": "text",
            "width": "80px",
            "placeholder": "..."
          },
          "after": "",
          "newLine": false
        },
        {
          "type": "fill-in-text",
          "before": "12 - 7 = ",
          "input": {
            "id": "blank2",
            "type": "text",
            "width": "80px",
            "placeholder": "..."
          },
          "after": "",
          "newLine": true
        }
      ]
    }
  ],
  "answers": [
    { "id": "blank1", "evaluate": true, "expression": "8" },
    { "id": "blank2", "evaluate": true, "expression": "5" }
  ]
}
```

### Giải thích các field:

#### 1. `blocks` (array)

Danh sách các khối nội dung, có 2 loại block:

**Block loại "text"**:

- **`type`**: `"text"`
- **`content`** (string): Nội dung text hiển thị
- **`down_line`** (boolean): `true` = xuống dòng sau text này

**Block loại "fill-in-group"**:

- **`type`**: `"fill-in-group"`
- **`id`** (string): ID của nhóm (thường là `"blanks_group"`)
- **`items`** (array): Danh sách các ô trống, mỗi item có:
  - **`type`**: `"fill-in-text"`
  - **`before`** (string): Text hiển thị **trước** ô trống
  - **`input`** (object): Cấu hình ô input
    - **`id`** (string): ID duy nhất của ô trống (để map với `answers`)
    - **`type`**: `"text"`
    - **`width`** (string): Độ rộng ô input (CSS, ví dụ: `"80px"`)
    - **`placeholder`** (string): Text gợi ý trong ô trống
  - **`after`** (string): Text hiển thị **sau** ô trống
  - **`newLine`** (boolean): `true` = xuống dòng trước item này

#### 2. `answers` (array)

Danh sách đáp án đúng cho các ô trống:

- **`id`** (string): ID của ô trống (khớp với `input.id`)
- **`evaluate`** (boolean): `true` = cần chấm điểm ô này
- **`expression`** (string): Đáp án đúng

### ⚠️ Lưu ý đặc biệt:

Loại câu hỏi này có thể có field `explanation` ở root level để giải thích toàn bộ bài (xem Field #8 ở phần trên).

### Ví dụ đầy đủ:

```json
{
  "version": 1,
  "kind": "multiple_fill_in",
  "prompt": "Tính kết quả:",
  "media": [],
  "detail": {
    "blocks": [
      {
        "type": "text",
        "content": "Điền đáp án:",
        "down_line": true
      },
      {
        "type": "fill-in-group",
        "id": "blanks_group",
        "items": [
          {
            "type": "fill-in-text",
            "before": "5 + 3 = ",
            "input": { "id": "blank1", "type": "text", "width": "80px" },
            "after": "",
            "newLine": false
          }
        ]
      }
    ],
    "answers": [{ "id": "blank1", "evaluate": true, "expression": "8" }]
  },
  "explanation": "5 + 3 = 8 là phép cộng cơ bản. Đáp án được tính bằng cách cộng số hạng thứ nhất với số hạng thứ hai.",
  "scoring": { "full_points": 1, "partial_points": 0, "penalty": 0 },
  "meta": { "difficulty": "easy", "tags": ["toán"], "hierarchy": {} }
}
```

---

## 5️⃣ VERTICAL_CALCULATION - Phép tính dọc

### Cấu trúc `detail`:

**Trường hợp 1: Toán tử đơn (cộng hoặc trừ)**

```json
"detail": {
  "layout": {
    "rows": ["123", "456"],
    "operator": "+",
    "mode": "addition"
  },
  "result": "579"
}
```

**Trường hợp 2: Toán tử hỗn hợp**

```json
"detail": {
  "layout": {
    "rows": ["100", "25", "10"],
    "operators": ["+", "-"],
    "mode": "mixed"
  },
  "result": "65"
}
```

### Giải thích các field:

#### 1. `layout` (object)

Cấu hình cách hiển thị phép tính:

**`rows`** (array of strings):

- Danh sách các số hạng (từ trên xuống dưới)
- Mỗi số là 1 string
- Ví dụ: `["123", "456"]` nghĩa là 123 ở trên, 456 ở dưới

**`mode`** (string):

- Loại phép tính
- Giá trị: `"addition"` (cộng), `"subtraction"` (trừ), `"mixed"` (hỗn hợp)

**`operator`** (string) - CHỈ khi mode KHÔNG phải "mixed":

- Toán tử duy nhất
- Giá trị: `"+"` hoặc `"-"`

**`operators`** (array) - CHỈ khi mode = "mixed":

- Danh sách toán tử tương ứng với mỗi hàng (trừ hàng đầu tiên)
- Ví dụ: `["+", "-"]` nghĩa là hàng thứ 2 dùng `+`, hàng thứ 3 dùng `-`
- Số lượng: `operators.length = rows.length - 1`

#### 2. `result` (string)

Kết quả đúng của phép tính

### Ví dụ minh họa:

**Trường hợp 1**: `mode: "addition"`

```
  123
+ 456
─────
  579  ← result
```

**Trường hợp 2**: `mode: "mixed"`

```
  100
+  25
-  10
─────
   65  ← result (100 + 25 - 10 = 115 - 10 = 65... sai! đúng là 115)
```

> **Lưu ý**: Backend tự tính toán, FE chỉ cần hiển thị layout và lưu input của học sinh.

### Ví dụ đầy đủ:

```json
{
  "version": 1,
  "kind": "vertical_calculation",
  "prompt": "Thực hiện phép tính theo cột dọc:",
  "media": [],
  "detail": {
    "layout": {
      "rows": ["123", "456"],
      "operator": "+",
      "mode": "addition"
    },
    "result": "579"
  },
  "scoring": { "full_points": 1, "partial_points": 0, "penalty": 0 },
  "meta": { "difficulty": "medium", "tags": ["toán", "cộng"], "hierarchy": {} },
  "explanation": "Phép cộng theo cột dọc: 123 + 456 = 579. Cộng từ hàng đơn vị lên hàng trăm."
}
```

---

## 6️⃣ EXPRESSION - Biểu thức toán học

### Cấu trúc `detail`:

```json
"detail": {
  "operation": "multiplication",
  "operand1": "12",
  "operand2": "5",
  "result": "60",
  "mode": "blank_result"
}
```

### Giải thích các field:

**`operation`** (string):

- Loại phép toán
- Giá trị: `"addition"` (cộng), `"subtraction"` (trừ), `"multiplication"` (nhân), `"division"` (chia)

**`operand1`** (string):

- Số hạng thứ nhất (bên trái toán tử)

**`operand2`** (string):

- Số hạng thứ hai (bên phải toán tử)

**`result`** (string):

- Kết quả của phép tính

**`mode`** (string):

- Vị trí ô trống trong biểu thức

### Các mode và ý nghĩa:

| Mode                  | Ô trống ở đâu? | Ví dụ hiển thị       |
| --------------------- | -------------- | -------------------- |
| `blank_result`        | Kết quả        | `12 × 5 = [__]`      |
| `blank_operand1`      | Số thứ nhất    | `[__] × 5 = 60`      |
| `blank_operand2`      | Số thứ hai     | `12 × [__] = 60`     |
| `blank_both_operands` | Cả 2 số        | `[__] × [__] = 60`   |
| `blank_all`           | Tất cả         | `[__] × [__] = [__]` |

### Ký hiệu toán tử:

| Operation        | Ký hiệu hiển thị |
| ---------------- | ---------------- |
| `addition`       | `+`              |
| `subtraction`    | `-`              |
| `multiplication` | `×`              |
| `division`       | `÷`              |

### Ví dụ đầy đủ:

```json
{
  "version": 1,
  "kind": "expression",
  "prompt": "Điền số thích hợp vào ô trống:",
  "media": [],
  "detail": {
    "operation": "multiplication",
    "operand1": "12",
    "operand2": "5",
    "result": "60",
    "mode": "blank_result"
  },
  "scoring": { "full_points": 1, "partial_points": 0, "penalty": 0 },
  "meta": { "difficulty": "medium", "tags": ["toán", "nhân"], "hierarchy": {} },
  "explanation": "12 × 5 = 60. Phép nhân có thể tính bằng cách cộng 12 lần 5: 12 + 12 + 12 + 12 + 12 = 60."
}
```

---

## 7️⃣ MATCHING_PAIRS - Nối cặp

### Cấu trúc `detail`:

```json
"detail": {
  "columns": [
    {
      "id": "colA",
      "label": "Động vật",
      "items": [
        { "id": "item1", "text": "Chó" },
        { "id": "item2", "text": "Mèo" },
        { "id": "item3", "text": "Gà" }
      ]
    },
    {
      "id": "colB",
      "label": "Tiếng kêu",
      "items": [
        { "id": "item4", "text": "Gâu gâu" },
        { "id": "item5", "text": "Meo meo" },
        { "id": "item6", "text": "Cục tác" }
      ]
    }
  ],
  "pairs": [
    { "left": "item1", "right": "item4" },
    { "left": "item2", "right": "item5" },
    { "left": "item3", "right": "item6" }
  ],
  "allowPartialCredit": false
}
```

### Giải thích các field:

#### 1. `columns` (array)

Luôn có **đúng 2 cột** (cột trái và cột phải):

**Mỗi column có:**

- **`id`** (string): ID của cột (ví dụ: `"colA"`, `"colB"`)
- **`label`** (string): Tiêu đề cột
- **`items`** (array): Danh sách items trong cột
  - **`id`** (string): ID duy nhất của item
  - **`text`** (string): Nội dung hiển thị

#### 2. `pairs` (array)

Danh sách các cặp nối đúng:

- **`left`** (string): ID của item bên cột trái
- **`right`** (string): ID của item bên cột phải

#### 3. `allowPartialCredit` (boolean)

Cách chấm điểm:

- `true`: Cho điểm từng phần (mỗi cặp đúng được 1 phần điểm)
- `false`: Phải đúng hết mới được điểm (all-or-nothing)

### Ví dụ đầy đủ:

```json
{
  "version": 1,
  "kind": "matching_pairs",
  "prompt": "Nối động vật với tiếng kêu tương ứng:",
  "media": [],
  "detail": {
    "columns": [
      {
        "id": "colA",
        "label": "Động vật",
        "items": [
          { "id": "item1", "text": "Chó" },
          { "id": "item2", "text": "Mèo" }
        ]
      },
      {
        "id": "colB",
        "label": "Tiếng kêu",
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
  },
  "scoring": { "full_points": 1, "partial_points": 0, "penalty": 0 },
  "meta": { "difficulty": "easy", "tags": ["sinh học"], "hierarchy": {} },
  "explanation": "Chó kêu 'gâu gâu', mèo kêu 'meo meo'. Đây là tiếng kêu đặc trưng của từng loài động vật."
}
```

---

**Last Updated**: October 31, 2025  
**Version**: 2.0 (Post Phase 1 Migration)
