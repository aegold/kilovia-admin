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
import {
  processEnvelopeImages,
  hasImagesToUpload,
  countTotalImages,
} from "@shared/utils/imageUploadHelper";

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
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  });

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
    // ✅ Phase 1 Fix: Validate hierarchy completeness
    if (!hierarchy || !hierarchy.subtopic) {
      setMessage("⚠️ Vui lòng chọn đầy đủ: Khối → Môn → Chủ đề → Chủ đề con");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

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

      try {
        // 🆕 STEP 1: Check if envelope has images to upload
        const imageCount = countTotalImages(env);
        const needsUpload = hasImagesToUpload(env);

        console.log(`📦 ${actionText} question with hierarchy:`, {
          isEditMode,
          questionId: editingQuestionId,
          subTopicId: hierarchy.subtopic.id,
          questionType: kind,
          totalImages: imageCount,
          needsUpload: needsUpload,
          hierarchy_metadata: {
            grade: hierarchy.grade.gradeName,
            subject: hierarchy.subject.subjectGradeName,
            topic: hierarchy.topic.topicTitle,
            subtopic: hierarchy.subtopic.subTopicTitle,
          },
        });

        // 🆕 STEP 2: Upload images if needed
        let processedEnvelope = env;

        if (needsUpload) {
          setMessage("📤 Đang upload ảnh...");

          try {
            processedEnvelope = await processEnvelopeImages(
              env,
              (current, total) => {
                setUploadProgress({ current, total });
                setMessage(`📤 Đang upload ảnh ${current}/${total}...`);
              }
            );

            setMessage("✅ Upload ảnh thành công!");
            console.log(
              "✅ All images uploaded, envelope updated:",
              processedEnvelope
            );
          } catch (uploadError) {
            console.error("❌ Image upload failed:", uploadError);
            setMessage(`❌ Lỗi upload ảnh: ${uploadError.message}`);
            setIsSaving(false);
            setTimeout(() => setMessage(""), 5000);
            return;
          }
        }

        // 🆕 STEP 3: Extract first image URL from processed envelope
        const questionImage =
          processedEnvelope.media && processedEnvelope.media.length > 0
            ? processedEnvelope.media[0].url
            : null;

        // Build complete question detail object
        const questionDetail = {
          version: processedEnvelope.version || 1,
          kind: processedEnvelope.kind || kind,
          prompt: processedEnvelope.prompt || "",
          media: processedEnvelope.media || [],
          detail: processedEnvelope.detail || {},

          // ✅ Include questionTitle if present
          ...(processedEnvelope.questionTitle && {
            questionTitle: processedEnvelope.questionTitle,
          }),

          // ✅ Only include explanation if not empty
          ...(processedEnvelope.explanation && {
            explanation: processedEnvelope.explanation,
          }),

          // ✅ Scoring always included
          scoring: processedEnvelope.scoring || {
            full_points: 1,
            partial_points: 0,
            penalty: 0,
          },

          meta: {
            ...processedEnvelope.meta,
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
          questionTitle:
            processedEnvelope.questionTitle || "Thực hiện bài toán sau:",
          questionImage: questionImage,
          questionDetail: questionDetail,
        };

        console.log(
          `🚀 Sending to API (${isEditMode ? "UPDATE" : "CREATE"}):`,
          questionData
        );

        if (isEditMode) {
          // Update existing question
          setMessage("💾 Đang cập nhật câu hỏi...");
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
          setMessage("💾 Đang lưu câu hỏi...");
          await hierarchyService.saveQuestion(questionData);
          console.log("✅ Save successful!");
          setMessage(
            `✅ Đã lưu câu hỏi vào "${hierarchy.subtopic.subTopicTitle}"`
          );
        }

        setEnvelope(processedEnvelope);
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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1.5rem",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Action buttons row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
          }}
        >
          {onBack && (
            <button
              type="button"
              className="qlbt-back-btn-inline"
              onClick={onBack}
            >
              ← Quay lại
            </button>
          )}

          <button
            type="button"
            className="qlbt-save-btn-inline"
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
            disabled={
              isSaving || !envelope || !hierarchy || !hierarchy.subtopic
            }
            title={
              !hierarchy || !hierarchy.subtopic
                ? "Vui lòng chọn đầy đủ: Khối → Môn → Chủ đề → Chủ đề con"
                : isSaving
                ? "Đang xử lý..."
                : "Lưu câu hỏi vào hệ thống"
            }
            style={{
              opacity:
                isSaving || !envelope || !hierarchy || !hierarchy.subtopic
                  ? 0.6
                  : 1,
              cursor:
                isSaving || !envelope || !hierarchy || !hierarchy.subtopic
                  ? "not-allowed"
                  : "pointer",
            }}
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
            style={{
              fontSize: "0.875rem",
              padding: "0.75rem",
              borderRadius: "8px",
              backgroundColor: message.includes("❌")
                ? "#fef2f2"
                : message.includes("⚠️")
                ? "#fefce8"
                : message.includes("📤")
                ? "#eff6ff"
                : "#f0fdf4",
              color: message.includes("❌")
                ? "#991b1b"
                : message.includes("⚠️")
                ? "#854d0e"
                : message.includes("📤")
                ? "#1e40af"
                : "#166534",
              border: message.includes("❌")
                ? "1px solid #fecaca"
                : message.includes("⚠️")
                ? "1px solid #fef08a"
                : message.includes("📤")
                ? "1px solid #bfdbfe"
                : "1px solid #bbf7d0",
            }}
          >
            {message}
            {uploadProgress.total > 0 && message.includes("📤") && (
              <div
                style={{
                  marginTop: "0.5rem",
                  height: "4px",
                  backgroundColor: "#dbeafe",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    backgroundColor: "#3b82f6",
                    width: `${
                      (uploadProgress.current / uploadProgress.total) * 100
                    }%`,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            )}
          </div>
        )}

        {showKindPicker && (
          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                fontSize: "0.875rem",
                marginBottom: "0.5rem",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Chọn dạng câu hỏi
            </div>
            <KindPicker value={kind} onChange={handleSetKind} />
          </div>
        )}

        <div
          style={{
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            padding: "1rem",
          }}
        >
          <EditorComponent
            onEnvelopeChange={handleEnvelopeChange}
            onSave={handleSave}
            hierarchy={hierarchy}
            isSaving={isSaving}
            initialEnvelope={initialEnvelope}
          />
        </div>

        <div
          style={{
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
            padding: "1rem",
          }}
        >
          <JsonPanel
            currentKind={kind}
            onImportValid={handleImport}
            envelope={envelope}
          />
        </div>
      </div>

      <div
        style={{
          border: "2px solid #e5e7eb",
          borderRadius: "12px",
          padding: "1rem",
        }}
      >
        <PreviewPanel envelope={envelope} registry={getPreviewRegistry(kind)} />
      </div>
    </div>
  );
}
