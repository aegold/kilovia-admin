/**
 * axiosConfig.js - Axios instance configuration
 * Configured for CORS and API communication
 */

import axios from "axios";

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

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Log request for debugging
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor
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
  (error) => {
    // Log error details
    if (error.response) {
      // Server responded with error status
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
