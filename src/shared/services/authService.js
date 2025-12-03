/**
 * authService.js - Service layer for Authentication API calls
 * Handles: Login, Logout, Refresh Token, Get Profile, Change Password
 *
 * API Base URL: http://localhost:8080/api
 */

import axiosInstance from "../config/axiosConfig";

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Login with username and password
   * @param {string} username
   * @param {string} password
   * @returns {Promise<object>} Login response with tokens and user info
   */
  login: async (username, password) => {
    try {
      const response = await axiosInstance.post("/auth/admin/login", {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  /**
   * Logout - invalidate tokens
   * @param {string} refreshToken
   * @returns {Promise<void>}
   */
  logout: async (refreshToken) => {
    try {
      await axiosInstance.post("/auth/admin/logout", {
        refreshToken,
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Don't throw - logout should succeed even if API fails
    }
  },

  /**
   * Refresh access token using refresh token
   * @param {string} refreshToken
   * @returns {Promise<object>} New tokens
   */
  refreshToken: async (refreshToken) => {
    try {
      const response = await axiosInstance.post("/auth/admin/refresh", {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      console.error("Refresh token error:", error);
      throw error;
    }
  },

  /**
   * Get current user profile
   * @returns {Promise<object>} User profile
   */
  getProfile: async () => {
    try {
      const response = await axiosInstance.get("/auth/admin/me");
      return response.data;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  },

  /**
   * Change password
   * @param {string} oldPassword
   * @param {string} newPassword
   * @returns {Promise<object>} Response
   */
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await axiosInstance.post("/auth/admin/change-password", {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  },
};

export default authService;
