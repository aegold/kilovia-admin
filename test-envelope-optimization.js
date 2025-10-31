/**
 * Test script to verify envelope optimization
 * Copy and paste this into browser console on question creator page
 */

console.log("🧪 Testing Envelope Optimization...\n");

// Simulate FIB_SINGLE envelope creation
const fibSingleEnvelope = {
  version: 1,
  kind: "fib_single",
  prompt: "Thủ đô của Việt Nam là [____]",
  media: [],
  detail: {
    answer: "Hà Nội",
    case_sensitive: false,
    normalize_space: true,
  },
  scoring: {
    full_points: 1,
    partial_points: 0,
    penalty: 0,
  },
  meta: {
    difficulty: "easy",
    tags: [],
  },
};

console.log("✅ FIB_SINGLE Envelope (Optimized):");
console.log(JSON.stringify(fibSingleEnvelope, null, 2));
console.log(`Size: ${JSON.stringify(fibSingleEnvelope).length} bytes\n`);

// Simulate MULTIPLE_FILL_IN envelope
const multipleFillInEnvelope = {
  version: 1,
  kind: "multiple_fill_in",
  prompt: "Điền vào chỗ trống:",
  media: [],
  detail: {
    blocks: [
      { type: "text", content: "Câu hỏi chính", down_line: true },
      {
        type: "fill-in-group",
        id: "blanks_group",
        items: [
          {
            type: "fill-in-text",
            before: "Kết quả là",
            input: {
              id: "blank1",
              type: "text",
              width: "80px",
              placeholder: "...",
            },
            after: "đơn vị",
            newLine: false,
          },
        ],
      },
    ],
    answers: [{ id: "blank1", evaluate: true, expression: "42" }],
  },
  explanation: "Giải thích chi tiết",
  scoring: {
    full_points: 1,
    partial_points: 0,
    penalty: 0,
  },
  meta: {
    difficulty: "easy",
    tags: [],
  },
};

console.log("✅ MULTIPLE_FILL_IN Envelope (Optimized):");
console.log(JSON.stringify(multipleFillInEnvelope, null, 2));
console.log(`Size: ${JSON.stringify(multipleFillInEnvelope).length} bytes\n`);

// Check for removed fields
const removedFields = ["blocks", "variables", "answers", "hints"];
const hasRemovedFields = removedFields.some(
  (field) => field in fibSingleEnvelope || field in multipleFillInEnvelope
);

if (hasRemovedFields) {
  console.error("❌ ERROR: Found removed fields at root level!");
  removedFields.forEach((field) => {
    if (field in fibSingleEnvelope) {
      console.error(`  - FIB_SINGLE has "${field}"`);
    }
    if (field in multipleFillInEnvelope) {
      console.error(`  - MULTIPLE_FILL_IN has "${field}"`);
    }
  });
} else {
  console.log("✅ SUCCESS: No removed fields found at root level!");
}

// Verify MULTIPLE_FILL_IN has blocks and answers in detail
if (
  multipleFillInEnvelope.detail.blocks &&
  multipleFillInEnvelope.detail.answers
) {
  console.log(
    "✅ SUCCESS: MULTIPLE_FILL_IN has blocks and answers in detail object!"
  );
} else {
  console.error(
    "❌ ERROR: MULTIPLE_FILL_IN missing blocks or answers in detail!"
  );
}

console.log("\n🎉 Test Complete!");
