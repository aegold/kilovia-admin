/**
 * SubTopicPanel - Right panel for SubTopics management
 * Displays subtopics for the selected topic
 */

import React, { useState, useEffect } from "react";
import { subTopicService } from "../../services/topicService";
import SubTopicModal from "./SubTopicModal";

const SubTopicPanel = ({ selectedTopic, refreshTrigger, onDataChange }) => {
  const [subTopics, setSubTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSubTopic, setEditingSubTopic] = useState(null);

  // Load subtopics when selected topic changes
  useEffect(() => {
    if (selectedTopic) {
      loadSubTopics();
    } else {
      setSubTopics([]);
    }
  }, [selectedTopic, refreshTrigger]);

  const loadSubTopics = async () => {
    setLoading(true);
    try {
      const data = await subTopicService.getSubTopicsByTopic(selectedTopic.id);
      setSubTopics(data);
    } catch (error) {
      console.error("Error loading subtopics:", error);
      setSubTopics([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingSubTopic(null);
    setShowModal(true);
  };

  const handleEdit = (subTopic) => {
    setEditingSubTopic(subTopic);
    setShowModal(true);
  };

  const handleDelete = async (subTopic) => {
    if (
      !window.confirm(
        `Bạn có chắc muốn xóa chủ đề con "${subTopic.subTopicTitle}"?\n\nLưu ý: Các câu hỏi liên quan cũng sẽ bị xóa!`
      )
    ) {
      return;
    }

    try {
      await subTopicService.deleteSubTopic(subTopic.id);
      onDataChange();
    } catch (error) {
      alert("Có lỗi khi xóa chủ đề con!");
      console.error(error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingSubTopic(null);
  };

  const handleModalSuccess = () => {
    setShowModal(false);
    setEditingSubTopic(null);
    onDataChange();
  };

  // Filter subtopics by search term
  const filteredSubTopics = subTopics.filter((subTopic) =>
    subTopic.subTopicTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="qlcd-panel qlcd-subtopic-panel">
      {/* Panel Header */}
      <div className="qlcd-panel-header">
        <h2 className="qlcd-panel-title">
          📑 Danh Sách Chủ Đề Con (SubTopics)
        </h2>
        {selectedTopic ? (
          <p className="qlcd-panel-subtitle">
            Chủ đề: <strong>{selectedTopic.topicTitle}</strong>
          </p>
        ) : (
          <p className="qlcd-panel-subtitle">
            Chọn một chủ đề bên trái để xem chủ đề con
          </p>
        )}
      </div>

      {/* Panel Content */}
      <div className="qlcd-panel-content">
        {/* Search */}
        {selectedTopic && subTopics.length > 0 && (
          <div className="qlcd-filters">
            <div className="qlcd-filter-row">
              <input
                type="text"
                className="qlcd-search-input"
                placeholder="Tìm kiếm chủ đề con..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* SubTopics List */}
        {loading ? (
          <div className="qlcd-loading">
            <div className="qlcd-loading-spinner"></div>
            <p>Đang tải...</p>
          </div>
        ) : !selectedTopic ? (
          <div className="qlcd-empty-state">
            <div className="qlcd-empty-icon">📑</div>
            <h3 className="qlcd-empty-title">Chọn Chủ Đề</h3>
            <p className="qlcd-empty-text">
              Vui lòng chọn một chủ đề bên trái để xem danh sách chủ đề con
            </p>
          </div>
        ) : filteredSubTopics.length === 0 ? (
          <div className="qlcd-empty-state">
            <div className="qlcd-empty-icon">📭</div>
            <h3 className="qlcd-empty-title">Chưa Có Chủ Đề Con</h3>
            <p className="qlcd-empty-text">
              {searchTerm
                ? "Không tìm thấy chủ đề con phù hợp"
                : "Chủ đề này chưa có chủ đề con nào"}
            </p>
          </div>
        ) : (
          <div className="qlcd-table-container">
            <table className="qlcd-table">
              <thead>
                <tr>
                  <th className="qlcd-table-id">ID</th>
                  <th>Tên Chủ Đề Con</th>
                  <th className="qlcd-table-actions">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubTopics.map((subTopic) => (
                  <tr key={subTopic.id}>
                    <td className="qlcd-table-id">{subTopic.id}</td>
                    <td className="qlcd-table-name">
                      {subTopic.subTopicTitle}
                    </td>
                    <td className="qlcd-table-actions">
                      <button
                        className="qlcd-btn qlcd-btn-edit"
                        onClick={() => handleEdit(subTopic)}
                      >
                        Sửa
                      </button>
                      <button
                        className="qlcd-btn qlcd-btn-delete"
                        onClick={() => handleDelete(subTopic)}
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
        {selectedTopic && (
          <button
            className="qlcd-btn qlcd-btn-primary qlcd-btn-add"
            onClick={handleAddNew}
          >
            + Thêm Chủ Đề Con Mới
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <SubTopicModal
          subTopic={editingSubTopic}
          topicId={selectedTopic.id}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};

export default SubTopicPanel;
