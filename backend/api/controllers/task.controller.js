import { prisma } from '../../configs/prisma.js';

export const getTasks = async (req, res) => {
    try {
        const { projectId } = req.query;
        const whereClause = projectId ? { projectId } : {};
        const tasks = await prisma.task.findMany({
    where: {
        assigneeId: req.user.id   // ✅ ONLY MY TASKS
    },
    include: {
        project: true,
        assignee: true
    }
});
        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
};

export const createTask = async (req, res) => {
    try {
        const { id, projectId, title, description, status, type, priority, assigneeId, due_date } = req.body;
        
        let user = await prisma.user.findUnique({ where: { id: assigneeId || "user_1" } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: assigneeId || "user_1",
                    name: "Dummy Assignee",
                    email: `dummy_assignee_${Date.now()}@example.com`
                }
            });
        }

        const taskId = id || crypto.randomUUID();

        const newTask = await prisma.task.create({
            data: {
                id: taskId,
                projectId,
                title,
                description,
                status,
                type,
                priority,
                assigneeId: user.id,
                due_date: due_date ? new Date(due_date) : new Date(),
            },
            include: { assignee: true }
        });
        res.status(201).json(newTask);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Failed to create task" });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (data.due_date) data.due_date = new Date(data.due_date);

        const updatedTask = await prisma.task.update({
            where: { id },
            data,
            include: { assignee: true }
        });
        res.json(updatedTask);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Failed to update task" });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.task.delete({ where: { id } });
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: "Failed to delete task" });
    }
};
