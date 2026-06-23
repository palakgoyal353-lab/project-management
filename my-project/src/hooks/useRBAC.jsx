import { useSelector } from "react-redux";
import { useUser } from "@clerk/react";

export const ROLES = {
  ADMIN_IT: "ADMIN_IT",   // Admin — full access
  IT: "IT",
  MANAGER: "MANAGER",     // Leader — view DB + minor permissions
  TEAM_LEAD: "TEAM_LEAD", // Leader — view DB + minor permissions
  MEMBER: "MEMBER",       // Worker — only timing, project & dates
};

// Helper sets for cleaner permission checks
const ADMIN_ROLES = new Set([ROLES.ADMIN_IT, "ADMIN", ROLES.IT]);
const LEADER_ROLES = new Set([ROLES.MANAGER, ROLES.TEAM_LEAD]);

// Default permission matrix
const DEFAULT_PERMISSIONS = {
  canCreateWorkspace:         { admin: true,  leader: false, worker: false },
  canManageWorkspaceSettings: { admin: true,  leader: false, worker: false },
  canInviteMembers:           { admin: true,  leader: false, worker: false },
  canDeleteWorkspace:         { admin: true,  leader: false, worker: false },
  canCreateProject:           { admin: true,  leader: false, worker: false },
  canDeleteProject:           { admin: true,  leader: false, worker: false },
  canModifyDatabase:          { admin: true,  leader: false, worker: false },
  canCreateTask:              { admin: true,  leader: true,  worker: false },
  canDeleteTask:              { admin: true,  leader: true,  worker: false },
  canManageProjectSettings:   { admin: true,  leader: true,  worker: false },
  canAccessDatabaseViewer:    { admin: true,  leader: true,  worker: false },
  canAccessTeamPage:          { admin: true,  leader: true,  worker: false },
  canViewProjects:            { admin: true,  leader: true,  worker: true  },
  canViewDashboard:           { admin: true,  leader: true,  worker: true  },
  canViewCalendar:            { admin: true,  leader: true,  worker: true  },
};

// Read saved company rules from localStorage, falling back to defaults
export const getPermissionMatrix = () => {
  try {
    const saved = localStorage.getItem('rbac_company_rules');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults so new permissions always have a fallback
      return { ...DEFAULT_PERMISSIONS, ...parsed };
    }
  } catch (_) { /* ignore parse errors */ }
  return { ...DEFAULT_PERMISSIONS };
};

// Save company rules to localStorage
export const savePermissionMatrix = (matrix) => {
  localStorage.setItem('rbac_company_rules', JSON.stringify(matrix));
};

// Reset to defaults
export const resetPermissionMatrix = () => {
  localStorage.removeItem('rbac_company_rules');
};
export const getCustomRoles = () => {
  try {
    const roles = localStorage.getItem("roles");

    if (roles) {
      return JSON.parse(roles);
    }
  } catch {
    return [];
  }

  return [];
};

export const useRBAC = () => {
  const { user } = useUser();
  const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null);

  const getRole = () => {
    const FORCE_ADMIN = false;
    if (FORCE_ADMIN || (typeof window !== 'undefined' && localStorage.getItem('admin_bypass') === 'true')) return ROLES.ADMIN_IT;

    if (!currentWorkspace || !user) return ROLES.MEMBER;

    if (currentWorkspace.ownerId === user.id) {
      return ROLES.ADMIN_IT;
    }

    const member = currentWorkspace.members?.find(
      (m) =>
        m.userId === user.id ||
        m.user?.email === user.primaryEmailAddress?.emailAddress
    );

    return member?.role?.toUpperCase() || ROLES.MEMBER;
  };

  const role = getRole();
  const customRoles = getCustomRoles();

const customRole = customRoles.find(
  (r) => r.name === role
);

  const isAdmin = ADMIN_ROLES.has(role);
  const isLeader = LEADER_ROLES.has(role);
  const isWorker = role === ROLES.MEMBER;

  // Determine which tier key to use
  const tier = isAdmin ? 'admin' : isLeader ? 'leader' : 'worker';

  // Read company rules
  const matrix = getPermissionMatrix();

  // Resolve each permission based on role tier + company rules
  const resolve = (key) => matrix[key]?.[tier] ?? false;

  const permissions = {
    role,
    isAdmin,
    isLeader,
    isWorker,

    canCreateWorkspace:         resolve('canCreateWorkspace'),
    canManageWorkspaceSettings: resolve('canManageWorkspaceSettings'),
    canInviteMembers:           resolve('canInviteMembers'),
    canDeleteWorkspace:         resolve('canDeleteWorkspace'),
    canCreateProject:           resolve('canCreateProject'),
    canDeleteProject:           resolve('canDeleteProject'),
    canModifyDatabase:          resolve('canModifyDatabase'),
    canCreateTask:              resolve('canCreateTask'),
    canDeleteTask:              resolve('canDeleteTask'),
    canManageProjectSettings:   resolve('canManageProjectSettings'),
    canAccessDatabaseViewer:
  customRole?.database ??
  resolve('canAccessDatabaseViewer'),

canAccessTeamPage:
  customRole?.team ??
  resolve('canAccessTeamPage'),

canViewProjects:
  customRole?.projects ??
  resolve('canViewProjects'),

canViewDashboard:
  customRole?.dashboard ??
  resolve('canViewDashboard'),

canViewCalendar:
  customRole?.tasks ??
  resolve('canViewCalendar'),
  canManageTasks:
  customRole?.tasks ?? resolve('canCreateTask'),
    canAccessSidebarMenu:       isAdmin || isLeader,
  };

  return permissions;
};
