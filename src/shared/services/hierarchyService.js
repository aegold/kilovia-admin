/**
 * hierarchyService.js - Service layer for hierarchy navigation API calls
 * Handles: Grades → Subjects → Topics → SubTopics → Questions
 *
 * ⚠️ VITE PROJECT - Environment Variables:
 * - Use VITE_API_BASE_URL (not REACT_APP_API_BASE_URL)
 * - Access via import.meta.env (not process.env)
 *
 * KHI TÍCH HỢP BACKEND:
 * 1. Đổi USE_MOCK = false (dòng bên dưới)
 * 2. Verify API_BASE_URL port = 8080
 * 3. Test từng API endpoint từ dễ đến khó
 */

import axiosInstance, { API_BASE_URL } from "../config/axiosConfig";
import { filterMockQuestions } from "../data/mockQuestionsForList";

/**
 * ========================================
 * FRONTEND USES camelCase (JavaScript Standard)
 * ========================================
 * Backend trả về camelCase (Java convention)
 * Frontend dùng camelCase (JavaScript convention)
 * → KHÔNG CẦN MAPPING! Đơn giản và sạch sẽ
 *
 * Example:
 * - Backend: { id: 1, gradeName: "Lớp 1" }
 * - Frontend: { id: 1, gradeName: "Lớp 1" } ✅ Giống nhau
 */

// Mock data for development/testing (NOW IN camelCase)
const MOCK_DATA = {
  grades: [
    { id: 1, gradeName: "Lớp 1", description: "Khối lớp 1" },
    { id: 2, gradeName: "Lớp 2", description: "Khối lớp 2" },
    { id: 3, gradeName: "Lớp 3", description: "Khối lớp 3" },
    { id: 4, gradeName: "Lớp 4", description: "Khối lớp 4" },
    { id: 5, gradeName: "Lớp 5", description: "Khối lớp 5" },
  ],
  subjects: {
    1: [
      { id: 1, subjectGradeName: "Toán Lớp 1", subjectId: 1, gradeId: 1 },
      {
        id: 2,
        subjectGradeName: "Tiếng Việt Lớp 1",
        subjectId: 2,
        gradeId: 1,
      },
    ],
    2: [
      { id: 3, subjectGradeName: "Toán Lớp 2", subjectId: 1, gradeId: 2 },
      {
        id: 4,
        subjectGradeName: "Tiếng Việt Lớp 2",
        subjectId: 2,
        gradeId: 2,
      },
    ],
    3: [
      { id: 5, subjectGradeName: "Toán Lớp 3", subjectId: 1, gradeId: 3 },
      {
        id: 6,
        subjectGradeName: "Tiếng Việt Lớp 3",
        subjectId: 2,
        gradeId: 3,
      },
    ],
  },
  topics: {
    1: [
      { id: 1, topicTitle: "Số và phép tính", subjectGradeId: 1 },
      { id: 2, topicTitle: "Đo lường", subjectGradeId: 1 },
    ],
    2: [
      { id: 3, topicTitle: "Ngữ âm", subjectGradeId: 2 },
      { id: 4, topicTitle: "Từ vựng", subjectGradeId: 2 },
    ],
  },
  subtopics: {
    1: [
      { id: 1, subTopicTitle: "Nhận biết số từ 0 đến 20", topicId: 1 },
      { id: 2, subTopicTitle: "Phép cộng trong phạm vi 20", topicId: 1 },
      { id: 3, subTopicTitle: "Phép trừ trong phạm vi 20", topicId: 1 },
    ],
    2: [
      { id: 4, subTopicTitle: "Đo độ dài", topicId: 2 },
      { id: 5, subTopicTitle: "Đo khối lượng", topicId: 2 },
    ],
  },
};

// ⚠️ QUAN TRỌNG: Đổi thành false khi tích hợp backend
const USE_MOCK = false;

/**
 * Hierarchy Service
 */
