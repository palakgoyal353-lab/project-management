import { format } from "date-fns";
import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { updateProjectAsync, deleteProjectAsync } from "../feature/WorkspaceSlice";
import AddProjectMember from "./AddProjectMember";
import DeleteConfirmDialog from "./DeleteConfirmDialog";


export default function ProjectSettings({ project }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "PLANNING",
        priority: "MEDIUM",
        start_date: "",
        end_date: "",
        progress: 0,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name || "",
                description: project.description || "",
                status: project.status || "PLANNING",
                priority: project.priority || "MEDIUM",
                start_date: project.start_date ? format(new Date(project.start_date), "yyyy-MM-dd") : "",
                end_date: project.end_date ? format(new Date(project.end_date), "yyyy-MM-dd") : "",
                progress: project.progress || 0,
            });
        }
    }, [project]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!project?.id) return;
        setIsSubmitting(true);
        try {
            await dispatch(updateProjectAsync({ ...formData, id: project.id })).unwrap();
            toast.success("Project settings saved successfully!");
        } catch (error) {
            console.error("Failed to update project:", error);
            toast.error("Failed to save settings. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = "w-full px-3 py-2 rounded-lg mt-1 border text-sm bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition";
    const cardClasses = "rounded-xl border p-6 bg-white dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/50 shadow-sm";
    const labelClasses = "text-sm font-medium text-zinc-600 dark:text-zinc-400";

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Project Details */}
            <div className={cardClasses}>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-5">Project Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className={labelClasses}>Project Name</label>
                        <input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={inputClasses}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className={labelClasses}>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className={inputClasses + " h-24 resize-none"}
                        />
                    </div>

                    {/* Status & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClasses}>Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className={inputClasses}
                            >
                                <option value="PLANNING">Planning</option>
                                <option value="ACTIVE">Active</option>
                                <option value="ON_HOLD">On Hold</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClasses}>Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className={inputClasses}
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClasses}>Start Date</label>
                            <input
                                type="date"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>End Date</label>
                            <input
                                type="date"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                min={formData.start_date}
                                className={inputClasses}
                            />
                        </div>
                    </div>

                    {/* Progress */}
                    <div>
                        <label className={labelClasses}>Progress: {formData.progress}%</label>
                        <input
                            type="range" min="0" max="100" step="5"
                            value={formData.progress}
                            onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                            className="w-full mt-2 accent-blue-500 dark:accent-blue-400"
                        />
                        <div className="w-full bg-zinc-100 dark:bg-zinc-700 rounded-full h-2 mt-2">
                            <div
                                className="h-2 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all"
                                style={{ width: `${formData.progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="ml-auto flex items-center text-sm justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Save className="size-4" />
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>

            {/* Team Members */}
            <div className="space-y-6">
                <div className={cardClasses}>
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                            Team Members{" "}
                            <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
                                ({project?.members?.length || 0})
                            </span>
                        </h2>
                        <button
                            type="button"
                            onClick={() => setIsDialogOpen(true)}
                            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                        >
                            <Plus className="size-4 text-zinc-700 dark:text-zinc-300" />
                        </button>
                        <AddProjectMember isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
                    </div>

                    {/* Member List */}
                    {project?.members?.length > 0 ? (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {project.members.map((member, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-sm"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-medium">
                                            {(member?.user?.name || member?.user?.email || '?')[0].toUpperCase()}
                                        </div>
                                        <span className="text-zinc-700 dark:text-zinc-300">{member?.user?.name || member?.user?.email || "Unknown"}</span>
                                    </div>
                                    {project.team_lead === member.user?.id && (
                                        <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                                            Lead
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-6">No team members yet</p>
                    )}
                </div>
            </div>

            {/* Danger Zone */}
            <div className="lg:col-span-2">
                <div className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5 p-6">
                    <h2 className="text-base font-semibold text-red-700 dark:text-red-400 mb-1 flex items-center gap-2">
                        <Trash2 className="size-4" /> Danger Zone
                    </h2>
                    <p className="text-sm text-red-600/70 dark:text-red-400/70 mb-4">
                        Deleting this project is permanent. All tasks, members, and data will be lost forever.
                    </p>
                    <button
                        type="button"
                        onClick={() => setShowDeleteDialog(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10 transition-colors"
                    >
                        <Trash2 className="size-4" /> Delete This Project
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={async () => {
                    setIsDeleting(true);
                    try {
                        await dispatch(deleteProjectAsync(project.id)).unwrap();
                        toast.success(`"${project.name}" deleted.`);
                        navigate('/projects');
                    } catch {
                        toast.error('Failed to delete project.');
                        setIsDeleting(false);
                    }
                }}
                isDeleting={isDeleting}
                title={`Delete "${project?.name}"?`}
                description={`This will permanently delete the project and all its tasks. This cannot be undone.`}
                confirmLabel="Delete Project"
            />
        </div>
    );
}
