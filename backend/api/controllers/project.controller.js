import { prisma } from '../../configs/prisma.js';

const projectInclude = {
    tasks: true,
    members: { include: { user: true } }
};

export const getProjects = async (req, res) => {
    try {
        const { workspaceId, includeArchived } = req.query;

        const whereClause = {
            ...(workspaceId && { workspaceId }),
            ...(includeArchived !== "true" && { isArchived: false })
        };

        const projects = await prisma.project.findMany({
            where: whereClause,
            include: projectInclude
        });

        res.json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: "Failed to fetch projects" });
    }
};

export const createProject = async (req, res) => {
    try {
        const { id, name, description, priority, status, start_date, end_date, team_lead, workspaceId, progress } = req.body;

        let user = await prisma.user.findUnique({ where: { id: team_lead || "user_1" } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: team_lead || "user_1",
                    name: "Team Lead",
                    email: `lead_${Date.now()}@example.com`
                }
            });
        }

        const projectId = id || crypto.randomUUID();

        const newProject = await prisma.project.create({
    data: {
        id: projectId,
        name,
        description,
        priority: priority || 'MEDIUM',
        status: status || 'PLANNING',
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
        team_lead: user.id,
        workspaceId,
        progress: progress || 0,
        members: {
            create: {
                userId: user.id
            }
        }
    },
    include: projectInclude
});
        res.status(201).json(newProject);
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ error: "Failed to create project" });
    }
};

export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { members, tasks, owner, workspace, ...data } = req.body; // strip relations from body

        if (data.start_date) data.start_date = new Date(data.start_date);
        if (data.end_date) data.end_date = new Date(data.end_date);
        if (data.progress !== undefined) data.progress = Number(data.progress);

        const updatedProject = await prisma.project.update({
            where: { id },
            data,
            include: projectInclude
        });
        res.json(updatedProject);
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ error: "Failed to update project" });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.project.delete({ where: { id } });
        res.json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ error: "Failed to delete project" });
    }
};

export const addProjectMember = async (req, res) => {
    try {
        const { id: projectId } = req.params;
        const { userId, email } = req.body;

        let targetUserId = userId;

        // If email provided instead of userId, look up the user
        if (!targetUserId && email) {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) return res.status(404).json({ error: "User not found" });
            targetUserId = user.id;
        }

        const member = await prisma.projectMember.upsert({
            where: { userId_projectId: { userId: targetUserId, projectId } },
            update: {},
            create: { userId: targetUserId, projectId },
            include: { user: true }
        });

        res.status(201).json(member);
    } catch (error) {
        console.error("Error adding project member:", error);
        res.status(500).json({ error: "Failed to add project member" });
    }
};
export const archiveProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await prisma.project.update({
            where: { id },
            data: { isArchived: true },
            include: projectInclude
        });

        res.json(project);
    } catch (error) {
        console.error("Error archiving project:", error);
        res.status(500).json({ error: "Failed to archive project" });
    }
};
export const restoreProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await prisma.project.update({
            where: { id },
            data: { isArchived: false },
            include: projectInclude
        });

        res.json(project);
    } catch (error) {
        console.error("Error restoring project:", error);
        res.status(500).json({ error: "Failed to restore project" });
    }
};