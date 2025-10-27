/**
 * QuanLyCauHoi - Question List Management Page
 *
 * Separate page for managing existing questions
 * Independent from QuanLyBaiTap (Question Creator)
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./QuanLyCauHoi.css";
import QLCH_Header from "./components/QLCH_Header";
import QuestionTable from "./components/QuestionTable";
import QuestionFilters from "./components/QuestionFilters";
import QuestionPreviewModal from "./components/QuestionPreviewModal";
import { hierarchyService } from "@shared/services/hierarchyService";

const QuanLyCauHoi = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewQuestion, setPreviewQuestion] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [filters, setFilters] = useState({
    search: "",
    kind: "",
    gradeId: null,
    subjectId: null,
    topicId: null,
    subtopicId: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const itemsPerPage = 10;

  // Load questions with pagination and filters
  const loadQuestions = async () => {
    setLoading(true);
    try {
      // Use new pagination API
      const result = await hierarchyService.getQuestionsPage(
        filters,
        currentPage,
        itemsPerPage
      );

      setQuestions(result.questions);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch (error) {
      console.error("Error loading questions:", error);
      setQuestions([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  // Load when filters change - reset to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Load when page or filters change
  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage]);

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle create new - navigate to QuanLyBaiTap
  // const handleCreateNew = () => {
  //   navigate("/quan-ly-bai-tap");
  // };

  // Handle edit - navigate to QuanLyBaiTap with question data
  const handleEdit = (question) => {
    // TODO: Pass question data to editor
    navigate("/quan-ly-bai-tap", { state: { editQuestion: question } });
  };

  // Handle delete
  const handleDelete = async (questionId) => {
    const confirmed = window.confirm(
      "⚠️ Xác nhận xóa câu hỏi?\n\n" +
        `ID: ${questionId}\n` +
        "Hành động này không thể hoàn tác!"
    );

    if (!confirmed) return;

    try {
      await hierarchyService.deleteQuestion(questionId);

      // Show success message
      setMessage({
        type: "success",
        text: `✅ Đã xóa câu hỏi #${questionId} thành công!`,
      });

      // Clear message after 3s
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);

      // Reload current page to reflect changes
      loadQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);

      // Show error message
      setMessage({
        type: "error",
        text: `❌ ${error.response?.data?.message || "Lỗi khi xóa câu hỏi!"}`,
      });

      // Clear message after 5s for errors
      setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async (questionIds) => {
    const confirmed = window.confirm(
      "⚠️ Xác nhận xóa nhiều câu hỏi?\n\n" +
        `Số lượng: ${questionIds.length} câu hỏi\n` +
        "Hành động này không thể hoàn tác!"
    );

    if (!confirmed) return;

    try {
      // Delete all selected questions
      await Promise.all(
        questionIds.map((id) => hierarchyService.deleteQuestion(id))
      );

      // Show success message
      setMessage({
        type: "success",
        text: `✅ Đã xóa ${questionIds.length} câu hỏi thành công!`,
      });

      // Clear message after 3s
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);

      // Reload current page to reflect changes
      loadQuestions();
    } catch (error) {
      console.error("Error bulk deleting questions:", error);

      // Show error message
      setMessage({
        type: "error",
        text: `❌ ${error.response?.data?.message || "Lỗi khi xóa câu hỏi!"}`,
      });

      // Clear message after 5s for errors
      setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    }
  };

  // Handle preview
  const handlePreview = (question) => {
    setPreviewQuestion(question);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="quan-ly-cau-hoi">
      {/* Main Content - Header removed, using SharedNavbar */}
      <div className="qlch-main-content">
        {/* Message Toast */}
        {message.text && (
          <div className={`qlch-message qlch-message-${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Filters */}
        <QuestionFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Table */}
        <QuestionTable
          questions={questions}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPreview={handlePreview}
          onBulkDelete={handleBulkDelete}
        />

        {/* Pagination */}
        {!loading && questions.length > 0 && (
          <div className="qlch-pagination">
            <div className="pagination-info">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, totalElements)} /{" "}
              {totalElements} câu hỏi
            </div>
            <div className="pagination-controls">
              <button
                className="btn-page"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                ««
              </button>
              <button
                className="btn-page"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                «
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Show first, last, current, and adjacent pages
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  );
                })
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="pagination-ellipsis">...</span>
                    )}
                    <button
                      className={`btn-page ${
                        page === currentPage ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
              <button
                className="btn-page"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                »
              </button>
              <button
                className="btn-page"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                »»
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewQuestion && (
        <QuestionPreviewModal
          question={previewQuestion}
          onClose={() => setPreviewQuestion(null)}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default QuanLyCauHoi;
