/**
 * QuestionFilters.jsx - Filter bar for question list
 * Enhanced with full hierarchy cascade filtering
 */

import React, { useState, useEffect } from "react";
import "./QuestionFilters.css";
import { KINDS } from "@shared/constants/kinds";
import { hierarchyService } from "@shared/services/hierarchyService";

const QuestionFilters = ({ filters, onFilterChange }) => {
  // Hierarchy options state
  const [hierarchyOptions, setHierarchyOptions] = useState({
    grades: [],
    subjects: [],
    topics: [],
    subtopics: [],
  });

  // Loading states
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

  // Load subjects when grade changes
  useEffect(() => {
    if (filters.gradeId) {
      loadSubjects(filters.gradeId);
    } else {
      setHierarchyOptions((prev) => ({
        ...prev,
        subjects: [],
        topics: [],
        subtopics: [],
      }));
    }
  }, [filters.gradeId]);

  // Load topics when subject changes
  useEffect(() => {
    if (filters.subjectId) {
      loadTopics(filters.subjectId);
    } else {
      setHierarchyOptions((prev) => ({ ...prev, topics: [], subtopics: [] }));
    }
  }, [filters.subjectId]);

  // Load subtopics when topic changes
  useEffect(() => {
    if (filters.topicId) {
      loadSubTopics(filters.topicId);
    } else {
      setHierarchyOptions((prev) => ({ ...prev, subtopics: [] }));
    }
  }, [filters.topicId]);

  // API calls
  const loadGrades = async () => {
    setLoading((prev) => ({ ...prev, grades: true }));
    try {
      const grades = await hierarchyService.getGrades();
      setHierarchyOptions((prev) => ({ ...prev, grades }));
    } catch (error) {
      console.error("Error loading grades:", error);
    } finally {
      setLoading((prev) => ({ ...prev, grades: false }));
    }
  };

  const loadSubjects = async (gradeId) => {
    setLoading((prev) => ({ ...prev, subjects: true }));
    try {
      const subjects = await hierarchyService.getSubjectsByGrade(gradeId);
      setHierarchyOptions((prev) => ({ ...prev, subjects }));
    } catch (error) {
      console.error("Error loading subjects:", error);
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
      setHierarchyOptions((prev) => ({ ...prev, topics }));
    } catch (error) {
      console.error("Error loading topics:", error);
    } finally {
      setLoading((prev) => ({ ...prev, topics: false }));
    }
  };

  const loadSubTopics = async (topicId) => {
    setLoading((prev) => ({ ...prev, subtopics: true }));
    try {
      const subtopics = await hierarchyService.getSubTopicsByTopic(topicId);
      setHierarchyOptions((prev) => ({ ...prev, subtopics }));
    } catch (error) {
      console.error("Error loading subtopics:", error);
    } finally {
      setLoading((prev) => ({ ...prev, subtopics: false }));
    }
  };

  // Event handlers
  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleKindChange = (e) => {
    onFilterChange({ ...filters, kind: e.target.value });
  };

  const handleGradeChange = (e) => {
    const gradeId = e.target.value ? parseInt(e.target.value) : null;
    onFilterChange({
      ...filters,
      gradeId,
      subjectId: null,
      topicId: null,
      subtopicId: null,
    });
  };

  const handleSubjectChange = (e) => {
    const subjectId = e.target.value ? parseInt(e.target.value) : null;
    onFilterChange({
      ...filters,
      subjectId,
      topicId: null,
      subtopicId: null,
    });
  };

  const handleTopicChange = (e) => {
    const topicId = e.target.value ? parseInt(e.target.value) : null;
    onFilterChange({
      ...filters,
      topicId,
      subtopicId: null,
    });
  };

  const handleSubTopicChange = (e) => {
    const subtopicId = e.target.value ? parseInt(e.target.value) : null;
    onFilterChange({
      ...filters,
      subtopicId,
    });
  };

  const handleResetFilters = () => {
    onFilterChange({
      search: "",
      kind: "",
      gradeId: null,
      subjectId: null,
      topicId: null,
      subtopicId: null,
    });
  };

  // Check if any filter is active
  const hasActiveFilters =
    filters.search ||
    filters.kind ||
    filters.gradeId ||
    filters.subjectId ||
    filters.topicId ||
    filters.subtopicId;

  return (
    <div className="question-filters">
      {/* Search and Kind Filter Row */}
      <div className="filters-row">
        <div className="filters-left">
          <div className="filter-group">
            <span className="filter-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm theo nội dung câu hỏi..."
              value={filters.search || ""}
              onChange={handleSearchChange}
              className="filter-search"
            />
          </div>

          <div className="filter-group">
            <span className="filter-icon">🏷️</span>
            <select
              value={filters.kind || ""}
              onChange={handleKindChange}
              className="filter-select"
            >
              <option value="">Tất cả loại câu hỏi</option>
              <option value={KINDS.MCQ_SINGLE}>Trắc nghiệm</option>
              <option value={KINDS.FIB_SINGLE}>Điền chỗ trống</option>
              <option value={KINDS.IMAGE_CHOICE}>Chọn hình ảnh</option>
              <option value={KINDS.MULTIPLE_FILL_IN}>Điền nhiều chỗ</option>
              <option value={KINDS.VERTICAL_CALCULATION}>Tính toán dọc</option>
              <option value={KINDS.EXPRESSION}>Biểu thức</option>
              <option value={KINDS.MATCHING_PAIRS}>Nối cặp</option>
            </select>
          </div>
        </div>

        <div className="filters-right">
          {hasActiveFilters && (
            <button className="btn-reset-filters" onClick={handleResetFilters}>
              ✕ Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Hierarchy Cascade Filter Row */}
      <div className="filters-row hierarchy-filters">
        <div className="hierarchy-label">
          <span className="label-text">Lọc theo phân cấp:</span>
        </div>

        <div className="hierarchy-selects">
          {/* Grade */}
          <div className="filter-group hierarchy-item">
            <select
              value={filters.gradeId || ""}
              onChange={handleGradeChange}
              className="filter-select"
              disabled={loading.grades}
            >
              <option value="">
                {loading.grades ? "Đang tải..." : "Chọn khối lớp"}
              </option>
              {hierarchyOptions.grades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.gradeName}
                </option>
              ))}
            </select>
          </div>

          <span className="hierarchy-arrow">→</span>

          {/* Subject */}
          <div className="filter-group hierarchy-item">
            <select
              value={filters.subjectId || ""}
              onChange={handleSubjectChange}
              className="filter-select"
              disabled={!filters.gradeId || loading.subjects}
            >
              <option value="">
                {!filters.gradeId
                  ? "Chọn khối trước"
                  : loading.subjects
                  ? "Đang tải..."
                  : "Chọn môn học"}
              </option>
              {hierarchyOptions.subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subjectGradeName}
                </option>
              ))}
            </select>
          </div>

          <span className="hierarchy-arrow">→</span>

          {/* Topic */}
          <div className="filter-group hierarchy-item">
            <select
              value={filters.topicId || ""}
              onChange={handleTopicChange}
              className="filter-select"
              disabled={!filters.subjectId || loading.topics}
            >
              <option value="">
                {!filters.subjectId
                  ? "Chọn môn trước"
                  : loading.topics
                  ? "Đang tải..."
                  : "Chọn chủ đề"}
              </option>
              {hierarchyOptions.topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.topicTitle}
                </option>
              ))}
            </select>
          </div>

          <span className="hierarchy-arrow">→</span>

          {/* SubTopic */}
          <div className="filter-group hierarchy-item">
            <select
              value={filters.subtopicId || ""}
              onChange={handleSubTopicChange}
              className="filter-select"
              disabled={!filters.topicId || loading.subtopics}
            >
              <option value="">
                {!filters.topicId
                  ? "Chọn chủ đề trước"
                  : loading.subtopics
                  ? "Đang tải..."
                  : "Chọn chủ đề con"}
              </option>
              {hierarchyOptions.subtopics.map((subtopic) => (
                <option key={subtopic.id} value={subtopic.id}>
                  {subtopic.subTopicTitle}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionFilters;
