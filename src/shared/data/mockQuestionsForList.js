/**
 * Mock Questions Data for Development
 * Used when USE_MOCK = true in hierarchyService
 */

export const mockQuestions = [
  {
    id: 1,
    prompt: "2 + 2 = ?",
    question_type: 2,
    envelope: {
      version: 1,
      kind: "fib_single",
      prompt: "2 + 2 = ?",
      detail: {
        answer: "4",
        input_type: "text",
      },
    },
    created_at: "2025-10-20T10:00:00Z",
    meta: {
      hierarchy: {
        gradeId: 1,
        subjectId: 1,
        topicId: 1,
        subtopicId: 1,
      },
    },
  },
  {
    id: 2,
    prompt: "3 + 5 = ?",
    question_type: 1,
    envelope: {
      version: 1,
      kind: "mcq_single",
      prompt: "3 + 5 = ?",
      detail: {
        choices: [
          { id: "a", text: "7" },
          { id: "b", text: "8" },
          { id: "c", text: "9" },
        ],
        correct: "b",
      },
    },
    created_at: "2025-10-20T11:00:00Z",
    meta: {
      hierarchy: {
        gradeId: 1,
        subjectId: 1,
        topicId: 1,
        subtopicId: 2,
      },
    },
  },
  {
    id: 3,
    prompt: "Chọn hình vuông",
    question_type: 3,
    envelope: {
      version: 1,
      kind: "image_choice",
      prompt: "Chọn hình vuông",
      detail: {
        images: [
          { id: "a", url: "https://via.placeholder.com/100" },
          { id: "b", url: "https://via.placeholder.com/100" },
        ],
        correct: "a",
      },
    },
    created_at: "2025-10-20T12:00:00Z",
    meta: {
      hierarchy: {
        gradeId: 1,
        subjectId: 1,
        topicId: 2,
        subtopicId: 4,
      },
    },
  },
];

/**
 * Filter mock questions based on filters
 * @param {object} filters - Filter options { gradeId, subjectId, topicId, subtopicId, kind, search }
 * @returns {Array} Filtered questions
 */
export function filterMockQuestions(filters = {}) {
  let questions = [...mockQuestions];

  // Apply hierarchy filters
  if (filters.gradeId) {
    questions = questions.filter(
      (q) => q.meta?.hierarchy?.gradeId === filters.gradeId
    );
  }
  if (filters.subjectId) {
    questions = questions.filter(
      (q) => q.meta?.hierarchy?.subjectId === filters.subjectId
    );
  }
  if (filters.topicId) {
    questions = questions.filter(
      (q) => q.meta?.hierarchy?.topicId === filters.topicId
    );
  }
  if (filters.subtopicId) {
    questions = questions.filter(
      (q) => q.meta?.hierarchy?.subtopicId === filters.subtopicId
    );
  }

  // Apply kind filter
  if (filters.kind) {
    questions = questions.filter((q) => q.envelope?.kind === filters.kind);
  }

  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    questions = questions.filter((q) => {
      const prompt = (q.prompt || "").toLowerCase();
      return prompt.includes(searchLower);
    });
  }

  return questions;
}
