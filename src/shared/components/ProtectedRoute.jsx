/**
 * ProtectedRoute.jsx - Route guard component
 *
 * Features:
 * - Redirect to login if not authenticated
 * - Optional role-based access control
 * - Loading state while checking auth
 */

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Protected Route Component
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string[]} props.allowedRoles - Optional array of allowed roles
 * @param {string} props.redirectTo - Redirect path when not authorized (default: /login)
 */
const ProtectedRoute = ({
  children,
  allowedRoles = null,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="protected-route-loading">
        <div className="loading-spinner"></div>
        <p>Đang kiểm tra phiên đăng nhập...</p>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    // Save attempted URL for redirect after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      // User doesn't have required role - show forbidden or redirect
      return (
        <div className="protected-route-forbidden">
          <h1>403 - Không có quyền truy cập</h1>
          <p>Bạn không có quyền truy cập trang này.</p>
          <button onClick={() => window.history.back()}>← Quay lại</button>
        </div>
      );
    }
  }

  // Authorized - render children
  return children;
};

export default ProtectedRoute;
