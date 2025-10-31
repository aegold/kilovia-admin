/**
 * envelopeValidators.js - Centralized validation for question envelopes
 *
 * Provides validation schemas and functions for all question types.
 * Each validator returns { valid: boolean, errors: string[] }
 */

import { KINDS } from "../constants/kinds";

/**
 * Validation result type
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether validation passed
 * @property {string[]} errors - Array of error messages
 */

/**
 * Common validation utilities
 */
const validators = {
  /**
   * Check if string is non-empty after trim
   */
  isNonEmptyString: (value, fieldName = "Field") => {
    if (!value || typeof value !== "string" || !value.trim()) {
      return `${fieldName} không được để trống`;
    }
    return null;
  },

  /**
   * Check if array has minimum length
   */
  hasMinLength: (arr, min, fieldName = "Array") => {
    if (!Array.isArray(arr) || arr.length < min) {
      return `${fieldName} phải có ít nhất ${min} phần tử`;
    }
    return null;
  },

  /**
   * Check if number is valid and positive
   */
  isPositiveNumber: (value, fieldName = "Number") => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      return `${fieldName} phải là số dương`;
    }
    return null;
  },

  /**
   * Check if value is boolean
   */
  isBoolean: (value, fieldName = "Field") => {
    if (typeof value !== "boolean") {
      return `${fieldName} phải là true hoặc false`;
    }
    return null;
  },
};

/**
 * Validate core envelope structure (common for all types)
 */
function validateCoreStructure(envelope) {
  const errors = [];

  // Version
  if (envelope.version !== 1) {
    errors.push("Version phải là 1");
  }

  // Kind
  const validKinds = Object.values(KINDS);
  if (!validKinds.includes(envelope.kind)) {
    errors.push(
      `Kind không hợp lệ. Phải là một trong: ${validKinds.join(", ")}`
    );
  }

  // Prompt (optional for some types like vertical_calculation, expression)
  const typesWithOptionalPrompt = [
    KINDS.VERTICAL_CALCULATION,
    KINDS.EXPRESSION,
  ];
  if (!typesWithOptionalPrompt.includes(envelope.kind)) {
    const error = validators.isNonEmptyString(envelope.prompt, "Đề bài");
    if (error) errors.push(error);
  }

  // Media (must be array)
  if (!Array.isArray(envelope.media)) {
    errors.push("Media phải là mảng");
  }

  // Detail (must exist)
  if (!envelope.detail || typeof envelope.detail !== "object") {
    errors.push("Detail không được thiếu");
  }

  // Scoring (optional but if exists must be valid)
  if (envelope.scoring) {
    if (typeof envelope.scoring !== "object") {
      errors.push("Scoring phải là object");
    } else {
      if (
        typeof envelope.scoring.full_points !== "number" ||
        envelope.scoring.full_points <= 0
      ) {
        errors.push("Scoring.full_points phải là số dương");
      }
    }
  }

  // Meta (optional but if exists must be valid)
  if (envelope.meta && typeof envelope.meta !== "object") {
    errors.push("Meta phải là object");
  }

  return errors;
}

/**
 * Validate MCQ_SINGLE envelope
 */
