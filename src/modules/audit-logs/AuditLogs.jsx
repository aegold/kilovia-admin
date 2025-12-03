/**
 * Audit Logs Module - Main Page Component
 * SUPER_ADMIN only - View system audit logs
 */

import React, { useState, useEffect, useCallback } from "react";
import { adminService } from "@shared/services/adminService";
import { useToast } from "@shared/components/Toast";
import "./AuditLogs.css";

// Action types mapping for display
const ACTION_TYPES = {
  LOGIN_SUCCESS: { label: "Đăng nhập thành công", color: "success" },
  LOGIN_FAILED: { label: "Đăng nhập thất bại", color: "danger" },
  LOGOUT: { label: "Đăng xuất", color: "info" },
  PASSWORD_CHANGED: { label: "Đổi mật khẩu", color: "warning" },
  PASSWORD_RESET_REQUESTED: { label: "Yêu cầu reset MK", color: "warning" },
  PASSWORD_RESET_APPROVED: { label: "Duyệt reset MK", color: "success" },
  PASSWORD_RESET_REJECTED: { label: "Từ chối reset MK", color: "danger" },
  ADMIN_CREATED: { label: "Tạo admin mới", color: "success" },
  ADMIN_UPDATED: { label: "Cập nhật admin", color: "info" },
  ADMIN_DELETED: { label: "Xóa admin", color: "danger" },
  ADMIN_STATUS_CHANGED: { label: "Đổi trạng thái admin", color: "warning" },
  TOKEN_REFRESHED: { label: "Làm mới token", color: "info" },
};

// Get action display info
const getActionInfo = (action) => {
  return ACTION_TYPES[action] || { label: action, color: "default" };
};

const AuditLogs = () => {
  const toast = useToast();

  // Data state
  const [logs, setLogs] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [adminFilter, setAdminFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 20;

  /**
   * Fetch audit logs
   */
  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const filters = {};
      if (adminFilter) filters.adminId = adminFilter;
      if (actionFilter) filters.action = actionFilter;

      const data = await adminService.getAuditLogs(filters);
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
      setError("Không thể tải nhật ký hoạt động");
      toast.error("Không thể tải nhật ký hoạt động");
    } finally {
      setIsLoading(false);
    }
  }, [adminFilter, actionFilter, toast]);

  /**
   * Fetch admins for filter dropdown
   */
  const fetchAdmins = useCallback(async () => {
    try {
      const data = await adminService.getAllAdmins();
      setAdmins(data);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // Load logs when filters change
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [adminFilter, actionFilter, dateFromFilter, dateToFilter]);

  /**
   * Filter logs by date (client-side)
   */
  const filteredLogs = logs.filter((log) => {
    if (!dateFromFilter && !dateToFilter) return true;

    const logDate = new Date(log.createdAt);

    if (dateFromFilter) {
      const fromDate = new Date(dateFromFilter);
      fromDate.setHours(0, 0, 0, 0);
      if (logDate < fromDate) return false;
    }

    if (dateToFilter) {
      const toDate = new Date(dateToFilter);
      toDate.setHours(23, 59, 59, 999);
      if (logDate > toDate) return false;
    }

    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const startIndex = (currentPage - 1) * logsPerPage;
  const paginatedLogs = filteredLogs.slice(
    startIndex,
    startIndex + logsPerPage
  );

  /**
   * Format date time
   */
  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  /**
   * Clear all filters
   */
  const handleClearFilters = () => {
    setAdminFilter("");
    setActionFilter("");
    setDateFromFilter("");
    setDateToFilter("");
  };

  return (
    <div className="audit-logs-page">
      {/* Header */}
      <div className="audit-header">
        <div className="audit-header-container">
          <div className="audit-header-top">
            <div className="audit-header-title">
              <h1>Nhật Ký Hoạt Động</h1>
              <span className="audit-count-badge">
                {filteredLogs.length} bản ghi
              </span>
            </div>

            <button
              className="btn btn-secondary"
              onClick={fetchLogs}
              disabled={isLoading}
            >
              Làm mới
            </button>
          </div>

          {/* Filters */}
          <div className="audit-filters">
            {/* Admin filter */}
            <select
              className="audit-filter-select"
              value={adminFilter}
              onChange={(e) => setAdminFilter(e.target.value)}
            >
              <option value="">Tất cả Admin</option>
              {admins.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.fullName || admin.username}
                </option>
              ))}
            </select>

            {/* Action filter */}
            <select
              className="audit-filter-select"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="">Tất cả hành động</option>
              {Object.entries(ACTION_TYPES).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            {/* Date from */}
            <div className="date-filter">
              <label>Từ ngày:</label>
              <input
                type="date"
                value={dateFromFilter}
                onChange={(e) => setDateFromFilter(e.target.value)}
              />
            </div>

            {/* Date to */}
            <div className="date-filter">
              <label>Đến ngày:</label>
              <input
                type="date"
                value={dateToFilter}
                onChange={(e) => setDateToFilter(e.target.value)}
              />
            </div>

            {/* Clear filters */}
            {(adminFilter ||
              actionFilter ||
              dateFromFilter ||
              dateToFilter) && (
              <button className="btn btn-text" onClick={handleClearFilters}>
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="audit-content">
        {isLoading ? (
          <div className="audit-loading">
            <div className="loading-spinner"></div>
            <p>Đang tải nhật ký...</p>
          </div>
        ) : error ? (
          <div className="audit-error">
            <p>{error}</p>
            <button onClick={fetchLogs} className="btn btn-primary">
              Thử lại
            </button>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="audit-empty">
            <h3>Không có nhật ký</h3>
            <p>Không tìm thấy nhật ký hoạt động nào phù hợp với bộ lọc.</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="audit-table-container">
              <table className="audit-table">
                <thead>
                  <tr>
                    <th style={{ width: "180px" }}>Thời gian</th>
                    <th style={{ width: "160px" }}>Admin</th>
                    <th style={{ width: "180px" }}>Hành động</th>
                    <th>Chi tiết</th>
                    <th style={{ width: "140px" }}>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map((log) => {
                    const actionInfo = getActionInfo(log.action);
                    return (
                      <tr key={log.id}>
                        <td className="log-time">
                          {formatDateTime(log.createdAt)}
                        </td>
                        <td>
                          <div className="log-admin">
                            <span className="admin-name">
                              {log.adminUsername ||
                                log.admin?.fullName ||
                                log.admin?.username ||
                                "—"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className={`action-badge ${actionInfo.color}`}>
                            {actionInfo.label}
                          </span>
                        </td>
                        <td className="log-details">
                          {typeof log.details === "object"
                            ? JSON.stringify(log.details)
                            : log.details || "—"}
                        </td>
                        <td className="log-ip">{log.ipAddress || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="audit-pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>

                <span className="pagination-info">
                  Trang {currentPage} / {totalPages}
                </span>

                <button
                  className="pagination-btn"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  ›
                </button>
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
