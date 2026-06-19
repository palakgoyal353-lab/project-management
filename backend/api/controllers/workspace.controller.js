import { prisma } from '../../configs/prisma.js';

export const getWorkspaces = async (req, res) => {
    try {
        const workspaces = await prisma.workspace.findMany({
            include: {
                members: {
                    include: { user: true }
                },
                projects: {
                    include: {
                        tasks: true,
                        members: {
                            include: { user: true }
                        }
                    }
                }
            }
        });
        console.log(JSON.stringify(workspaces, null, 2));
        res.json(workspaces);
    } catch (error) {
        console.error("Error fetching workspaces:", error);
        res.status(500).json({ error: "Failed to fetch workspaces" });
    }
};

export const createWorkspace = async (req, res) => {
    try {
        const { id, name, slug, description, ownerId, image_url } = req.body;
        const workspaceId = id || crypto.randomUUID();
        const oId = ownerId || "user_1";

        let user = await prisma.user.findUnique({ where: { id: oId } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: oId,
                    name: "Demo User",
                    email: `demo_${Date.now()}@example.com`
                }
            });
        }

        const newWorkspace = await prisma.workspace.create({
            data: {
                id: workspaceId,
                name,
                slug: slug || name.toLowerCase().replace(/ /g, '-') + '-' + Date.now(),
                description,
                ownerId: user.id,
                image_url: image_url || "",
                members: {
                    create: {
                        userId: user.id,
                        role: "ADMIN"
                    }
                }
            },
            include: {
                members: { include: { user: true } },
                projects: { include: { tasks: true, members: { include: { user: true } } } }
            }
        });
        res.status(201).json(newWorkspace);
    } catch (error) {
        console.error("Error creating workspace:", error);
        res.status(500).json({ error: "Failed to create workspace" });
    }
};

export const updateWorkspace = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updatedWorkspace = await prisma.workspace.update({
            where: { id },
            data,
            include: {
                members: { include: { user: true } },
                projects: { include: { tasks: true, members: { include: { user: true } } } }
            }
        });
        res.json(updatedWorkspace);
    } catch (error) {
        console.error("Error updating workspace:", error);
        res.status(500).json({ error: "Failed to update workspace" });
    }
};

export const deleteWorkspace = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.workspace.delete({ where: { id } });
        res.json({ message: "Workspace deleted successfully" });
    } catch (error) {
        console.error("Error deleting workspace:", error);
        res.status(500).json({ error: "Failed to delete workspace" });
    }
};

export const inviteMember = async (req, res) => {
    try {
        const { id: workspaceId } = req.params;
        const { email, name, role } = req.body;

        if (!email) return res.status(400).json({ error: "Email is required" });

        // Find or create user by email
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: crypto.randomUUID(),
                    name: name || email.split('@')[0],
                    email,
                    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email)}&background=random`
                }
            });
        }

        // Upsert workspace membership (prevent duplicates)
        const member = await prisma.workspaceMember.upsert({
            where: { userId_workspaceId: { userId: user.id, workspaceId } },
            update: { role: role || 'MEMBER' },
            create: {
                userId: user.id,
                workspaceId,
                role: role || 'MEMBER'
            },
            include: { user: true }
        });

        res.status(201).json(member);
    } catch (error) {
        console.error("Error inviting member:", error);
        res.status(500).json({ error: "Failed to invite member" });
    }
};
