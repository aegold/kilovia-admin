import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { KINDS } from "@shared/constants/kinds";
import McqSingleEditor from "./McqSingleEditor";
import FibSingleEditor from "./FibSingleEditor";
import ImageChoiceEditor from "./ImageChoiceEditor";
import MultipleFillInEditor from "./MultipleFillInEditor";
import VerticalCalculationEditor from "./VerticalCalculationEditor";
import ExpressionEditor from "./ExpressionEditor";
import MatchingPairsEditor from "./MatchingPairsEditor";
import PreviewPanel from "../panels/PreviewPanel";
import JsonPanel from "../panels/JsonPanel";
import { saveDraft } from "../store/drafts";
import { hierarchyService } from "@shared/services/hierarchyService";
import KindPicker from "../components/KindPicker";
import { getPreviewRegistry } from "@shared/components/previewRegistry";

/**
 * Map frontend kind to backend question_type_id
 * TODO: Fetch this mapping from backend API /api/question-types
 */
const getQuestionTypeId = (kind) => {
  const QUESTION_TYPE_MAPPING = {
    [KINDS.MCQ_SINGLE]: 1,
    [KINDS.FIB_SINGLE]: 2,
    [KINDS.IMAGE_CHOICE]: 3,
    [KINDS.MULTIPLE_FILL_IN]: 4,
    [KINDS.VERTICAL_CALCULATION]: 5,
    [KINDS.EXPRESSION]: 6,
    [KINDS.MATCHING_PAIRS]: 7,
  };
  return QUESTION_TYPE_MAPPING[kind] || 1; // Default to MCQ if unknown
};

