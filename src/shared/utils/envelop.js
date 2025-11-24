/**
 * ============================================================================
 * QUESTION ENVELOPE STRUCTURE DOCUMENTATION
 * ============================================================================
 *
 * Standard envelope structure for all question types.
 * Each field's usage is documented below.
 *
 * ============================================================================
 * CORE FIELDS (Always Present)
 * ============================================================================
 *
 * @field {number} version - Envelope format version (currently 1)
 *   - Used by: ALL question types
 *   - Purpose: Future compatibility when envelope structure changes
 *
 * @field {string} kind - Question type identifier
 *   - Used by: ALL question types
 *   - Values:
 *     • "mcq_single" (MCQ Single - Trắc nghiệm đơn)
 *     • "fib_single" (Fill In Blank Single - Điền vào chỗ trống đơn)
 *     • "image_choice" (Image Choice - Chọn hình ảnh)
 *     • "multiple_fill_in" (Multiple Fill In - Nhiều chỗ trống)
 *     • "vertical_calculation" (Vertical Calculation - Phép tính dọc)
 *     • "expression" (Expression - Biểu thức toán học)
 *     • "matching_pairs" (Matching Pairs - Nối cặp)
 *
 * @field {string} prompt - Question text/title
 *   - Used by: ALL question types
 *   - Purpose: Main question text displayed to students
 *   - Example: "Thủ đô của Việt Nam là [____]"
 *
 * @field {Array} media - Array of images/media attached to question
 *   - Used by: mcq_single, fib_single, image_choice, multiple_fill_in
 *   - NOT used by: vertical_calculation, expression, matching_pairs
 *   - Structure: [{ type: "image", url: "https://...", alt: "..." }]
 *   - Note: Can be empty array []
 *
 * @field {Object} detail - Question-specific data (varies by kind)
 *   - Used by: ALL question types (structure differs per kind)
 *   - Purpose: Contains kind-specific question data
 *   - Examples:
 *     • fib_single: { answer: "Hà Nội", case_sensitive: false, normalize_space: true }
 *     • mcq_single: { options: [...], shuffle: true }
 *     • multiple_fill_in: { blocks: [...], answers: [...] }
 *
 * @field {Object} scoring - Scoring configuration
 *   - Used by: ALL question types
 *   - Purpose: Backend uses this for grading
 *   - Structure: { full_points: 1, partial_points: 0, penalty: 0 }
 *
 * @field {Object} meta - Metadata (difficulty, tags, hierarchy)
 *   - Used by: ALL question types
 *   - Purpose: Classification, filtering, search
 *   - Structure: { difficulty: "easy", tags: [], hierarchy: {...} }
 *
 * ============================================================================
 * OPTIONAL FIELDS (Only When Needed)
 * ============================================================================
 *
 * @field {string} questionTitle - Question title (OPTIONAL)
 *   - Used by: ALL question types
 *   - Default: "Thực hiện bài toán sau:"
 *   - Purpose: Title/heading shown before the question content
 *   - Stored in database's questionTitle column
 *   - Only included if provided
 *
 * @field {string} explanation - Detailed explanation/hint (OPTIONAL)
 *   - Used by: image_choice, multiple_fill_in
 *   - NOT used by: mcq_single, fib_single, vertical_calculation, expression, matching_pairs
 *   - Purpose: Help text shown after answering
 *   - Only included if not empty
 *
 * ============================================================================
 * DETAIL FIELD STRUCTURE BY KIND
 * ============================================================================
 *
 * 1. fib_single (Fill In Blank Single - Điền vào chỗ trống đơn):
 *    detail: {
 *      answer: string,           // Correct answer
 *      case_sensitive: boolean,  // Case sensitivity
 *      normalize_space: boolean  // Whitespace normalization
 *    }
 *
 * 2. mcq_single (MCQ Single - Trắc nghiệm đơn):
 *    detail: {
 *      options: [                // Answer options
 *        { id: "A", text: "...", correct: true/false }
 *      ],
 *      shuffle: boolean          // Shuffle options display
 *    }
 *
 * 3. multiple_fill_in (Multiple Fill In - Nhiều chỗ trống):
 *    detail: {
 *      blocks: [                 // Content blocks (text, image, input groups)
 *        { type: "text", content: "...", down_line: true },
 *        { type: "fill-in-group", items: [...] }
 *      ],
 *      answers: [                // Correct answers for each blank
 *        { id: "blank1", evaluate: true, expression: "42" }
 *      ]
 *    }
 *
 * 4. vertical_calculation (Vertical Calculation - Phép tính dọc):
 *    detail: {
 *      layout: {
 *        rows: ["123", "456"],   // Numbers
 *        operator: "+",          // Or operators: ["+", "-"] for mixed
 *        mode: "addition"        // addition, subtraction, mixed
 *      },
 *      result: "579"             // Correct answer
 *    }
 *
 * 5. expression (Expression - Biểu thức toán học):
 *    detail: {
 *      operation: "multiplication",  // addition, subtraction, multiplication, division
 *      operand1: "12",
 *      operand2: "5",
 *      result: "60",
 *      mode: "blank_result"      // Which part is blank
 *    }
 *
 * 6. matching_pairs (Matching Pairs - Nối cặp):
 *    detail: {
 *      columns: [                // Two columns
 *        { id: "colA", label: "Cột A", items: [...] },
 *        { id: "colB", label: "Cột B", items: [...] }
 *      ],
 *      pairs: [                  // Correct pairs
 *        { left: "item1", right: "item3" }
 *      ],
 *      allowPartialCredit: boolean
 *    }
 *
 * ============================================================================
 */
export function makeQuestionEnvelope({ kind, prompt, detail, extras = {} }) {
  const envelope = {
    version: 1,
    kind,
    prompt,
    media: extras.media || [],
    detail,

    // ✅ Scoring always included (backend needs this)
    scoring: extras.scoring || {
      full_points: 1,
      partial_points: 0,
      penalty: 0,
    },

    // ✅ Meta always included
    meta: extras.meta || { difficulty: "easy", tags: [] },
  };

  // ✅ Only include questionTitle if provided
  if (extras.questionTitle) {
    envelope.questionTitle = extras.questionTitle;
  }

  // ✅ Only include explanation if not empty
  if (extras.explanation) {
    envelope.explanation = extras.explanation;
  }

  // Spread remaining extras for extensibility (excluding already handled keys)
  const handledKeys = ["media", "explanation", "scoring", "meta"];
  Object.keys(extras).forEach((key) => {
    if (!handledKeys.includes(key)) {
      envelope[key] = extras[key];
    }
  });

  return envelope;
}

export default makeQuestionEnvelope;
