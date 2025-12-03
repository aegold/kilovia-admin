/**
 * roles.js - Role constants and permission helpers
 *
 * Roles:
 * - SUPER_ADMIN: Full system access (CRUD admins, approve reset, view logs)
 * - ADMIN: Limited access (view own profile, change own password)
 */

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
};

/**
 * Permission definitions by role
 */
export const PERMISSIONS = {
  // Admin management
  VIEW_ADMINS: [ROLES.SUPER_ADMIN],
  CREATE_ADMIN: [ROLES.SUPER_ADMIN],
  UPDATE_ADMIN: [ROLES.SUPER_ADMIN],
  DELETE_ADMIN: [ROLES.SUPER_ADMIN],

  // Password reset management
  VIEW_RESET_REQUESTS: [ROLES.SUPER_ADMIN],
  APPROVE_RESET_REQUEST: [ROLES.SUPER_ADMIN],
  REJECT_RESET_REQUEST: [ROLES.SUPER_ADMIN],

  // Audit logs
  VIEW_AUDIT_LOGS: [ROLES.SUPER_ADMIN],

  // Self management (all roles)
  VIEW_OWN_PROFILE: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  CHANGE_OWN_PASSWORD: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  REQUEST_PASSWORD_RESET: [ROLES.SUPER_ADMIN, ROLES.ADMIN],

  // Question management (all roles for now)
  MANAGE_QUESTIONS: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  MANAGE_TOPICS: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
};

/**
 * Check if a role has a specific permission
 * @param {string} userRole - User's role (SUPER_ADMIN or ADMIN)
 * @param {string} permission - Permission key from PERMISSIONS
 * @returns {boolean}
 */
export const hasPermission = (userRole, permission) => {
  const allowedRoles = PERMISSIONS[permission];
  if (!allowedRoles) {
    console.warn(`Unknown permission: ${permission}`);
    return false;
  }
  return allowedRoles.includes(userRole);
};

/**
 * Check if user is Super Admin
 * @param {string} userRole
 * @returns {boolean}
 */
export const isSuperAdmin = (userRole) => {
  return userRole === ROLES.SUPER_ADMIN;
};

/**
 * Get role display name (Vietnamese)
 * @param {string} role
 * @returns {string}
 */
export const getRoleDisplayName = (role) => {
  const displayNames = {
    [ROLES.SUPER_ADMIN]: "Quản trị viên cấp cao",
    [ROLES.ADMIN]: "Quản trị viên",
  };
  return displayNames[role] || role;
};

export default ROLES;
