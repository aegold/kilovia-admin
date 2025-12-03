/**
 * PasswordResetRequestsModal.jsx - Modal to manage password reset requests
 */

import React, { useState, useEffect, useCallback } from "react";
import { adminService } from "@shared/services/adminService";
import { useToast } from "@shared/components/Toast";
import "./PasswordResetRequestsModal.css";

const PasswordResetRequestsModal = ({ isOpen, onClose }) => {
  const toast = useToast();

  // Data state
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("PENDING");

  // Modal state for approve
  const [approvingRequest, setApprovingRequest] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Fetch reset requests
   */
  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getPasswordResetRequests(
        statusFilter || null
      );
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch reset requests:", err);
      toast.error("Không thể tải danh sách yêu cầu");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, toast]);

  // Load requests when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchRequests();
    }
  }, [isOpen, fetchRequests]);

  /**
   * Handle approve click
   */
  const handleApproveClick = (request) => {
    setApprovingRequest(request);
    setNewPassword("");
    setShowPassword(false);
  };

  /**
   * Confirm approve
   */
  const handleConfirmApprove = async () => {
    if (!newPassword || newPassword.length < 8) {
      toast.error("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }

    setIsProcessing(true);
    try {
      await adminService.approvePasswordReset(approvingRequest.id, newPassword);
      toast.success("Đã duyệt yêu cầu đặt lại mật khẩu");
      setApprovingRequest(null);
      fetchRequests();
    } catch (err) {
      console.error("Approve failed:", err);
      toast.error("Không thể duyệt yêu cầu");
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Handle reject
   */
  const handleReject = async (request) => {
    if (!confirm("Bạn có chắc muốn từ chối yêu cầu này?")) {
      return;
    }

    setIsProcessing(true);
    try {
      await adminService.rejectPasswordReset(request.id);
      toast.success("Đã từ chối yêu cầu");
      fetchRequests();
    } catch (err) {
      console.error("Reject failed:", err);
      toast.error("Không thể từ chối yêu cầu");
    } finally {
      setIsProcessing(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { class: "pending", label: "Đang chờ" },
      APPROVED: { class: "approved", label: "Đã duyệt" },
      REJECTED: { class: "rejected", label: "Đã từ chối" },
    };
    return badges[status] || { class: "", label: status };
  };

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isProcessing) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container reset-requests-modal">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Yêu cầu đặt lại mật khẩu</h2>
          <button
            className="modal-close"
            onClick={onClose}
            disabled={isProcessing}
          >
            ×
          </button>
        </div>

        {/* Filter */}
        <div className="reset-filter">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            disabled={isLoading}
          >
            <option value="">Tất cả</option>
            <option value="PENDING">Đang chờ</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="REJECTED">Đã từ chối</option>
          </select>
        </div>

        {/* Content */}
        <div className="modal-body reset-requests-body">
          {isLoading ? (
            <div className="reset-loading">
              <div className="loading-spinner"></div>
              <p>Đang tải...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="reset-empty">
              <p>Không có yêu cầu nào</p>
            </div>
          ) : (
            <div className="reset-list">
              {requests.map((request) => {
                const statusBadge = getStatusBadge(request.status);
                return (
                  <div key={request.id} className="reset-item">
                    <div className="reset-item-header">
                      <div className="reset-admin-info">
                        <span className="reset-admin-name">
                          {request.admin?.fullName || request.admin?.username}
                        </span>
                        <span className="reset-admin-email">
                          {request.admin?.email}
                        </span>
                      </div>
                      <span className={`reset-status ${statusBadge.class}`}>
                        {statusBadge.label}
                      </span>
                    </div>

                    <div className="reset-item-body">
                      <p className="reset-reason">
                        <strong>Lý do:</strong> {request.reason || "Không có"}
                      </p>
                      <p className="reset-date">
                        <strong>Ngày yêu cầu:</strong>{" "}
                        {formatDate(request.createdAt)}
                      </p>
                    </div>

                    {request.status === "PENDING" && (
                      <div className="reset-item-actions">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleApproveClick(request)}
                          disabled={isProcessing}
                        >
                          Duyệt
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleReject(request)}
                          disabled={isProcessing}
                        >
                          Từ chối
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Approve Dialog */}
        {approvingRequest && (
          <div className="approve-dialog">
            <div className="approve-dialog-content">
              <h3>Đặt mật khẩu mới</h3>
              <p>
                Đặt mật khẩu mới cho{" "}
                <strong>
                  {approvingRequest.admin?.fullName ||
                    approvingRequest.admin?.username}
                </strong>
              </p>

              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isProcessing}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "\u25CF\u25CF\u25CF" : "Xem"}
                </button>
              </div>

              <div className="approve-dialog-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setApprovingRequest(null)}
                  disabled={isProcessing}
                >
                  Hủy
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleConfirmApprove}
                  disabled={isProcessing || !newPassword}
                >
                  {isProcessing ? "Đang xử lý..." : "Xác nhận"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordResetRequestsModal;