export default function QuestionEditorShell({
  kind: controlledKind,
  onKindChange,
  showKindPicker = true,
  onBack,
  hierarchy = null, // { grade, subject, topic, subtopic }
  isEditMode = false,
  editingQuestionId = null,
  initialEnvelope = null,
}) {
  const navigate = useNavigate();
  const [uncontrolledKind, setUncontrolledKind] = useState(KINDS.MCQ_SINGLE);
  const kind = controlledKind || uncontrolledKind;
  const [envelope, setEnvelope] = useState(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load initial envelope in edit mode
  useEffect(() => {
    if (isEditMode && initialEnvelope) {
      setEnvelope(initialEnvelope);
    }
  }, [isEditMode, initialEnvelope]);

  const EditorComponent = useMemo(() => {
    switch (kind) {
      case KINDS.MCQ_SINGLE:
        return McqSingleEditor;
      case KINDS.FIB_SINGLE:
        return FibSingleEditor;
      case KINDS.IMAGE_CHOICE:
        return ImageChoiceEditor;
      case KINDS.MULTIPLE_FILL_IN:
        return MultipleFillInEditor;
      case KINDS.VERTICAL_CALCULATION:
        return VerticalCalculationEditor;
      case KINDS.EXPRESSION:
        return ExpressionEditor;
      case KINDS.MATCHING_PAIRS:
        return MatchingPairsEditor;
      default:
        return () => <div>Chưa hỗ trợ</div>;
    }
  }, [kind]);

  const handleEnvelopeChange = (env) => {
    setEnvelope(env);
  };

  const handleSave = async (env) => {
    // Save locally as draft first (if not in edit mode)
    if (!isEditMode) {
      saveDraft({
        id: env?.meta?.id,
        envelope: env,
        kind: env.kind,
        prompt: env.prompt,
      });
    }

    // If we have hierarchy, save/update to backend
    if (hierarchy && hierarchy.subtopic) {
      setIsSaving(true);
      const actionText = isEditMode ? "Updating" : "Saving";
      console.log(`📦 ${actionText} question with hierarchy:`, {
        isEditMode,
        questionId: editingQuestionId,
        subTopicId: hierarchy.subtopic.id,
        questionType: kind,
        hierarchy_metadata: {
          grade: hierarchy.grade.gradeName,
          subject: hierarchy.subject.subjectGradeName,
          topic: hierarchy.topic.topicTitle,
          subtopic: hierarchy.subtopic.subTopicTitle,
        },
        payload: env,
      });
      try {
        // Extract first image URL from media array
        const questionImage =
          env.media && env.media.length > 0 ? env.media[0].url : null;

        // Build complete question detail object (full envelope)
        const questionDetail = {
          version: env.version || 1,
          kind: env.kind || kind,
          prompt: env.prompt || "",
          media: env.media || [],
          detail: env.detail || {},
          blocks: env.blocks || [],
          variables: env.variables || {},
          answers: env.answers || [],
          explanation: env.explanation || "",
          hints: env.hints || [],
          scoring: env.scoring || {
            full_points: 1,
            partial_points: 0,
            penalty: 0,
          },
          meta: {
            ...env.meta,
            hierarchy: {
              gradeId: hierarchy.grade.id,
              gradeName: hierarchy.grade.gradeName,
              subjectId: hierarchy.subject.id,
              subjectName: hierarchy.subject.subjectGradeName,
              topicId: hierarchy.topic.id,
              topicTitle: hierarchy.topic.topicTitle,
              subtopicId: hierarchy.subtopic.id,
              subtopicTitle: hierarchy.subtopic.subTopicTitle,
            },
          },
        };

        // Build API payload matching database schema
        const questionData = {
          subTopicId: hierarchy.subtopic.id,
          questionTypeId: getQuestionTypeId(kind),
          questionTitle: env.prompt || "",
          questionImage: questionImage,
          questionDetail: questionDetail,
        };

        console.log(
          `🚀 Sending to API (${isEditMode ? "UPDATE" : "CREATE"}):`,
          questionData
        );

        if (isEditMode) {
          // Update existing question
          await hierarchyService.updateQuestion(
            editingQuestionId,
            questionData
          );
          console.log("✅ Update successful!");
          setMessage(`✅ Đã cập nhật câu hỏi #${editingQuestionId}`);

          // Navigate back to question list after 1.5s
          setTimeout(() => {
            navigate("/quan-ly-cau-hoi");
          }, 1500);
        } else {
          // Create new question
          await hierarchyService.saveQuestion(questionData);
          console.log("✅ Save successful!");
          setMessage(
            `✅ Đã lưu câu hỏi vào "${hierarchy.subtopic.subTopicTitle}"`
          );
        }

        setEnvelope(env);
      } catch (error) {
        console.error(
          `❌ Error ${isEditMode ? "updating" : "saving"} question:`,
          error
        );
        setMessage(
          `❌ Lỗi khi ${isEditMode ? "cập nhật" : "lưu"}: ${error.message}`
        );
      } finally {
        setIsSaving(false);
      }
    } else if (!isEditMode) {
      // No hierarchy, just save locally (only in create mode)
      const saved = saveDraft({
        id: env?.meta?.id,
        envelope: env,
        kind: env.kind,
        prompt: env.prompt,
      });
      console.log("💾 Saving draft only (no hierarchy):", saved);
      setMessage(`💾 Đã lưu nháp #${saved.id} (chưa có phân loại)`);
      setEnvelope(env);
    }

    if (!isEditMode) {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleImport = (env) => {
    setEnvelope(env);
    setMessage("Đã nạp JSON hợp lệ");
    setTimeout(() => setMessage(""), 1200);
  };

  const handleSetKind = (k) => {
    if (onKindChange) onKindChange(k);
    else setUncontrolledKind(k);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-3">
        {/* Action buttons row */}
        <div className="flex items-center justify-between gap-2">
          {onBack && (
            <button
              type="button"
              className="px-3 py-1 border rounded bg-green-500 text-white hover:bg-green-600"
              onClick={onBack}
            >
              ← Quay lại
            </button>
          )}

          <button
            type="button"
            className={`px-4 py-1 border rounded bg-blue-500 text-white hover:bg-blue-600 ${
              isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => {
              try {
                const env = envelope;
                if (env) {
                  handleSave(env);
                } else {
                  setMessage("⚠️ Vui lòng nhập đầy đủ thông tin câu hỏi");
                  setTimeout(() => setMessage(""), 2000);
                }
              } catch (error) {
                setMessage("❌ Lỗi: " + error.message);
                setTimeout(() => setMessage(""), 2000);
              }
            }}
            disabled={isSaving || !envelope}
          >
            {isSaving
              ? isEditMode
                ? "⏳ Đang cập nhật..."
                : "⏳ Đang lưu..."
              : isEditMode
              ? "💾 Cập nhật câu hỏi"
              : "💾 Lưu câu hỏi"}
          </button>
        </div>

        {message && (
          <div
            className={`text-sm p-2 rounded ${
              message.includes("❌")
                ? "bg-red-50 text-red-700"
                : message.includes("⚠️")
                ? "bg-yellow-50 text-yellow-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        {showKindPicker && (
          <div className="space-y-2">
            <div className="text-sm">Chọn dạng câu hỏi</div>
            <KindPicker value={kind} onChange={handleSetKind} />
          </div>
        )}

        <div className="border rounded p-3">
          <EditorComponent
            onEnvelopeChange={handleEnvelopeChange}
            onSave={handleSave}
            hierarchy={hierarchy}
            isSaving={isSaving}
            initialEnvelope={initialEnvelope}
          />
        </div>

        <div className="border rounded p-3">
          <JsonPanel
            currentKind={kind}
            onImportValid={handleImport}
            envelope={envelope}
          />
        </div>
      </div>

      <div className="border rounded p-3">
        <PreviewPanel envelope={envelope} registry={getPreviewRegistry(kind)} />
      </div>
    </div>
  );
}
