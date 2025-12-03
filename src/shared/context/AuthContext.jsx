/**
 * AuthContext.jsx - Authentication Context Provider
 *
 * Manages:
 * - User authentication state
 * - Login/Logout actions
 * - Token refresh
 * - Session persistence
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authService } from "../services/authService";
import { tokenStorage } from "../utils/tokenStorage";

// Create context
const AuthContext = createContext(null);

/**
 * Auth Provider Component
 */
export const AuthProvider = ({ children }) => {
  // State
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Initialize auth state from stored session
   */
  const initializeAuth = useCallback(async () => {
    setIsLoading(true);

    try {
      // Check if we have stored session
      if (!tokenStorage.hasStoredSession()) {
        setIsLoading(false);
        return;
      }

      // Get stored user info for quick UI display
      const storedUser = tokenStorage.getUserInfo();
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }

      // Try to refresh token to get new access token
      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) {
        try {
          const response = await authService.refreshToken(refreshToken);

          // Save new tokens
          tokenStorage.setAccessToken(response.accessToken);
          if (response.refreshToken) {
            tokenStorage.setRefreshToken(response.refreshToken);
          }

          // Update user info if provided
          if (response.adminId) {
            const userInfo = {
              adminId: response.adminId,
              username: response.username,
              email: response.email,
              fullName: response.fullName,
              role: response.role,
            };
            tokenStorage.setUserInfo(userInfo);
            setUser(userInfo);
          }

          setIsAuthenticated(true);
        } catch (error) {
          // Refresh failed - clear session
          console.error("Session expired, please login again");
          tokenStorage.clearAuthData();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      tokenStorage.clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  /**
   * Login action
   * @param {string} username
   * @param {string} password
   * @returns {Promise<object>} User info
   */
  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);

      // Save auth data
      tokenStorage.saveAuthData(response);

      // Update state
      const userInfo = {
        adminId: response.adminId,
        username: response.username,
        email: response.email,
        fullName: response.fullName,
        role: response.role,
      };
      setUser(userInfo);
      setIsAuthenticated(true);

      return userInfo;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Logout action
   */
  const logout = async () => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      // Ignore logout API errors
      console.error("Logout API error (ignored):", error);
    } finally {
      // Always clear local data
      tokenStorage.clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  /**
   * Refresh access token
   * @returns {Promise<string>} New access token
   */
  const refreshAccessToken = async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await authService.refreshToken(refreshToken);

      // Save new tokens
      tokenStorage.setAccessToken(response.accessToken);
      if (response.refreshToken) {
        tokenStorage.setRefreshToken(response.refreshToken);
      }

      return response.accessToken;
    } catch (error) {
      // Refresh failed - force logout
      await logout();
      throw error;
    }
  };

  /**
   * Update user info (after profile change)
   * @param {object} updatedInfo
   */
  const updateUserInfo = (updatedInfo) => {
    const newUserInfo = { ...user, ...updatedInfo };
    setUser(newUserInfo);
    tokenStorage.setUserInfo(newUserInfo);
  };

  // Context value
  const value = {
    // State
    user,
    isLoading,
    isAuthenticated,

    // Actions
    login,
    logout,
    refreshAccessToken,
    updateUserInfo,

    // Helpers
    hasRole: (role) => user?.role === role,
    isSuperAdmin: () => user?.role === "SUPER_ADMIN",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use Auth Context
 * @returns {object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
