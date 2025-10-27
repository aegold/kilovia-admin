/**
 * Question Envelope Factory
 * Creates standardized question envelope structure
 */
export function makeQuestionEnvelope({ kind, prompt, detail, extras = {} }) {
  return {
    version: 1,
    kind,
    prompt,
    media: [],
    detail,
    explanation: "",
    hints: [],
    scoring: { full_points: 1, partial_points: 0, penalty: 0 },
    meta: { difficulty: "easy", tags: [] },
    ...extras, // cho phép override nếu cần
  };
}

export default makeQuestionEnvelope;
