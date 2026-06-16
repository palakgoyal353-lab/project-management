import { useState } from "react";
import { Mail, UserPlus, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { inviteMemberAsync } from "../feature/WorkspaceSlice";
import toast from "react-hot-toast";

const InviteMemberDialog = ({ isDialogOpen, setIsDialogOpen }) => {
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null);
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        role: "MEMBER",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentWorkspace?.id) return;
        setIsSubmitting(true);
        try {
            await dispatch(inviteMemberAsync({
                workspaceId: currentWorkspace.id,
                email: formData.email,
                name: formData.name,
                role: formData.role,
            })).unwrap();
            toast.success(`${formData.email} has been added to ${currentWorkspace.name}!`);
            setFormData({ email: "", name: "", role: "MEMBER" });
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Failed to invite member:", error);
            toast.error("Failed to invite member. Please try again.");
        } finally {
            setIsSubmitting(false);
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
                            <UserPlus className="size-5 text-blue-500" /> Invite Team Member
                        </h2>
                        {currentWorkspace && (
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                                Adding to <span className="text-blue-600 dark:text-blue-400 font-medium">{currentWorkspace.name}</span>
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => setIsDialogOpen(false)}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <X className="size-4 text-zinc-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Full Name <span className="text-zinc-400">(optional)</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="member@example.com"
                                className="pl-10 w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
                                required
                            />
                        </div>
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm transition"
                        >
                            <option value="MEMBER">Member</option>
                            <option value="TEAM_LEAD">Team Lead</option>
                            <option value="MANAGER">Manager</option>
                            <option value="IT">IT</option>
                            <option value="ADMIN_IT">Admin IT</option>
                        </select>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsDialogOpen(false)}
                            className="px-4 py-2 rounded-lg text-sm border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !currentWorkspace}
                            className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium transition-colors"
                        >
                            {isSubmitting ? "Adding..." : "Add Member"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteMemberDialog;
