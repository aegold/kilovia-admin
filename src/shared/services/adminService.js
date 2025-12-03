/**
 * adminService.js - Service layer for Admin Management API calls
 * SUPER_ADMIN only endpoints
 *
 * Handles:
 * - Admin CRUD operations
 * - Admin status management
 * - Password reset requests management
 */

import axiosInstance from "../config/axiosConfig";

/**
 * Helper function to extract data from API response
 * Backend returns different structures:
 * - GET /admins: { admins: [...], total: 2 }
 * - GET /admins/active: { admins: [...], total: 2 }
 * - GET /password-reset/requests: { requests: [...], total: 2 }
 * - GET /audit-logs: { logs: [...], total: 2 }
 * - Single object: { id: 1, username: "..." }
 */
const extractData = (responseData, arrayKey = null) => {
  if (!responseData || typeof responseData !== "object") {
    return responseData;
  }

  // If response is already an array, return it
  if (Array.isArray(responseData)) {
    return responseData;
  }

  // If specific key is provided, use it
  if (arrayKey && responseData[arrayKey] !== undefined) {
    return responseData[arrayKey];
  }

  // Auto-detect common wrapper keys
  const wrapperKeys = ["admins", "requests", "logs", "data", "items"];
  for (const key of wrapperKeys) {
    if (Array.isArray(responseData[key])) {
      return responseData[key];
    }
  }

  // Return as-is for single objects
  return responseData;
};

/**
 * Admin Management Service
 */
export const adminService = {
  // ============ ADMIN CRUD ============

  /**
   * Get all admins
   * @returns {Promise<Array>} List of all admins
   */
  getAllAdmins: async () => {
    try {
      const response = await axiosInstance.get("/admins");
      return extractData(response.data);
    } catch (error) {
      console.error("Get all admins error:", error);
      throw error;
    }
  },

  /**
   * Get active admins only
   * @returns {Promise<Array>} List of active admins
   */
  getActiveAdmins: async () => {
    try {
      const response = await axiosInstance.get("/admins/active");
      return extractData(response.data);
    } catch (error) {
      console.error("Get active admins error:", error);
      throw error;
    }
  },

  /**
   * Get admin by ID
   * @param {number} id - Admin ID
   * @returns {Promise<object>} Admin details
   */
  getAdminById: async (id) => {
    try {
      const response = await axiosInstance.get(`/admins/${id}`);
      return extractData(response.data);
    } catch (error) {
      console.error("Get admin by ID error:", error);
      throw error;
    }
  },

  /**
   * Create new admin
   * @param {object} adminData - Admin data
   * @param {string} adminData.username - 3-50 chars, alphanumeric and underscore
   * @param {string} adminData.email - Valid email
   * @param {string} adminData.password - 8-100 chars, uppercase, lowercase, number, special char
   * @param {string} adminData.fullName - Full name
   * @param {string} adminData.role - 'ADMIN' or 'SUPER_ADMIN'
   * @param {boolean} adminData.isActive - Active status
   * @returns {Promise<object>} Created admin
   */
  createAdmin: async (adminData) => {
    try {
      const response = await axiosInstance.post("/admins", adminData);
      return extractData(response.data);
    } catch (error) {
      console.error("Create admin error:", error);
      throw error;
    }
  },

  /**
   * Update admin
   * @param {number} id - Admin ID
   * @param {object} adminData - Updated admin data
   * @param {string} adminData.email - Valid email
   * @param {string} adminData.fullName - Full name
   * @param {string} adminData.role - 'ADMIN' or 'SUPER_ADMIN'
   * @param {boolean} adminData.isActive - Active status
   * @returns {Promise<object>} Updated admin
   */
  updateAdmin: async (id, adminData) => {
    try {
      const response = await axiosInstance.put(`/admins/${id}`, adminData);
      return extractData(response.data);
    } catch (error) {
      console.error("Update admin error:", error);
      throw error;
    }
  },

  /**
   * Update admin status (active/inactive)
   * @param {number} id - Admin ID
   * @param {boolean} isActive - New status
   * @returns {Promise<object>} Updated admin
   */
  updateAdminStatus: async (id, isActive) => {
    try {
      const response = await axiosInstance.patch(`/admins/${id}/status`, {
        isActive,
      });
      return extractData(response.data);
    } catch (error) {
      console.error("Update admin status error:", error);
      throw error;
    }
  },

  /**
   * Delete admin
   * @param {number} id - Admin ID
   * @returns {Promise<void>}
   */
  deleteAdmin: async (id) => {
    try {
      await axiosInstance.delete(`/admins/${id}`);
    } catch (error) {
      console.error("Delete admin error:", error);
      throw error;
    }
  },

  // ============ PASSWORD RESET MANAGEMENT ============

  /**
   * Request password reset (for ADMIN users who forgot their password)
   * @param {string} reason - Reason for password reset request
   * @returns {Promise<object>} Response
   */
  requestPasswordReset: async (reason) => {
    try {
      const response = await axiosInstance.post(
        "/admins/password-reset/request",
        { reason }
      );
      return extractData(response.data);
    } catch (error) {
      console.error("Request password reset error:", error);
      throw error;
    }
  },

  /**
   * Get password reset requests
   * @param {string} status - Filter by status: 'PENDING', 'APPROVED', 'REJECTED'
   * @returns {Promise<Array>} List of password reset requests
   */
  getPasswordResetRequests: async (status = null) => {
    try {
      const params = status ? { status } : {};
      const response = await axiosInstance.get(
        "/admins/password-reset/requests",
        { params }
      );
      return extractData(response.data);
    } catch (error) {
      console.error("Get password reset requests error:", error);
      throw error;
    }
  },

  /**
   * Approve password reset request
   * @param {number} requestId - Request ID
   * @param {string} newPassword - New password for the admin
   * @returns {Promise<object>} Response
   */
  approvePasswordReset: async (requestId, newPassword) => {
    try {
      const response = await axiosInstance.post(
        `/admins/password-reset/${requestId}/approve`,
        { newPassword }
      );
      return extractData(response.data);
    } catch (error) {
      console.error("Approve password reset error:", error);
      throw error;
    }
  },

  /**
   * Reject password reset request
   * @param {number} requestId - Request ID
   * @returns {Promise<object>} Response
   */
  rejectPasswordReset: async (requestId) => {
    try {
      const response = await axiosInstance.post(
        `/admins/password-reset/${requestId}/reject`
      );
      return extractData(response.data);
    } catch (error) {
      console.error("Reject password reset error:", error);
      throw error;
    }
  },

  // ============ AUDIT LOGS ============

  /**
   * Get audit logs
   * @param {object} filters - Filter options
   * @param {number} filters.adminId - Filter by admin ID
   * @param {string} filters.action - Filter by action type
   * @returns {Promise<Array>} List of audit logs
   */
  getAuditLogs: async (filters = {}) => {
    try {
      const response = await axiosInstance.get("/admins/audit-logs", {
        params: filters,
      });
      return extractData(response.data);
    } catch (error) {
      console.error("Get audit logs error:", error);
      throw error;
    }
  },
};

export default adminService;
