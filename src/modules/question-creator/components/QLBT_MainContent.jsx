/**
 * QLBT_MainContent - Main content area for QuanLyBaiTap
 *
 * 🚨 UPDATED - Three-screen flow with hierarchy selection + Edit Mode Support
 * Flow: KindPicker → HierarchySelector → Editor with Breadcrumbs
 * Edit Mode: Directly to Editor with pre-loaded data
 */

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QuestionEditorShell from "../editors/QuestionEditorShell";
import KindPicker from "./KindPicker";
import HierarchySelector from "./hierarchy/HierarchySelector";
import { KINDS } from "@shared/constants/kinds";

const QLBT_MainContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editQuestion = location.state?.editQuestion;

  const [selectedKind, setSelectedKind] = useState(null);
  const [hierarchy, setHierarchy] = useState(null);
  const [currentScreen, setCurrentScreen] = useState("kindPicker");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [initialEnvelope, setInitialEnvelope] = useState(null);

  // Handle edit mode on mount
  useEffect(() => {
    if (editQuestion) {
      // Set edit mode
      setIsEditMode(true);
      setEditingQuestionId(editQuestion.id);

      // Load envelope
      setInitialEnvelope(editQuestion.envelope);

      // Set kind
      const kind = editQuestion.envelope?.kind || KINDS.MCQ_SINGLE;
      setSelectedKind(kind);

      // Load hierarchy from meta
      const hierarchyMeta = editQuestion.meta?.hierarchy;
      if (hierarchyMeta) {
        setHierarchy({
          grade: {
            id: hierarchyMeta.gradeId,
            gradeName: hierarchyMeta.gradeName,
          },
          subject: {
            id: hierarchyMeta.subjectId,
            subjectGradeName: hierarchyMeta.subjectName,
          },
          topic: {
            id: hierarchyMeta.topicId,
            topicTitle: hierarchyMeta.topicTitle,
          },
          subtopic: {
            id: hierarchyMeta.subtopicId,
            subTopicTitle: hierarchyMeta.subtopicTitle,
          },
        });
      }

      // Go directly to editor
      setCurrentScreen("editor");

      // Clear location state to prevent re-triggering
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [editQuestion, location.pathname, navigate]);

  const handleKindSelect = (kind) => {
    setSelectedKind(kind);
    setCurrentScreen("hierarchy");
  };

  const handleHierarchyComplete = (selectedHierarchy) => {
    setHierarchy(selectedHierarchy);
    setCurrentScreen("editor");
  };

  const handleBackToKindPicker = () => {
    setCurrentScreen("kindPicker");
    setSelectedKind(null);
    setHierarchy(null);
    setIsEditMode(false);
    setEditingQuestionId(null);
    setInitialEnvelope(null);
  };

  const handleBackToHierarchy = () => {
    if (isEditMode) {
      // In edit mode, go back to question list
      navigate("/quan-ly-cau-hoi");
    } else {
      setCurrentScreen("hierarchy");
      setHierarchy(null);
    }
  };

  const renderKindPickerScreen = () => (
    <div className="qlbt-welcome">
      <div className="qlbt-welcome-content">
        <h2 className="qlbt-welcome-title">Chọn Dạng Câu Hỏi</h2>
        <p className="qlbt-welcome-description">
          Chọn loại câu hỏi bạn muốn tạo
        </p>

        <KindPicker
          value={selectedKind || KINDS.MCQ_SINGLE}
          onChange={handleKindSelect}
        />
      </div>
    </div>
  );

  const renderHierarchyScreen = () => (
    <HierarchySelector
      onComplete={handleHierarchyComplete}
      onCancel={handleBackToKindPicker}
    />
  );

  const renderEditorScreen = () => (
    <div className="qlbt-template-container">
      {/* Edit Mode Badge */}
      {isEditMode && (
        <div className="qlbt-edit-mode-badge">
          ✏️ Chỉnh sửa câu hỏi #{editingQuestionId}
        </div>
      )}

      {/* Breadcrumb */}
      {hierarchy && (
        <div className="qlbt-breadcrumb">
          <span className="breadcrumb-item">{hierarchy.grade.gradeName}</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item">
            {hierarchy.subject.subjectGradeName}
          </span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item">{hierarchy.topic.topicTitle}</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item">
            {hierarchy.subtopic.subTopicTitle}
          </span>
        </div>
      )}

      <QuestionEditorShell
        kind={selectedKind || KINDS.MCQ_SINGLE}
        hierarchy={hierarchy}
        showKindPicker={false}
        onBack={handleBackToHierarchy}
        isEditMode={isEditMode}
        editingQuestionId={editingQuestionId}
        initialEnvelope={initialEnvelope}
      />
    </div>
  );

  return (
    <div className="qlbt-main-content-area">
      {currentScreen === "kindPicker" && renderKindPickerScreen()}
      {currentScreen === "hierarchy" && renderHierarchyScreen()}
      {currentScreen === "editor" && renderEditorScreen()}
    </div>
  );
};

export default QLBT_MainContent;
