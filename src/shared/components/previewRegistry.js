/**
 * previewRegistry.js - Registry mapping question kinds to Preview components
 *
 * This registry allows PreviewPanel to render the correct Preview component
 * for each question kind.
 */

import { KINDS } from "../constants/kinds";
import McqSinglePreview from "./previews/McqSinglePreview";
import FibSinglePreview from "./previews/FibSinglePreview";
import ImageChoicePreview from "./previews/ImageChoicePreview";
import MultipleFillInPreview from "./previews/MultipleFillInPreview";
import VerticalCalculationPreview from "./previews/VerticalCalculationPreview";
import ExpressionPreview from "./previews/ExpressionPreview";
import MatchingPairsPreview from "./previews/MatchingPairsPreview";

/**
 * Get preview component for a specific question kind
 * @param {string} kind - Question kind (from KINDS enum)
 * @returns {React.Component|null} Preview component or null
 */
export function getPreviewComponent(kind) {
  const registry = {
    [KINDS.MCQ_SINGLE]: McqSinglePreview,
    [KINDS.FIB_SINGLE]: FibSinglePreview,
    [KINDS.IMAGE_CHOICE]: ImageChoicePreview,
    [KINDS.MULTIPLE_FILL_IN]: MultipleFillInPreview,
    [KINDS.VERTICAL_CALCULATION]: VerticalCalculationPreview,
    [KINDS.EXPRESSION]: ExpressionPreview,
    [KINDS.MATCHING_PAIRS]: MatchingPairsPreview,
  };

  return registry[kind] || null;
}

/**
 * Get preview registry object for a specific question kind
 * This creates the registry object expected by PreviewPanel
 * @param {string} kind - Question kind
 * @returns {{ Preview: React.Component } | null}
 */
export function getPreviewRegistry(kind) {
  const PreviewComponent = getPreviewComponent(kind);

  if (!PreviewComponent) {
    return null;
  }

  return {
    Preview: PreviewComponent,
  };
}

export default {
  getPreviewComponent,
  getPreviewRegistry,
};
