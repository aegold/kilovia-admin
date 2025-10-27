/**
 * topicService.js - API Service for Topics and SubTopics CRUD
 * Handles all API calls for Topic and SubTopic management
 */

import axiosInstance, { API_BASE_URL } from "@shared/config/axiosConfig";

/**
 * Topic Service
 */
export const topicService = {
  /**
   * Get all topics by subject-grade ID
   * @param {number} subjectGradeId - Subject-Grade ID
   * @returns {Promise<Array>} List of topics
   */
  getTopicsBySubjectGrade: async (subjectGradeId) => {
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
   * Create new topic
   * @param {object} data - Topic data { subjectGradeId, topicTitle, description }
   * @returns {Promise<object>} Created topic
   */
  createTopic: async (data) => {
    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}/topics/add`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating topic:", error);
      throw error;
    }
  },

  /**
   * Update existing topic
   * @param {number} id - Topic ID
   * @param {object} data - Updated topic data
   * @returns {Promise<object>} Updated topic
   */
  updateTopic: async (id, data) => {
    try {
      const response = await axiosInstance.put(
        `${API_BASE_URL}/topics/update`,
        {
          id,
          ...data,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating topic:", error);
      throw error;
    }
  },

  /**
   * Delete topic
   * @param {number} id - Topic ID
   * @returns {Promise<void>}
   */
  deleteTopic: async (id) => {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/topics/delete/${id}`);
    } catch (error) {
      console.error("Error deleting topic:", error);
      throw error;
    }
  },
};

/**
 * SubTopic Service
 */
export const subTopicService = {
  /**
   * Get all subtopics by topic ID
   * @param {number} topicId - Topic ID
   * @returns {Promise<Array>} List of subtopics
   */
  getSubTopicsByTopic: async (topicId) => {
    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}/subtopics/by-topic/${topicId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching subtopics:", error);
      throw error;
    }
  },

  /**
   * Create new subtopic
   * @param {object} data - SubTopic data { topicId, subTopicTitle, description }
   * @returns {Promise<object>} Created subtopic
   */
  createSubTopic: async (data) => {
    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}/subtopics/add`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating subtopic:", error);
      throw error;
    }
  },

  /**
   * Update existing subtopic
   * @param {number} id - SubTopic ID
   * @param {object} data - Updated subtopic data
   * @returns {Promise<object>} Updated subtopic
   */
  updateSubTopic: async (id, data) => {
    try {
      const response = await axiosInstance.put(
        `${API_BASE_URL}/subtopics/update`,
        {
          id,
          ...data,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating subtopic:", error);
      throw error;
    }
  },

  /**
   * Delete subtopic
   * @param {number} id - SubTopic ID
   * @returns {Promise<void>}
   */
  deleteSubTopic: async (id) => {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/subtopics/delete/${id}`);
    } catch (error) {
      console.error("Error deleting subtopic:", error);
      throw error;
    }
  },
};

// Default export
const services = { topicService, subTopicService };
export default services;