export const hierarchyService = {
  /**
   * Get all grades
   * @returns {Promise<Array>} List of grades
   */
  getGrades: async () => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_DATA.grades), 300);
      });
    }

    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/grades/all`);
      return response.data;
    } catch (error) {
      console.error("Error fetching grades:", error);
      throw error;
    }
  },

  /**
   * Get subject-grades by grade ID
   * @param {number} gradeId - Grade ID
   * @returns {Promise<Array>} List of subject-grades
   */
  getSubjectsByGrade: async (gradeId) => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        const subjects = MOCK_DATA.subjects[gradeId] || [];
        setTimeout(() => resolve(subjects), 300);
      });
    }

    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}/subject-grades/by-grade/${gradeId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching subjects:", error);
      throw error;
    }
  },

  /**
   * Get topics by subject-grade ID
   * @param {number} subjectGradeId - Subject-Grade ID
   * @returns {Promise<Array>} List of topics
   */
  getTopicsBySubjectGrade: async (subjectGradeId) => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        const topics = MOCK_DATA.topics[subjectGradeId] || [];
        setTimeout(() => resolve(topics), 300);
      });
    }

    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}/topics/by-subject-grade/${subjectGradeId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching topics:", error);
      throw error;
    }
  },

  /**
   * Get sub-topics by topic ID
   * @param {number} topicId - Topic ID
   * @returns {Promise<Array>} List of sub-topics
   */
  getSubTopicsByTopic: async (topicId) => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        const subtopics = MOCK_DATA.subtopics[topicId] || [];
        setTimeout(() => resolve(subtopics), 300);
      });
    }

    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}/subtopics/by-topic/${topicId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching sub-topics:", error);
      throw error;
    }
  },

  /**
   * Get questions by sub-topic ID
   * @param {number} subTopicId - Sub-Topic ID
   * @returns {Promise<Array>} List of questions
   */
  getQuestionsBySubTopic: async (subTopicId) => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => resolve([]), 300);
      });
    }

    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}/questions/by-subtopic/${subTopicId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw error;
    }
  },

  /**
   * Get all questions with optional filters
   * @param {object} filters - Filter options { gradeId, subjectId, topicId, subtopicId, kind, search }
   * @returns {Promise<Array>} List of questions
   */
  getAllQuestions: async (filters = {}) => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          try {
            // Use the mock data with filters
            const questions = filterMockQuestions(filters);
            resolve(questions);
          } catch (error) {
            console.error("Error loading mock questions:", error);
            resolve([]);
          }
        }, 300);
      });
    }

    try {
      let endpoint = `${API_BASE_URL}/questions/all`;

      // If subtopicId is provided, use the specific endpoint (more efficient)
      if (filters.subtopicId) {
        endpoint = `${API_BASE_URL}/questions/by-subtopic/${filters.subtopicId}`;
      }

      const response = await axiosInstance.get(endpoint);
      let questions = response.data;

      // Transform backend format to frontend format
      questions = questions.map((q) => ({
        id: q.id,
        prompt: q.questionDetail?.prompt || q.questionTitle || "",
        question_type: q.questionTypeId,
        envelope: q.questionDetail,
        created_at: q.createdAt || new Date().toISOString(),
        meta: {
          hierarchy: q.questionDetail?.meta?.hierarchy || {},
        },
      }));

      // Apply client-side filters
      if (filters.gradeId) {
        questions = questions.filter((q) => {
          return q.meta?.hierarchy?.gradeId === filters.gradeId;
        });
      }
      if (filters.subjectId) {
        questions = questions.filter((q) => {
          return q.meta?.hierarchy?.subjectId === filters.subjectId;
        });
      }
      if (filters.topicId) {
        questions = questions.filter((q) => {
          return q.meta?.hierarchy?.topicId === filters.topicId;
        });
      }
      if (filters.kind) {
        questions = questions.filter((q) => {
          const kind = q.envelope?.kind;
          return kind === filters.kind;
        });
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        questions = questions.filter((q) => {
          const prompt = (q.prompt || "").toLowerCase();
          return prompt.includes(searchLower);
        });
      }

      return questions;
    } catch (error) {
      console.error("Error fetching all questions:", error);
      throw error;
    }
  },

  /**
   * Delete a question
   * @param {number} questionId - Question ID
   * @returns {Promise<object>} Delete response
   */
  deleteQuestion: async (questionId) => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          try {
            console.log(
              "🗑️ Mock: Simulating delete for question ID:",
              questionId
            );
            resolve({ success: true, id: questionId });
          } catch (error) {
            console.error("Error deleting question:", error);
            throw error;
          }
        }, 300);
      });
    }

    try {
      const response = await axiosInstance.delete(
        `${API_BASE_URL}/questions/delete/${questionId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting question:", error);
      throw error;
    }
  },

  /**
   * Update a question
   * @param {number} questionId - Question ID
   * @param {object} questionData - Question data to update
   * @returns {Promise<object>} Updated question
   */
  updateQuestion: async (questionId, questionData) => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(
            "✏️ Mock: Simulating update for question ID:",
            questionId,
            questionData
          );
          resolve({
            id: questionId,
            ...questionData,
            updatedAt: new Date().toISOString(),
          });
        }, 500);
      });
    }

    try {
      // Backend expects UpdateQuestionRequestDto format
      const payload = {
        id: questionId,
        questionTitle: questionData.questionTitle,
        questionImage: questionData.questionImage,
        questionDetail: questionData.questionDetail,
        questionTypeId: questionData.questionTypeId,
        subTopicId: questionData.subTopicId,
      };

      console.log("🔄 Sending update request:", payload);

      const response = await axiosInstance.put(
        `${API_BASE_URL}/questions/update`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error updating question:", error);
      throw error;
    }
  },

  /**
   * Save a new question
   * @param {object} questionData - Question data to save
   * @returns {Promise<object>} Saved question response
   */
  saveQuestion: async (questionData) => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: Date.now(),
            ...questionData,
            created_at: new Date().toISOString(),
          });
        }, 500);
      });
    }

    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}/questions/add`,
        questionData
      );
      return response.data;
    } catch (error) {
      console.error("Error saving question:", error);
      throw error;
    }
  },

  /**
   * Get questions with pagination and filters (NEW API)
   * @param {object} filters - Filter options
   * @param {number} page - Page number (1-based for UI, will convert to 0-based for API)
   * @param {number} size - Page size
   * @returns {Promise<object>} Paginated questions response
   */
  getQuestionsPage: async (filters = {}, page = 1, size = 10) => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          try {
            // Get filtered questions from mock data
            const allFilteredQuestions = filterMockQuestions(filters);

            // Calculate pagination
            const totalElements = allFilteredQuestions.length;
            const totalPages = Math.ceil(totalElements / size);
            const startIndex = (page - 1) * size;
            const endIndex = startIndex + size;
            const questions = allFilteredQuestions.slice(startIndex, endIndex);

            resolve({
              questions: questions,
              currentPage: page - 1, // Convert to 0-based
              totalPages: totalPages,
              totalElements: totalElements,
              pageSize: size,
              hasNext: page < totalPages,
              hasPrevious: page > 1,
            });
          } catch (error) {
            console.error("Error loading mock questions page:", error);
            resolve({
              questions: [],
              currentPage: 0,
              totalPages: 0,
              totalElements: 0,
              pageSize: size,
              hasNext: false,
              hasPrevious: false,
            });
          }
        }, 300);
      });
    }

    try {
      // Check if any filter is active
      const hasFilters =
        filters.gradeId ||
        filters.subjectId ||
        filters.topicId ||
        filters.subtopicId ||
        filters.kind ||
        filters.search;

      // Build query parameters
      const params = new URLSearchParams();

      // Pagination (convert to 0-based for backend)
      params.append("page", page - 1);
      params.append("size", size);

      // Determine endpoint based on filters
      let endpoint;

      if (!hasFilters) {
        // No filters → use /latest endpoint for newest questions
        endpoint = `${API_BASE_URL}/questions/page/latest`;
      } else {
        // Has filters → use /filter endpoint
        endpoint = `${API_BASE_URL}/questions/page/filter`;

        // Add filter parameters
        if (filters.gradeId) {
          params.append("gradeId", filters.gradeId);
        }
        if (filters.subjectId) {
          params.append("subjectId", filters.subjectId);
        }
        if (filters.topicId) {
          params.append("topicId", filters.topicId);
        }
        if (filters.subtopicId) {
          params.append("subtopicId", filters.subtopicId);
        }

        // Question type filter (map kind string to questionTypeId)
        if (filters.kind) {
          const questionTypeId = getQuestionTypeIdFromKind(filters.kind);
          if (questionTypeId) {
            params.append("questionTypeId", questionTypeId);
          }
        }

        // Search filter
        if (filters.search) {
          params.append("search", filters.search);
        }
      }

      // 🔍 DEBUG: Log API request details
      const fullUrl = `${endpoint}?${params.toString()}`;
      console.log("🔍 API Request URL:", fullUrl);
      console.log("🔍 Filters sent:", filters);

      const response = await axiosInstance.get(fullUrl);
      const data = response.data;

      // 🔍 DEBUG: Log API response
      console.log("✅ API Response:", {
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        questionsCount: data.questions?.length,
      });

      // Transform backend response to frontend format
      const questions = data.questions.map((q) => ({
        id: q.id,
        prompt: q.questionDetail?.prompt || q.questionTitle || "",
        question_type: q.questionTypeId,
        envelope: q.questionDetail,
        created_at: q.createdAt || new Date().toISOString(),
        meta: {
          hierarchy: q.questionDetail?.meta?.hierarchy || {},
        },
      }));

      return {
        questions: questions,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        pageSize: data.pageSize,
        hasNext: data.hasNext,
        hasPrevious: data.hasPrevious,
      };
    } catch (error) {
      console.error("Error fetching questions page:", error);
      throw error;
    }
  },

  /**
   * Upload image file
   * @param {File} file - Image file
   * @param {string} folder - Folder name
   * @returns {Promise<string>} Image URL
   */
  uploadImage: async (file, folder = "questions") => {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(`https://via.placeholder.com/400x300?text=${file.name}`);
        }, 500);
      });
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await axiosInstance.post(
        `${API_BASE_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },
};

/**
 * Helper function: Map frontend kind to backend questionTypeId
 * @param {string} kind - Frontend kind string
 * @returns {number|null} Backend question type ID
 */
const getQuestionTypeIdFromKind = (kind) => {
  const QUESTION_TYPE_MAPPING = {
    mcq_single: 1,
    fib_single: 2,
    image_choice: 3,
    multiple_fill_in: 4,
    vertical_calculation: 5,
    expression: 6,
    matching_pairs: 7,
  };
  return QUESTION_TYPE_MAPPING[kind] || null;
};

export default hierarchyService;
