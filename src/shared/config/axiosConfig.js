/**
 * axiosConfig.js - Axios instance configuration
 * Configured for CORS, API communication, and Authentication
 *
 * Features:
 * - Auto-attach Authorization header
 * - Auto-refresh token on 401
 * - Request/Response logging
 */

import axios from "axios";
import { tokenStorage } from "../utils/tokenStorage";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // Enable credentials for CORS
  withCredentials: false,
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue = [];

/**
 * Process queued requests after token refresh
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - Add Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    // Get access token from storage
    const accessToken = tokenStorage.getAccessToken();

    // Add Authorization header if token exists
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Log request for debugging
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401 and auto-refresh
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log(
      `[API Response] ${response.config.method?.toUpperCase()} ${
        response.config.url
      } - Status: ${response.status}`
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error details
    if (error.response) {
      console.error(
        `[API Error] ${error.config?.method?.toUpperCase()} ${
          error.config?.url
        }`,
        {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        }
      );

      // Handle 401 Unauthorized - Try to refresh token
      if (error.response.status === 401 && !originalRequest._retry) {
        // Don't retry for auth endpoints (login, refresh)
        if (
          originalRequest.url?.includes("/auth/admin/login") ||
          originalRequest.url?.includes("/auth/admin/refresh")
        ) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = tokenStorage.getRefreshToken();

          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          // Call refresh endpoint directly (avoid interceptor loop)
          const response = await axios.post(
            `${API_BASE_URL}/auth/admin/refresh`,
            {
              refreshToken,
            }
          );

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response.data;

          // Save new tokens
          tokenStorage.setAccessToken(newAccessToken);
          if (newRefreshToken) {
            tokenStorage.setRefreshToken(newRefreshToken);
          }

          // Process queued requests
          processQueue(null, newAccessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh failed - clear auth and redirect to login
          processQueue(refreshError, null);
          tokenStorage.clearAuthData();

          // Dispatch custom event for auth failure
          window.dispatchEvent(new CustomEvent("auth:sessionExpired"));

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    } else if (error.request) {
      // Request made but no response
      console.error(
        `[API Error] No response from server for ${error.config?.method?.toUpperCase()} ${
          error.config?.url
        }`,
        {
          message: error.message,
          code: error.code,
        }
      );
    } else {
      // Error in request setup
      console.error("[API Error] Request setup failed", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { API_BASE_URL };
