/**
 * TopicPanel - Left panel for Topics management
 * Displays topics with filters and CRUD operations
 */

import React, { useState, useEffect } from "react";
import { hierarchyService } from "@shared/services/hierarchyService";
import { topicService } from "../../services/topicService";
import TopicModal from "./TopicModal";

const TopicPanel = ({
  filters,
  onFilterChange,
  selectedTopic,
  onTopicSelect,
  refreshTrigger,
  onDataChange,
}) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);

  // Grade and Subject options for filters
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Load grades on mount
  useEffect(() => {
    loadGrades();
  }, []);

  // Load subjects when grade changes
  useEffect(() => {
    if (filters.gradeId) {
      loadSubjects(filters.gradeId);
    } else {
      setSubjects([]);
    }
  }, [filters.gradeId]);

  // Load topics when subject-grade changes
  useEffect(() => {
    if (filters.subjectGradeId) {
      loadTopics();
    } else {
      setTopics([]);
    }
  }, [filters.subjectGradeId, refreshTrigger]);

  const loadGrades = async () => {
    try {
      const data = await hierarchyService.getGrades();
      setGrades(data);
    } catch (error) {
      console.error("Error loading grades:", error);
    }
  };

  const loadSubjects = async (gradeId) => {
    try {
      const data = await hierarchyService.getSubjectsByGrade(gradeId);
      setSubjects(data);
    } catch (error) {
      console.error("Error loading subjects:", error);
    }
  };

  const loadTopics = async () => {
    setLoading(true);
    try {
      const data = await topicService.getTopicsBySubjectGrade(
        filters.subjectGradeId
      );
      setTopics(data);
    } catch (error) {
      console.error("Error loading topics:", error);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (e) => {
    const gradeId = e.target.value ? parseInt(e.target.value) : null;
    onFilterChange({
      gradeId,
      subjectGradeId: null,
    });
  };

  const handleSubjectChange = (e) => {
    const subjectGradeId = e.target.value ? parseInt(e.target.value) : null;
    onFilterChange({
      ...filters,
      subjectGradeId,
    });
  };

  const handleAddNew = () => {
    setEditingTopic(null);
    setShowModal(true);
  };

  const handleEdit = (topic) => {
    setEditingTopic(topic);
    setShowModal(true);
  };

  const handleDelete = async (topic) => {
    if (
      !window.confirm(
        `Bạn có chắc muốn xóa chủ đề "${topic.topicTitle}"?\n\nLưu ý: Các chủ đề con và câu hỏi liên quan cũng sẽ bị xóa!`
      )
    ) {
      return;
    }

    try {
      await topicService.deleteTopic(topic.id);
      onDataChange();
      if (selectedTopic?.id === topic.id) {
        onTopicSelect(null);
      }
    } catch (error) {
      alert("Có lỗi khi xóa chủ đề!");
      console.error(error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingTopic(null);
  };

  const handleModalSuccess = () => {
    setShowModal(false);
    setEditingTopic(null);
    onDataChange();
  };

  // Filter topics by search term
  const filteredTopics = topics.filter((topic) =>
    topic.topicTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="qlcd-panel qlcd-topic-panel">
      {/* Panel Header */}
      <div className="qlcd-panel-header">
        <h2 className="qlcd-panel-title">📚 Danh Sách Chủ Đề (Topics)</h2>
        <p className="qlcd-panel-subtitle">
          Chọn khối lớp và môn học để xem chủ đề
        </p>
      </div>

      {/* Panel Content */}
      <div className="qlcd-panel-content">
        {/* Filters */}
        <div className="qlcd-filters">
          <div className="qlcd-filter-row">
            <div className="qlcd-filter-group">
              <label className="qlcd-filter-label">Khối lớp:</label>
              <select
                className="qlcd-filter-select"
                value={filters.gradeId || ""}
                onChange={handleGradeChange}
              >
                <option value="">-- Chọn khối lớp --</option>
                {grades.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    {grade.gradeName}
                  </option>
                ))}
              </select>
            </div>

            <div className="qlcd-filter-group">
              <label className="qlcd-filter-label">Môn học:</label>
              <select
                className="qlcd-filter-select"
                value={filters.subjectGradeId || ""}
                onChange={handleSubjectChange}
                disabled={!filters.gradeId}
              >
                <option value="">-- Chọn môn học --</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subjectGradeName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filters.subjectGradeId && (
            <div className="qlcd-filter-row">
              <input
                type="text"
                className="qlcd-search-input"
                placeholder="Tìm kiếm chủ đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Topics List */}
        {loading ? (
          <div className="qlcd-loading">
            <div className="qlcd-loading-spinner"></div>
            <p>Đang tải...</p>
          </div>
        ) : !filters.subjectGradeId ? (
          <div className="qlcd-empty-state">
            <div className="qlcd-empty-icon">📚</div>
            <h3 className="qlcd-empty-title">Chọn Môn Học</h3>
            <p className="qlcd-empty-text">
              Vui lòng chọn khối lớp và môn học để xem danh sách chủ đề
            </p>
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="qlcd-empty-state">
            <div className="qlcd-empty-icon">📭</div>
            <h3 className="qlcd-empty-title">Chưa Có Chủ Đề</h3>
            <p className="qlcd-empty-text">
              {searchTerm
                ? "Không tìm thấy chủ đề phù hợp"
                : "Môn học này chưa có chủ đề nào"}
            </p>
          </div>
        ) : (
          <div className="qlcd-table-container">
            <table className="qlcd-table">
              <thead>
                <tr>
                  <th className="qlcd-table-id">ID</th>
                  <th>Tên Chủ Đề</th>
                  <th className="qlcd-table-actions">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredTopics.map((topic) => (
                  <tr
                    key={topic.id}
                    className={selectedTopic?.id === topic.id ? "selected" : ""}
                    onClick={() => onTopicSelect(topic)}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="qlcd-table-id">{topic.id}</td>
                    <td className="qlcd-table-name">{topic.topicTitle}</td>
                    <td className="qlcd-table-actions">
                      <button
                        className="qlcd-btn qlcd-btn-edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(topic);
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        className="qlcd-btn qlcd-btn-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(topic);
                        }}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Button */}
        {filters.subjectGradeId && (
          <button
            className="qlcd-btn qlcd-btn-primary qlcd-btn-add"
            onClick={handleAddNew}
          >
            + Thêm Chủ Đề Mới
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <TopicModal
          topic={editingTopic}
          subjectGradeId={filters.subjectGradeId}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};

export default TopicPanel;
