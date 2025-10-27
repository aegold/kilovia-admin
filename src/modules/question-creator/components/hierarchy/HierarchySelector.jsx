/**
 * HierarchySelector - Cascade dropdown selector for hierarchy
 * Grade → Subject → Topic → SubTopic
 */

import React, { useState, useEffect } from "react";
import { hierarchyService } from "@shared/services/hierarchyService";
import "../../styles/HierarchySelector.css";

const HierarchySelector = ({ onComplete, onCancel }) => {
  const [hierarchy, setHierarchy] = useState({
    grade: null,
    subject: null,
    topic: null,
    subtopic: null,
  });

  const [options, setOptions] = useState({
    grades: [],
    subjects: [],
    topics: [],
    subtopics: [],
  });

  const [loading, setLoading] = useState({
    grades: false,
    subjects: false,
    topics: false,
    subtopics: false,
  });

  // Load grades on mount
  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    setLoading((prev) => ({ ...prev, grades: true }));
    try {
      const grades = await hierarchyService.getGrades();
      setOptions((prev) => ({ ...prev, grades }));
    } catch (error) {
      console.error("Error loading grades:", error);
      alert("Không thể tải danh sách khối lớp");
    } finally {
      setLoading((prev) => ({ ...prev, grades: false }));
    }
  };

  const loadSubjects = async (gradeId) => {
    setLoading((prev) => ({ ...prev, subjects: true }));
    try {
      const subjects = await hierarchyService.getSubjectsByGrade(gradeId);
      setOptions((prev) => ({ ...prev, subjects }));
    } catch (error) {
      console.error("Error loading subjects:", error);
      alert("Không thể tải danh sách môn học");
    } finally {
      setLoading((prev) => ({ ...prev, subjects: false }));
    }
  };

  const loadTopics = async (subjectGradeId) => {
    setLoading((prev) => ({ ...prev, topics: true }));
    try {
      const topics = await hierarchyService.getTopicsBySubjectGrade(
        subjectGradeId
      );
      setOptions((prev) => ({ ...prev, topics }));
    } catch (error) {
      console.error("Error loading topics:", error);
      alert("Không thể tải danh sách chủ đề");
    } finally {
      setLoading((prev) => ({ ...prev, topics: false }));
    }
  };

  const loadSubTopics = async (topicId) => {
    setLoading((prev) => ({ ...prev, subtopics: true }));
    try {
      const subtopics = await hierarchyService.getSubTopicsByTopic(topicId);
      setOptions((prev) => ({ ...prev, subtopics }));
    } catch (error) {
      console.error("Error loading subtopics:", error);
      alert("Không thể tải danh sách chủ đề con");
    } finally {
      setLoading((prev) => ({ ...prev, subtopics: false }));
    }
  };

  const handleGradeChange = (e) => {
    const gradeId = parseInt(e.target.value);
    const grade = options.grades.find((g) => g.id === gradeId);

    setHierarchy({
      grade,
      subject: null,
      topic: null,
      subtopic: null,
    });

    setOptions((prev) => ({
      ...prev,
      subjects: [],
      topics: [],
      subtopics: [],
    }));

    if (grade) {
      loadSubjects(gradeId);
    }
  };

  const handleSubjectChange = (e) => {
    const subjectId = parseInt(e.target.value);
    const subject = options.subjects.find((s) => s.id === subjectId);

    setHierarchy((prev) => ({
      ...prev,
      subject,
      topic: null,
      subtopic: null,
    }));

    setOptions((prev) => ({
      ...prev,
      topics: [],
      subtopics: [],
    }));

    if (subject) {
      loadTopics(subject.id);
    }
  };

  const handleTopicChange = (e) => {
    const topicId = parseInt(e.target.value);
    const topic = options.topics.find((t) => t.id === topicId);

    setHierarchy((prev) => ({
      ...prev,
      topic,
      subtopic: null,
    }));

    setOptions((prev) => ({
      ...prev,
      subtopics: [],
    }));

    if (topic) {
      loadSubTopics(topicId);
    }
  };

  const handleSubTopicChange = (e) => {
    const subtopicId = parseInt(e.target.value);
    const subtopic = options.subtopics.find((st) => st.id === subtopicId);

    setHierarchy((prev) => ({
      ...prev,
      subtopic,
    }));
  };

  const handleSubmit = () => {
    if (!hierarchy.subtopic) {
      alert("Vui lòng chọn đầy đủ: Khối lớp → Môn học → Chủ đề → Bài học");
      return;
    }

    onComplete(hierarchy);
  };

  const isComplete = hierarchy.subtopic !== null;

  return (
    <div className="hierarchy-selector">
      <div className="hierarchy-selector-content">
        <h2 className="hierarchy-selector-title">Phân loại câu hỏi</h2>
        <p className="hierarchy-selector-description">
          Chọn vị trí của câu hỏi trong chương trình học
        </p>

        <div className="hierarchy-form">
          {/* Grade Selector */}
          <div className="hierarchy-field">
            <label className="hierarchy-label">
              Khối lớp <span className="required">*</span>
            </label>
            <select
              className="hierarchy-select"
              value={hierarchy.grade?.id || ""}
              onChange={handleGradeChange}
              disabled={loading.grades}
            >
              <option value="">-- Chọn khối lớp --</option>
              {options.grades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.gradeName}
                </option>
              ))}
            </select>
            {loading.grades && (
              <span className="loading-text">Đang tải...</span>
            )}
          </div>

          {/* Subject Selector */}
          <div className="hierarchy-field">
            <label className="hierarchy-label">
              Môn học <span className="required">*</span>
            </label>
            <select
              className="hierarchy-select"
              value={hierarchy.subject?.id || ""}
              onChange={handleSubjectChange}
              disabled={!hierarchy.grade || loading.subjects}
            >
              <option value="">-- Chọn môn học --</option>
              {options.subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subjectGradeName}
                </option>
              ))}
            </select>
            {loading.subjects && (
              <span className="loading-text">Đang tải...</span>
            )}
          </div>

          {/* Topic Selector */}
          <div className="hierarchy-field">
            <label className="hierarchy-label">
              Chủ đề <span className="required">*</span>
            </label>
            <select
              className="hierarchy-select"
              value={hierarchy.topic?.id || ""}
              onChange={handleTopicChange}
              disabled={!hierarchy.subject || loading.topics}
            >
              <option value="">-- Chọn chủ đề --</option>
              {options.topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.topicTitle}
                </option>
              ))}
            </select>
            {loading.topics && (
              <span className="loading-text">Đang tải...</span>
            )}
          </div>

          {/* SubTopic Selector */}
          <div className="hierarchy-field">
            <label className="hierarchy-label">
              Bài học <span className="required">*</span>
            </label>
            <select
              className="hierarchy-select"
              value={hierarchy.subtopic?.id || ""}
              onChange={handleSubTopicChange}
              disabled={!hierarchy.topic || loading.subtopics}
            >
              <option value="">-- Chọn bài học --</option>
              {options.subtopics.map((subtopic) => (
                <option key={subtopic.id} value={subtopic.id}>
                  {subtopic.subTopicTitle}
                </option>
              ))}
            </select>
            {loading.subtopics && (
              <span className="loading-text">Đang tải...</span>
            )}
          </div>

          {/* Summary */}
          {isComplete && (
            <div className="hierarchy-summary">
              <h4>Đã chọn:</h4>
              <div className="hierarchy-path">
                <span className="path-item">{hierarchy.grade.gradeName}</span>
                <span className="path-separator">→</span>
                <span className="path-item">
                  {hierarchy.subject.subjectGradeName}
                </span>
                <span className="path-separator">→</span>
                <span className="path-item">{hierarchy.topic.topicTitle}</span>
                <span className="path-separator">→</span>
                <span className="path-item">
                  {hierarchy.subtopic.subTopicTitle}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="hierarchy-actions">
            <button
              type="button"
              className="qlbt-btn qlbt-btn-secondary"
              onClick={onCancel}
            >
              ← Quay lại
            </button>
            <button
              type="button"
              className="qlbt-btn qlbt-btn-primary"
              onClick={handleSubmit}
              disabled={!isComplete}
            >
              Tiếp tục →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HierarchySelector;