export function validateMcqSingle(envelope) {
  const errors = [...validateCoreStructure(envelope)];

  if (!envelope.detail) {
    return { valid: false, errors };
  }

  const { options, shuffle } = envelope.detail;

  // Options validation
  const optionsError = validators.hasMinLength(options, 2, "Phương án");
  if (optionsError) {
    errors.push(optionsError);
  } else {
    // Check each option
    options.forEach((opt, idx) => {
      if (!opt.id || !opt.text) {
        errors.push(`Phương án ${idx + 1} thiếu id hoặc text`);
      }
      if (typeof opt.correct !== "boolean") {
        errors.push(`Phương án ${idx + 1} thiếu trường correct`);
      }
    });

    // Check exactly one correct answer
    const correctCount = options.filter((opt) => opt.correct).length;
    if (correctCount === 0) {
      errors.push("Phải có ít nhất 1 đáp án đúng");
    } else if (correctCount > 1) {
      errors.push("Chỉ được có 1 đáp án đúng");
    }
  }

  // Shuffle validation
  const shuffleError = validators.isBoolean(shuffle, "Shuffle");
  if (shuffleError) {
    errors.push(shuffleError);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate FIB_SINGLE envelope
 */
export function validateFibSingle(envelope) {
  const errors = [...validateCoreStructure(envelope)];

  if (!envelope.detail) {
    return { valid: false, errors };
  }

  const { answer, case_sensitive, normalize_space } = envelope.detail;

  // Answer validation
  const answerError = validators.isNonEmptyString(answer, "Đáp án");
  if (answerError) {
    errors.push(answerError);
  }

  // Flags validation
  if (typeof case_sensitive !== "boolean") {
    errors.push("case_sensitive phải là boolean");
  }
  if (typeof normalize_space !== "boolean") {
    errors.push("normalize_space phải là boolean");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate IMAGE_CHOICE envelope
 */
export function validateImageChoice(envelope) {
  const errors = [...validateCoreStructure(envelope)];

  if (!envelope.detail) {
    return { valid: false, errors };
  }

  const { options, shuffle } = envelope.detail;

  // Options validation
  const optionsError = validators.hasMinLength(options, 2, "Hình ảnh đáp án");
  if (optionsError) {
    errors.push(optionsError);
  } else {
    // Check each option
    options.forEach((opt, idx) => {
      if (!opt.id) {
        errors.push(`Hình ${idx + 1} thiếu id`);
      }
      if (!opt.image || !opt.image.url) {
        errors.push(`Hình ${idx + 1} thiếu URL`);
      }
      if (typeof opt.correct !== "boolean") {
        errors.push(`Hình ${idx + 1} thiếu trường correct`);
      }
    });

    // Check exactly one correct answer
    const correctCount = options.filter((opt) => opt.correct).length;
    if (correctCount === 0) {
      errors.push("Phải có ít nhất 1 hình đáp án đúng");
    } else if (correctCount > 1) {
      errors.push("Chỉ được có 1 hình đáp án đúng");
    }
  }

  // Shuffle validation
  const shuffleError = validators.isBoolean(shuffle, "Shuffle");
  if (shuffleError) {
    errors.push(shuffleError);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate MULTIPLE_FILL_IN envelope
 */
export function validateMultipleFillIn(envelope) {
  const errors = [...validateCoreStructure(envelope)];

  if (!envelope.detail) {
    return { valid: false, errors };
  }

  const { blocks, answers } = envelope.detail;

  // Blocks validation
  if (!Array.isArray(blocks) || blocks.length === 0) {
    errors.push("Blocks không được rỗng");
  }

  // Answers validation
  const answersError = validators.hasMinLength(answers, 2, "Đáp án");
  if (answersError) {
    errors.push(answersError);
  } else {
    // Check each answer
    answers.forEach((ans, idx) => {
      if (!ans.id) {
        errors.push(`Đáp án ${idx + 1} thiếu id`);
      }
      if (!ans.expression || !String(ans.expression).trim()) {
        errors.push(`Đáp án ${idx + 1} thiếu expression`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate VERTICAL_CALCULATION envelope
 */
export function validateVerticalCalculation(envelope) {
  const errors = [...validateCoreStructure(envelope)];

  if (!envelope.detail) {
    return { valid: false, errors };
  }

  const { layout, result } = envelope.detail;

  // Layout validation
  if (!layout || typeof layout !== "object") {
    errors.push("Layout không được thiếu");
  } else {
    // Rows validation
    const rowsError = validators.hasMinLength(layout.rows, 2, "Số hạng");
    if (rowsError) {
      errors.push(rowsError);
    } else {
      // Check each row is valid number
      layout.rows.forEach((row, idx) => {
        const num = parseFloat(row);
        if (isNaN(num)) {
          errors.push(`Số hạng ${idx + 1} không hợp lệ`);
        }
      });
    }

    // Mode validation
    const validModes = ["addition", "subtraction", "mixed"];
    if (!validModes.includes(layout.mode)) {
      errors.push(`Mode phải là một trong: ${validModes.join(", ")}`);
    }

    // Operator validation
    if (layout.mode === "mixed") {
      if (!Array.isArray(layout.operators)) {
        errors.push("Mixed mode phải có mảng operators");
      }
    } else {
      if (!layout.operator || !["+", "-"].includes(layout.operator)) {
        errors.push("Operator phải là + hoặc -");
      }
    }
  }

  // Result validation
  const resultNum = parseFloat(result);
  if (isNaN(resultNum)) {
    errors.push("Kết quả phải là số hợp lệ");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate EXPRESSION envelope
 */
export function validateExpression(envelope) {
  const errors = [...validateCoreStructure(envelope)];

  if (!envelope.detail) {
    return { valid: false, errors };
  }

  const { operation, operand1, operand2, result, mode } = envelope.detail;

  // Operation validation
  const validOperations = [
    "addition",
    "subtraction",
    "multiplication",
    "division",
  ];
  if (!validOperations.includes(operation)) {
    errors.push(`Operation phải là một trong: ${validOperations.join(", ")}`);
  }

  // Operands validation
  const op1 = parseFloat(operand1);
  const op2 = parseFloat(operand2);
  if (isNaN(op1)) {
    errors.push("Số hạng 1 không hợp lệ");
  }
  if (isNaN(op2)) {
    errors.push("Số hạng 2 không hợp lệ");
  }

  // Division by zero check
  if (operation === "division" && op2 === 0) {
    errors.push("Không thể chia cho 0");
  }

  // Result validation
  const res = parseFloat(result);
  if (isNaN(res)) {
    errors.push("Kết quả không hợp lệ");
  }

  // Mode validation
  const validModes = [
    "blank_result",
    "blank_operand1",
    "blank_operand2",
    "blank_both_operands",
    "blank_all",
  ];
  if (!validModes.includes(mode)) {
    errors.push(`Mode phải là một trong: ${validModes.join(", ")}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate MATCHING_PAIRS envelope
 */
export function validateMatchingPairs(envelope) {
  const errors = [...validateCoreStructure(envelope)];

  if (!envelope.detail) {
    return { valid: false, errors };
  }

  const { columns, pairs, allowPartialCredit } = envelope.detail;

  // Columns validation
  if (!Array.isArray(columns) || columns.length !== 2) {
    errors.push("Phải có đúng 2 cột");
  } else {
    columns.forEach((col, colIdx) => {
      if (!col.id || !col.label) {
        errors.push(`Cột ${colIdx + 1} thiếu id hoặc label`);
      }
      if (!Array.isArray(col.items) || col.items.length < 2) {
        errors.push(`Cột ${colIdx + 1} phải có ít nhất 2 items`);
      } else {
        col.items.forEach((item, itemIdx) => {
          if (!item.id || !item.text) {
            errors.push(
              `Cột ${colIdx + 1}, item ${itemIdx + 1} thiếu id hoặc text`
            );
          }
        });
      }
    });
  }

  // Pairs validation
  const pairsError = validators.hasMinLength(pairs, 1, "Cặp đúng");
  if (pairsError) {
    errors.push(pairsError);
  } else {
    pairs.forEach((pair, idx) => {
      if (!pair.left || !pair.right) {
        errors.push(`Cặp ${idx + 1} thiếu left hoặc right`);
      }
    });
  }

  // allowPartialCredit validation
  if (typeof allowPartialCredit !== "boolean") {
    errors.push("allowPartialCredit phải là boolean");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Main validation dispatcher
 * Routes to appropriate validator based on kind
 */
export function validateEnvelope(envelope) {
  if (!envelope || !envelope.kind) {
    return {
      valid: false,
      errors: ["Envelope hoặc kind không tồn tại"],
    };
  }

  const validators = {
    [KINDS.MCQ_SINGLE]: validateMcqSingle,
    [KINDS.FIB_SINGLE]: validateFibSingle,
    [KINDS.IMAGE_CHOICE]: validateImageChoice,
    [KINDS.MULTIPLE_FILL_IN]: validateMultipleFillIn,
    [KINDS.VERTICAL_CALCULATION]: validateVerticalCalculation,
    [KINDS.EXPRESSION]: validateExpression,
    [KINDS.MATCHING_PAIRS]: validateMatchingPairs,
  };

  const validator = validators[envelope.kind];

  if (!validator) {
    return {
      valid: false,
      errors: [`Không tìm thấy validator cho kind: ${envelope.kind}`],
    };
  }

  return validator(envelope);
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors) {
  if (!errors || errors.length === 0) {
    return "";
  }

  if (errors.length === 1) {
    return errors[0];
  }

  return `• ${errors.join("\n• ")}`;
}

export default {
  validateEnvelope,
  validateMcqSingle,
  validateFibSingle,
  validateImageChoice,
  validateMultipleFillIn,
  validateVerticalCalculation,
  validateExpression,
  validateMatchingPairs,
  formatValidationErrors,
};
