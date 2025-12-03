/**
 * Admin Manager Module - Main Page Component
 * SUPER_ADMIN only - Manage all admin accounts
 */

import React, { useState, useEffect, useCallback } from "react";
import { adminService } from "@shared/services/adminService";
import { useToast } from "@shared/components/Toast";
import { useAuth } from "@shared/context/AuthContext";
import AdminHeader from "./components/AdminHeader";
import AdminTable from "./components/AdminTable";
import AdminModal from "./components/AdminModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import PasswordResetRequestsModal from "./components/PasswordResetRequestsModal";
import "./QuanLyAdmin.css";

const QuanLyAdmin = () => {
  const toast = useToast();
  const { user } = useAuth();

  // Data state
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'active', 'inactive'
  const [roleFilter, setRoleFilter] = useState("all"); // 'all', 'ADMIN', 'SUPER_ADMIN'

  // Modal state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAdmin, setDeletingAdmin] = useState(null);
  const [showResetRequests, setShowResetRequests] = useState(false);

  /**
   * Fetch all admins
   */
  const fetchAdmins = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await adminService.getAllAdmins();
      setAdmins(data);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
      setError("Không thể tải danh sách quản trị viên");
      toast.error("Không thể tải danh sách quản trị viên");
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load admins on mount
  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  /**
   * Filter admins based on search and filters
   */
  const filteredAdmins = admins.filter((admin) => {
    // Search filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      admin.username?.toLowerCase().includes(searchLower) ||
      admin.email?.toLowerCase().includes(searchLower) ||
      admin.fullName?.toLowerCase().includes(searchLower);

    // Status filter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && admin.isActive) ||
      (statusFilter === "inactive" && !admin.isActive);

    // Role filter
    const matchesRole = roleFilter === "all" || admin.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  /**
   * Handle create new admin
   */
  const handleCreateAdmin = () => {
    setEditingAdmin(null);
    setShowAdminModal(true);
  };

  /**
   * Handle edit admin
   */
  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setShowAdminModal(true);
  };

  /**
   * Handle delete admin click
   */
  const handleDeleteClick = (admin) => {
    setDeletingAdmin(admin);
    setShowDeleteConfirm(true);
  };

  /**
   * Confirm delete admin
   */
  const handleConfirmDelete = async () => {
    if (!deletingAdmin) return;

    try {
      await adminService.deleteAdmin(deletingAdmin.id);
      toast.success(`Đã xóa quản trị viên "${deletingAdmin.username}"`);
      fetchAdmins();
    } catch (err) {
      console.error("Delete admin failed:", err);
      if (err.response?.status === 403) {
        toast.error("Bạn không có quyền xóa quản trị viên này");
      } else {
        toast.error("Không thể xóa quản trị viên");
      }
    } finally {
      setShowDeleteConfirm(false);
      setDeletingAdmin(null);
    }
  };

  /**
   * Handle toggle admin status
   */
  const handleToggleStatus = async (admin) => {
    try {
      await adminService.updateAdminStatus(admin.id, !admin.isActive);
      toast.success(
        `Đã ${!admin.isActive ? "kích hoạt" : "vô hiệu hóa"} tài khoản "${
          admin.username
        }"`
      );
      fetchAdmins();
    } catch (err) {
      console.error("Toggle status failed:", err);
      if (err.response?.status === 403) {
        toast.error("Bạn không có quyền thay đổi trạng thái này");
      } else {
        toast.error("Không thể thay đổi trạng thái tài khoản");
      }
    }
  };

  /**
   * Handle admin modal save (create/edit)
   */
  const handleAdminSave = async (adminData, isEdit) => {
    try {
      if (isEdit) {
        await adminService.updateAdmin(editingAdmin.id, adminData);
        toast.success("Cập nhật quản trị viên thành công");
      } else {
        await adminService.createAdmin(adminData);
        toast.success("Tạo quản trị viên mới thành công");
      }
      setShowAdminModal(false);
      setEditingAdmin(null);
      fetchAdmins();
    } catch (err) {
      console.error("Save admin failed:", err);

      // Handle specific errors
      if (err.response?.status === 409) {
        const message = err.response.data?.message || "";
        if (message.toLowerCase().includes("username")) {
          throw new Error("Tên đăng nhập đã tồn tại");
        } else if (message.toLowerCase().includes("email")) {
          throw new Error("Email đã tồn tại");
        }
        throw new Error("Thông tin đã tồn tại trong hệ thống");
      } else if (err.response?.status === 403) {
        throw new Error("Bạn không có quyền thực hiện thao tác này");
      }
      throw new Error("Không thể lưu thông tin quản trị viên");
    }
  };

  return (
    <div className="admin-manager-page">
      {/* Header */}
      <AdminHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        onCreateAdmin={handleCreateAdmin}
        onShowResetRequests={() => setShowResetRequests(true)}
        totalCount={admins.length}
        filteredCount={filteredAdmins.length}
      />

      {/* Content */}
      <div className="admin-manager-content">
        {isLoading ? (
          <div className="admin-loading">
            <div className="loading-spinner"></div>
            <p>Đang tải danh sách quản trị viên...</p>
          </div>
        ) : error ? (
          <div className="admin-error">
            <p>{error}</p>
            <button onClick={fetchAdmins} className="btn btn-primary">
              Thử lại
            </button>
          </div>
        ) : (
          <AdminTable
            admins={filteredAdmins}
            currentUserId={user?.adminId}
            onEdit={handleEditAdmin}
            onDelete={handleDeleteClick}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>

      {/* Modals */}
      <AdminModal
        isOpen={showAdminModal}
        onClose={() => {
          setShowAdminModal(false);
          setEditingAdmin(null);
        }}
        admin={editingAdmin}
        onSave={handleAdminSave}
      />

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingAdmin(null);
        }}
        admin={deletingAdmin}
        onConfirm={handleConfirmDelete}
      />

      <PasswordResetRequestsModal
        isOpen={showResetRequests}
        onClose={() => setShowResetRequests(false)}
      />
    </div>
  );
};

export default QuanLyAdmin;
