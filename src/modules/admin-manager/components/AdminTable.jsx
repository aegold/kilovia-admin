/**
 * AdminTable.jsx - Table component to display admin list
 */

import React from "react";
import { getRoleDisplayName } from "@shared/constants/roles";

const AdminTable = ({
  admins,
  currentUserId,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  if (!admins || admins.length === 0) {
    return (
      <div className="admin-table-container">
        <div className="admin-empty">
          <h3>Không tìm thấy quản trị viên</h3>
          <p>Thử thay đổi bộ lọc hoặc tạo quản trị viên mới</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Người dùng</th>
            <th>Họ tên</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th style={{ width: "120px" }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => {
            const isCurrentUser = admin.id === currentUserId;
            const isSuperAdmin = admin.role === "SUPER_ADMIN";

            return (
              <tr key={admin.id}>
                {/* User info */}
                <td>
                  <div className="admin-user-info">
                    <div
                      className={`admin-avatar ${
                        !admin.isActive ? "inactive" : ""
                      }`}
                    >
                      {admin.fullName?.charAt(0)?.toUpperCase() ||
                        admin.username?.charAt(0)?.toUpperCase() ||
                        "A"}
                    </div>
                    <div className="admin-user-details">
                      <span className="admin-username">
                        {admin.username}
                        {isCurrentUser && (
                          <span className="current-user-label">(Bạn)</span>
                        )}
                      </span>
                      <span className="admin-email">{admin.email}</span>
                    </div>
                  </div>
                </td>

                {/* Full name */}
                <td>{admin.fullName || "—"}</td>

                {/* Role */}
                <td>
                  <span
                    className={`role-badge ${
                      admin.role === "SUPER_ADMIN" ? "super-admin" : "admin"
                    }`}
                  >
                    {getRoleDisplayName(admin.role)}
                  </span>
                </td>

                {/* Status */}
                <td>
                  <span
                    className={`status-badge ${
                      admin.isActive ? "active" : "inactive"
                    }`}
                  >
                    <span className="status-dot"></span>
                    {admin.isActive ? "Hoạt động" : "Vô hiệu hóa"}
                  </span>
                </td>

                {/* Created date */}
                <td>
                  {admin.createdAt
                    ? new Date(admin.createdAt).toLocaleDateString("vi-VN")
                    : "—"}
                </td>

                {/* Actions */}
                <td>
                  <div className="admin-actions">
                    {/* Edit button */}
                    <button
                      className="action-btn edit"
                      title="Chỉnh sửa"
                      onClick={() => onEdit(admin)}
                    >
                      Sửa
                    </button>

                    {/* Toggle status button */}
                    <button
                      className="action-btn toggle"
                      title={admin.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                      onClick={() => onToggleStatus(admin)}
                      disabled={isCurrentUser}
                    >
                      {admin.isActive ? "Tắt" : "Bật"}
                    </button>

                    {/* Delete button */}
                    <button
                      className="action-btn delete"
                      title="Xóa"
                      onClick={() => onDelete(admin)}
                      disabled={isCurrentUser || isSuperAdmin}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
