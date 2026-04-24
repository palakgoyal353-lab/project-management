import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../api/client";

export const fetchWorkspaces = createAsyncThunk("workspace/fetchWorkspaces", async () => {
    const response = await apiClient.get('/api/workspaces');
    return response.data;
});

export const addWorkspaceAsync = createAsyncThunk("workspace/addWorkspaceAsync", async (data) => {
    const response = await apiClient.post('/api/workspaces', data);
    return response.data;
});

export const addProjectAsync = createAsyncThunk("workspace/addProjectAsync", async (data) => {
    const response = await apiClient.post('/api/projects', data);
    return response.data;
});

export const updateProjectAsync = createAsyncThunk("workspace/updateProjectAsync", async (data) => {
    const response = await apiClient.put(`/api/projects/${data.id}`, data);
    return response.data;
});

export const addTaskAsync = createAsyncThunk("workspace/addTaskAsync", async (data) => {
    const response = await apiClient.post('/api/tasks', data);
    return response.data;
});

export const updateTaskAsync = createAsyncThunk("workspace/updateTaskAsync", async (data) => {
    const response = await apiClient.put(`/api/tasks/${data.id}`, data);
    return response.data;
});

export const deleteTaskAsync = createAsyncThunk("workspace/deleteTaskAsync", async (taskIds) => {
    if (Array.isArray(taskIds)) {
        await Promise.all(taskIds.map(id => apiClient.delete(`/api/tasks/${id}`)));
        return taskIds;
    } else {
        await apiClient.delete(`/api/tasks/${taskIds}`);
        return [taskIds];
    }
});

export const inviteMemberAsync = createAsyncThunk("workspace/inviteMemberAsync", async ({ workspaceId, email, name, role }) => {
    const response = await apiClient.post(`/api/workspaces/${workspaceId}/invite`, { email, name, role });
    return { workspaceId, member: response.data };
});

export const deleteProjectAsync = createAsyncThunk("workspace/deleteProjectAsync", async (projectId) => {
    await apiClient.delete(`/api/projects/${projectId}`);
    return projectId;
});


const initialState = {
    workspaces: [],
    currentWorkspace: null,
    loading: false,
    error: null,
};

const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        setCurrentWorkspace: (state, action) => {
            localStorage.setItem("currentWorkspaceId", action.payload);
            state.currentWorkspace = state.workspaces.find((w) => w.id === action.payload) || null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWorkspaces.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWorkspaces.fulfilled, (state, action) => {
                state.loading = false;
                state.workspaces = action.payload;

                const savedId = localStorage.getItem("currentWorkspaceId");
                if (savedId) {
                    state.currentWorkspace = action.payload.find(w => w.id === savedId) || action.payload[0] || null;
                } else {
                    state.currentWorkspace = action.payload[0] || null;
                }
            })
            .addCase(fetchWorkspaces.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addWorkspaceAsync.fulfilled, (state, action) => {
                state.workspaces.push(action.payload);
                state.currentWorkspace = action.payload;
                localStorage.setItem("currentWorkspaceId", action.payload.id);
            })
            .addCase(addProjectAsync.fulfilled, (state, action) => {
                const project = action.payload;
                if (state.currentWorkspace && state.currentWorkspace.id === project.workspaceId) {
                    state.currentWorkspace.projects = state.currentWorkspace.projects || [];
                    state.currentWorkspace.projects.push(project);
                }
                const ws = state.workspaces.find(w => w.id === project.workspaceId);
                if (ws) {
                    ws.projects = ws.projects || [];
                    ws.projects.push(project);
                }
            })
            .addCase(updateProjectAsync.fulfilled, (state, action) => {
                const updatedProject = action.payload;
                // Update in currentWorkspace
                if (state.currentWorkspace) {
                    const idx = state.currentWorkspace.projects?.findIndex(p => p.id === updatedProject.id);
                    if (idx !== -1 && idx !== undefined) {
                        state.currentWorkspace.projects[idx] = updatedProject;
                    }
                }
                // Update in workspaces array
                state.workspaces.forEach(ws => {
                    const idx = ws.projects?.findIndex(p => p.id === updatedProject.id);
                    if (idx !== -1 && idx !== undefined) {
                        ws.projects[idx] = updatedProject;
                    }
                });
            })
            .addCase(addTaskAsync.fulfilled, (state, action) => {
                const task = action.payload;
                const updateProjects = (projects) => {
                    if (!projects) return;
                    const project = projects.find(p => p.id === task.projectId);
                    if (project) {
                        project.tasks = project.tasks || [];
                        project.tasks.push(task);
                    }
                };
                if (state.currentWorkspace) updateProjects(state.currentWorkspace.projects);
                state.workspaces.forEach(ws => updateProjects(ws.projects));
            })
            .addCase(updateTaskAsync.fulfilled, (state, action) => {
                const updatedTask = action.payload;
                const updateProjects = (projects) => {
                    if (!projects) return;
                    projects.forEach(project => {
                        if (!project.tasks) return;
                        const idx = project.tasks.findIndex(t => t.id === updatedTask.id);
                        if (idx !== -1) project.tasks[idx] = updatedTask;
                    });
                };
                if (state.currentWorkspace) updateProjects(state.currentWorkspace.projects);
                state.workspaces.forEach(ws => updateProjects(ws.projects));
            })
            .addCase(deleteTaskAsync.fulfilled, (state, action) => {
                const deletedIds = action.payload;
                const updateProjects = (projects) => {
                    if (!projects) return;
                    projects.forEach(project => {
                        project.tasks = project.tasks?.filter(t => !deletedIds.includes(t.id)) || [];
                    });
                };
                if (state.currentWorkspace) updateProjects(state.currentWorkspace.projects);
                state.workspaces.forEach(ws => updateProjects(ws.projects));
            })
            .addCase(inviteMemberAsync.fulfilled, (state, action) => {
                const { workspaceId, member } = action.payload;
                const updateWs = (ws) => {
                    if (!ws || ws.id !== workspaceId) return;
                    ws.members = ws.members || [];
                    const existing = ws.members.find(m => m.id === member.id);
                    if (!existing) ws.members.push(member);
                };
                updateWs(state.currentWorkspace);
                state.workspaces.forEach(ws => updateWs(ws));
            })
            .addCase(deleteProjectAsync.fulfilled, (state, action) => {
                const deletedId = action.payload;
                if (state.currentWorkspace) {
                    state.currentWorkspace.projects = state.currentWorkspace.projects?.filter(p => p.id !== deletedId) || [];
                }
                state.workspaces.forEach(ws => {
                    ws.projects = ws.projects?.filter(p => p.id !== deletedId) || [];
                });
            });

    }
});

export const { setCurrentWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;