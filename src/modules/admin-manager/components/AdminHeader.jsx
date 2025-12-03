/**
 * AdminHeader.jsx - Header component for Admin Management page
 * Contains search, filters, and action buttons
 */

import React from "react";

const AdminHeader = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  roleFilter,
  onRoleFilterChange,
  onCreateAdmin,
  onShowResetRequests,
  totalCount,
  filteredCount,
}) => {
  return (
    <div className="admin-header">
      <div className="admin-header-container">
        {/* Top row - Title and actions */}
        <div className="admin-header-top">
          <div className="admin-header-title">
            <h1>Quản Lý Admin</h1>
            <span className="admin-count-badge">
              {filteredCount === totalCount
                ? `${totalCount} admin`
                : `${filteredCount}/${totalCount} admin`}
            </span>
          </div>

          <div className="admin-header-actions">
            <button className="btn btn-warning" onClick={onShowResetRequests}>
              Yêu cầu đặt lại MK
            </button>
            <button className="btn btn-primary" onClick={onCreateAdmin}>
              + Tạo Admin mới
            </button>
          </div>
        </div>

        {/* Bottom row - Filters */}
        <div className="admin-filters">
          {/* Search */}
          <div className="admin-search">
            <span className="admin-search-icon">⌕</span>
            <input
              type="text"
              placeholder="Tìm theo tên, email, username..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <select
            className="admin-filter-select"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Đã vô hiệu hóa</option>
          </select>

          {/* Role filter */}
          <select
            className="admin-filter-select"
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
          >
            <option value="all">Tất cả vai trò</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
