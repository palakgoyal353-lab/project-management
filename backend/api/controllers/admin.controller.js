import { prisma } from '../../configs/prisma.js';
import crypto from 'crypto';

export const getAllDbData = async (req, res) => {
  try {
    const [
      users,
      workspaces,
      workspaceMembers,
      projects,
      projectMembers,
      tasks,
      comments,
    ] = await Promise.all([
      prisma.user.findMany(),
      prisma.workspace.findMany(),
      prisma.workspaceMember.findMany(),
      prisma.project.findMany(),
      prisma.projectMember.findMany(),
      prisma.task.findMany(),
      prisma.comment.findMany(),
    ]);

    res.json({
      users,
      workspaces,
      workspaceMembers,
      projects,
      projectMembers,
      tasks,
      comments,
    });
  } catch (err) {
    console.error('Admin DB fetch error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Map URL table-key → Prisma model delegate
const MODEL_MAP = {
  users:            () => prisma.user,
  workspaces:       () => prisma.workspace,
  workspaceMembers: () => prisma.workspaceMember,
  projects:         () => prisma.project,
  projectMembers:   () => prisma.projectMember,
  tasks:            () => prisma.task,
  comments:         () => prisma.comment,
};

export const deleteRecord = async (req, res) => {
  const { table, id } = req.params;
  const modelFn = MODEL_MAP[table];
  if (!modelFn) {
    return res.status(400).json({ error: `Unknown table: ${table}` });
  }
  try {
    await modelFn().delete({ where: { id } });
    res.json({ success: true, table, id });
  } catch (err) {
    console.error(`Admin delete error (${table}/${id}):`, err);
    res.status(500).json({ error: err.message });
  }
};

export const seedDb = async (req, res) => {
  const { workspaceId } = req.body;
  if (!workspaceId) return res.status(400).json({ error: "workspaceId is required for seeding" });

  try {
    // 1. Get workspace and its owner
    const ws = await prisma.workspace.findUnique({ where: { id: workspaceId } });
    if (!ws) return res.status(404).json({ error: "Workspace not found" });
    const ownerId = ws.ownerId;

    // 2. Create mock users
    const mockUsersData = [
      { id: "mock_user_jane", name: "Jane Manager", email: "jane@example.com", image: "https://ui-avatars.com/api/?name=Jane+Manager&background=random" },
      { id: "mock_user_alex", name: "Alex Lead", email: "alex@example.com", image: "https://ui-avatars.com/api/?name=Alex+Lead&background=random" },
      { id: "mock_user_it", name: "IT Specialist", email: "it@example.com", image: "https://ui-avatars.com/api/?name=IT+Specialist&background=random" }
    ];

    for (const u of mockUsersData) {
      await prisma.user.upsert({
        where: { id: u.id },
        update: {},
        create: u
      });
    }

    // 3. Create workspace memberships for the mock users
    const mockMembersData = [
      { userId: "mock_user_jane", workspaceId, role: "MANAGER" },
      { userId: "mock_user_alex", workspaceId, role: "TEAM_LEAD" },
      { userId: "mock_user_it", workspaceId, role: "IT" }
    ];

    for (const m of mockMembersData) {
      await prisma.workspaceMember.upsert({
        where: { userId_workspaceId: { userId: m.userId, workspaceId: m.workspaceId } },
        update: { role: m.role },
        create: m
      });
    }

    // 4. Create mock projects
    const p1_id = crypto.randomUUID();
    const p2_id = crypto.randomUUID();
    
    await prisma.project.create({
      data: {
        id: p1_id,
        name: "Cloud Migration ☁️",
        description: "Moving core API servers and SQL databases to low-latency serverless Neon postgres clusters.",
        priority: "HIGH",
        status: "ACTIVE",
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        team_lead: ownerId,
        workspaceId,
        progress: 35,
        members: {
          create: [
            { userId: "mock_user_jane" },
            { userId: "mock_user_it" }
          ]
        }
      }
    });

    await prisma.project.create({
      data: {
        id: p2_id,
        name: "UI Refactoring 🎨",
        description: "Upgrade the UI components with premium dark-mode, glassmorphism card panels, and smooth framer motion animations.",
        priority: "MEDIUM",
        status: "PLANNING",
        start_date: new Date(),
        end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        team_lead: "mock_user_alex",
        workspaceId,
        progress: 10,
        members: {
          create: [
            { userId: ownerId },
            { userId: "mock_user_jane" }
          ]
        }
      }
    });

    // 5. Create mock tasks
    await prisma.task.createMany({
      data: [
        {
          id: crypto.randomUUID(),
          projectId: p1_id,
          title: "Migrate database tables to Neon postgres",
          description: "Push local dev.db schema to neon.tech, configure connection strings, and audit query times.",
          status: "IN_PROGRESS",
          type: "TASK",
          priority: "HIGH",
          assigneeId: "mock_user_it",
          due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: crypto.randomUUID(),
          projectId: p1_id,
          title: "Review IAM / security policies",
          description: "Audit clerk authorization tokens and tighten CORS rules for railway deployment.",
          status: "TODO",
          type: "BUG",
          priority: "MEDIUM",
          assigneeId: ownerId,
          due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // Overdue!
        },
        {
          id: crypto.randomUUID(),
          projectId: p2_id,
          title: "Design hero landing layout",
          description: "Draft high-fidelity mockups for landing page with Outfit typography and floating gradients.",
          status: "DONE",
          type: "STORY",
          priority: "HIGH",
          assigneeId: "mock_user_alex",
          due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        }
      ]
    });

    res.json({ success: true, message: "Demo workspace seeded successfully!" });
  } catch (err) {
    console.error("Seeding error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const resetDb = async (req, res) => {
  const { workspaceId } = req.body;
  if (!workspaceId) return res.status(400).json({ error: "workspaceId is required" });

  try {
    const ws = await prisma.workspace.findUnique({ where: { id: workspaceId } });
    if (!ws) return res.status(404).json({ error: "Workspace not found" });

    // Wipe all comments, tasks, projects, project members, and workspace members (except the workspace owner)
    await prisma.$transaction([
      prisma.comment.deleteMany(),
      prisma.task.deleteMany(),
      prisma.projectMember.deleteMany(),
      prisma.project.deleteMany({ where: { workspaceId } }),
      prisma.workspaceMember.deleteMany({
        where: {
          workspaceId,
          userId: { not: ws.ownerId }
        }
      }),
      // Delete mock users
      prisma.user.deleteMany({
        where: {
          id: { in: ["mock_user_jane", "mock_user_alex", "mock_user_it"] }
        }
      })
    ]);

    res.json({ success: true, message: "Workspace reset successfully to a clean slate!" });
  } catch (err) {
    console.error("Reset database error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ----- Role Management Endpoints ----- */

// In-memory role definitions (could be moved to DB later)
const roles = {
  ADMIN: {
    canModifyDatabase: true,
    canManageProjectSettings: true,
    canCreateTask: true,
    canAccessCalendar: true,
  },
  LEADER: {
    canModifyDatabase: false,
    canManageProjectSettings: true,
    canCreateTask: true,
    canAccessCalendar: true,
  },
  EMPLOYEE: {
    canModifyDatabase: false,
    canManageProjectSettings: false,
    canCreateTask: false,
    canAccessCalendar: true,
  },
};

/** Get list of all role definitions */
export const getRoles = async (req, res) => {
  try {
    res.json({ roles });
  } catch (err) {
    console.error('Get roles error:', err);
    res.status(500).json({ error: err.message });
  }
};

/** Create a new custom role */
export const createRole = async (req, res) => {
  const { roleName, permissions } = req.body;
  if (!roleName || typeof permissions !== "object") {
    return res.status(400).json({ error: 'roleName and permissions object required' });
  }
  if (roles[roleName]) {
    return res.status(409).json({ error: 'Role already exists' });
  }
  roles[roleName] = permissions;
  res.status(201).json({ message: 'Role created', role: { [roleName]: permissions } });
};

/** Update permissions for an existing role */
export const updateRole = async (req, res) => {
  const { roleName, permissions } = req.body;
  if (!roleName || typeof permissions !== "object") {
    return res.status(400).json({ error: 'roleName and permissions object required' });
  }
  if (!roles[roleName]) {
    return res.status(404).json({ error: 'Role not found' });
  }
  roles[roleName] = { ...roles[roleName], ...permissions };
  res.json({ message: 'Role updated', role: { [roleName]: roles[roleName] } });
};

/** Delete a role definition */
export const deleteRole = async (req, res) => {
  const { roleName } = req.params;
  if (!roles[roleName]) {
    return res.status(404).json({ error: 'Role not found' });
  }
  delete roles[roleName];
  res.json({ message: 'Role deleted' });
};

/** Assign a role to a user */
export const assignRoleToUser = async (req, res) => {
  const { userId, roleName } = req.body;
  if (!roles[roleName]) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: roleName },
    });
    res.json({ success: true, userId, role: roleName });
  } catch (err) {
    console.error('Assign role error:', err);
    res.status(500).json({ error: err.message });
  }
};

/** Get role of a specific user */
export const getUserRole = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ userId, role: user.role });
  } catch (err) {
    console.error('Get user role error:', err);
    res.status(500).json({ error: err.message });
  }
};

/* ----- End of Role Management ----- */
