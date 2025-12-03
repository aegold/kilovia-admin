/**
 * tokenStorage.js - Token management utilities
 *
 * Security Strategy:
 * - Access Token: Stored in memory (more secure, lost on refresh)
 * - Refresh Token: Stored in localStorage (persists across tabs/refresh)
 * - User Info: Stored in localStorage (for quick UI display)
 */

const REFRESH_TOKEN_KEY = "kilovia_refresh_token";
const USER_INFO_KEY = "kilovia_user_info";

// In-memory storage for access token (more secure)
let accessToken = null;

/**
 * Token Storage utilities
 */
export const tokenStorage = {
  // ============ ACCESS TOKEN (Memory) ============

  /**
   * Get access token from memory
   * @returns {string|null}
   */
  getAccessToken: () => {
    return accessToken;
  },

  /**
   * Set access token in memory
   * @param {string} token
   */
  setAccessToken: (token) => {
    accessToken = token;
  },

  /**
   * Clear access token from memory
   */
  clearAccessToken: () => {
    accessToken = null;
  },

  // ============ REFRESH TOKEN (localStorage) ============

  /**
   * Get refresh token from localStorage
   * @returns {string|null}
   */
  getRefreshToken: () => {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting refresh token:", error);
      return null;
    }
  },

  /**
   * Set refresh token in localStorage
   * @param {string} token
   */
  setRefreshToken: (token) => {
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error("Error setting refresh token:", error);
    }
  },

  /**
   * Clear refresh token from localStorage
   */
  clearRefreshToken: () => {
    try {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Error clearing refresh token:", error);
    }
  },

  // ============ USER INFO (localStorage) ============

  /**
   * Get user info from localStorage
   * @returns {object|null}
   */
  getUserInfo: () => {
    try {
      const data = localStorage.getItem(USER_INFO_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  },

  /**
   * Set user info in localStorage
   * @param {object} userInfo - { adminId, username, email, fullName, role }
   */
  setUserInfo: (userInfo) => {
    try {
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
    } catch (error) {
      console.error("Error setting user info:", error);
    }
  },

  /**
   * Clear user info from localStorage
   */
  clearUserInfo: () => {
    try {
      localStorage.removeItem(USER_INFO_KEY);
    } catch (error) {
      console.error("Error clearing user info:", error);
    }
  },

  // ============ COMBINED OPERATIONS ============

  /**
   * Save all auth data after login
   * @param {object} loginResponse - Response from login API
   */
  saveAuthData: (loginResponse) => {
    const {
      accessToken: token,
      refreshToken,
      adminId,
      username,
      email,
      fullName,
      role,
    } = loginResponse;

    tokenStorage.setAccessToken(token);
    tokenStorage.setRefreshToken(refreshToken);
    tokenStorage.setUserInfo({ adminId, username, email, fullName, role });
  },

  /**
   * Clear all auth data on logout
   */
  clearAuthData: () => {
    tokenStorage.clearAccessToken();
    tokenStorage.clearRefreshToken();
    tokenStorage.clearUserInfo();
  },

  /**
   * Check if user is potentially logged in (has refresh token)
   * @returns {boolean}
   */
  hasStoredSession: () => {
    return !!tokenStorage.getRefreshToken();
  },
};

export default tokenStorage;
