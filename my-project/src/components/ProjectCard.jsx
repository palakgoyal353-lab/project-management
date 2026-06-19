import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, Users, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { deleteProjectAsync } from "../feature/WorkspaceSlice";
import toast from "react-hot-toast";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

const statusColors = {
    PLANNING: "bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300",
    ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
    ON_HOLD: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
    COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
    CANCELLED: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
};

const priorityDots = {
    HIGH: "bg-red-500",
    MEDIUM: "bg-amber-400",
    LOW: "bg-zinc-400",
};

const ProjectCard = ({ project }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isArchived = project.isArchived; // ✅ ARCHIVE FLAG

    const completedTasks = project.tasks?.filter(t => t.status === 'DONE').length || 0;
    const totalTasks = project.tasks?.length || 0;

    const progress = totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : (project.progress || 0);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await dispatch(deleteProjectAsync(project.id)).unwrap();
            toast.success(`"${project.name}" deleted successfully.`);
            setShowDeleteDialog(false);
            navigate('/projects');
        } catch (error) {
            toast.error("Failed to delete project. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleArchive = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await fetch(`http://localhost:3000/api/projects/${project.id}/archive`, {
                method: "PATCH",
            });

            toast.success("Project archived 🗂");

            window.location.reload(); // simple refresh (can be improved later)
        } catch (err) {
            toast.error("Failed to archive project");
        }
    };

    return (
        <>
            <div className="relative flex flex-col bg-white dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/50 hover:border-blue-300 dark:hover:border-blue-500/30 rounded-xl p-5 transition-all duration-200 group shadow-sm hover:shadow-md">

                {/* DELETE BUTTON */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowDeleteDialog(true);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-500/10 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-all"
                    title="Delete project"
                >
                    <Trash2 className="size-4" />
                </button>

                {/* ARCHIVE BUTTON */}
                {!isArchived && (
                    <button
                        onClick={handleArchive}
                        className="absolute top-3 right-10 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-blue-500 transition-all"
                        title="Archive project"
                    >
                        🗂
                    </button>
                )}

                <Link to={`/projectdetail?id=${project.id}&tab=tasks`} className="flex flex-col flex-1">

                    {/* HEADER */}
                    <div className="flex items-start justify-between mb-3 pr-10">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-zinc-100 mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {project.name}
                            </h3>
                            <p className="text-gray-500 dark:text-zinc-400 text-sm line-clamp-2">
                                {project.description || "No description"}
                            </p>
                        </div>

                        <div className={`w-2.5 h-2.5 rounded-full ml-3 mt-1 shrink-0 ${priorityDots[project.priority] || 'bg-zinc-400'}`} />
                    </div>

                    {/* STATUS + ARCHIVED BADGE */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${statusColors[project.status]}`}>
                            {project.status?.replace("_", " ")}
                        </span>

                        {isArchived && (
                            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-200 text-gray-600 dark:bg-zinc-700 dark:text-zinc-300">
                                📦 Archived
                            </span>
                        )}
                    </div>

                    {/* META INFO */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-zinc-500">
                            {project.members?.length > 0 && (
                                <span className="flex items-center gap-1">
                                    <Users className="size-3" /> {project.members.length}
                                </span>
                            )}

                            {project.end_date && (
                                <span className="flex items-center gap-1">
                                    <Calendar className="size-3" />
                                    {format(new Date(project.end_date), "MMM d")}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="text-xs text-zinc-400 dark:text-zinc-500 mb-3">
                        {completedTasks}/{totalTasks} tasks completed
                    </div>

                    {/* PROGRESS */}
                    <div className="mt-auto space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 dark:text-zinc-400">Progress</span>
                            <span className="text-gray-600 dark:text-zinc-300 font-medium">{progress}%</span>
                        </div>

                        <div className="w-full bg-gray-100 dark:bg-zinc-700 h-1.5 rounded-full">
                            <div
                                className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </Link>
            </div>

            {/* DELETE DIALOG */}
            <DeleteConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                title={`Delete "${project.name}"?`}
                description={`This will permanently delete the project and all its ${totalTasks} task${totalTasks !== 1 ? 's' : ''}. This cannot be undone.`}
                confirmLabel="Delete Project"
            />
        </>
    );
};

export default ProjectCard;