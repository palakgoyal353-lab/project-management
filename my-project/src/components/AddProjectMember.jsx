import { useState } from "react";
import { Mail, UserPlus, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { updateProjectAsync, inviteMemberAsync } from "../feature/WorkspaceSlice";
import toast from "react-hot-toast";
import apiClient from "../api/client";

const AddProjectMember = ({ isDialogOpen, setIsDialogOpen }) => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const dispatch = useDispatch();

    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null);
    const project = currentWorkspace?.projects?.find((p) => p.id === id);
    const projectMemberIds = project?.members?.map((m) => m.user?.id) || [];

    // Get workspace members NOT already in the project
    const availableMembers = currentWorkspace?.members?.filter(
        (m) => !projectMemberIds.includes(m.user?.id)
    ) || [];

    const [selectedUserId, setSelectedUserId] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [mode, setMode] = useState('existing'); // 'existing' | 'new'
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!project?.id) return;
        setIsAdding(true);
        try {
            if (mode === 'new' && newEmail) {
                // First invite to workspace, then add to project
                await dispatch(inviteMemberAsync({
                    workspaceId: currentWorkspace.id,
                    email: newEmail,
                })).unwrap();
                toast.success(`${newEmail} added to workspace and project!`);
            } else if (mode === 'existing' && selectedUserId) {
                // Add existing workspace member to project via API
                await apiClient.post(`/api/projects/${project.id}/members`, { userId: selectedUserId });
                toast.success("Member added to project!");
            }
            setIsDialogOpen(false);
            setSelectedUserId('');
            setNewEmail('');
        } catch (error) {
            console.error("Failed to add member:", error);
            toast.error("Failed to add member. Please try again.");
        } finally {
            setIsAdding(false);
        }
    };

    if (!isDialogOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-md text-zinc-900 dark:text-zinc-100 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <UserPlus className="size-5 text-blue-500" /> Add Member
                        </h2>
                        {project && (
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                                To project: <span className="text-blue-600 dark:text-blue-400 font-medium">{project.name}</span>
                            </p>
                        )}
                    </div>
                    <button onClick={() => setIsDialogOpen(false)} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <X className="size-4 text-zinc-500" />
                    </button>
                </div>

                {/* Mode Tabs */}
                <div className="flex gap-2 mb-4 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    <button
                        type="button"
                        onClick={() => setMode('existing')}
                        className={`flex-1 py-1.5 text-sm rounded-md transition-colors font-medium ${mode === 'existing' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                        From Workspace
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('new')}
                        className={`flex-1 py-1.5 text-sm rounded-md transition-colors font-medium ${mode === 'new' ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                        Invite by Email
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'existing' ? (
                        <div>
                            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                                Select Member
                            </label>
                            {availableMembers.length === 0 ? (
                                <p className="text-sm text-zinc-400 py-4 text-center">All workspace members are already in this project.</p>
                            ) : (
                                <select
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                    required
                                >
                                    <option value="">Select a workspace member</option>
                                    {availableMembers.map((member) => (
                                        <option key={member.user?.id} value={member.user?.id}>
                                            {member.user?.name || member.user?.email}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="member@example.com"
                                    className="pl-10 w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setIsDialogOpen(false)} className="px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={isAdding || (mode === 'existing' && !selectedUserId) || (mode === 'new' && !newEmail)} className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium transition-colors">
                            {isAdding ? "Adding..." : "Add Member"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProjectMember;
