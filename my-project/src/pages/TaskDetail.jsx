import { format } from "date-fns";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarIcon, MessageCircle, PenIcon, User, Loader2 } from "lucide-react";

const TaskDetails = () => {
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get("projectId");
    const taskId = searchParams.get("taskId");

    const [task, setTask] = useState(null);
    const [project, setProject] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const { currentWorkspace } = useSelector((state) => state.workspace);

    const fetchTaskDetails = () => {
        setLoading(true);
        if (!projectId || !taskId || !currentWorkspace) return;

        const proj = currentWorkspace.projects?.find((p) => p.id === projectId);
        if (!proj) { setLoading(false); return; }

        const tsk = proj.tasks?.find((t) => t.id === taskId);
        if (!tsk) { setLoading(false); return; }

        setTask(tsk);
        setProject(proj);
        setLoading(false);
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        setSubmitting(true);
        try {
            const dummyComment = {
                id: Date.now(),
                user: { id: 'current_user', name: "You" },
                content: newComment,
                createdAt: new Date(),
            };
            setComments((prev) => [...prev, dummyComment]);
            setNewComment("");
            toast.success("Comment added.");
        } catch (error) {
            toast.error("Failed to add comment.");
        } finally {
            setSubmitting(false);
        }
    };

    const priorityColors = {
        HIGH: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
        MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
        LOW: "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400",
    };
    const statusColors = {
        DONE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
        IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
        TODO: "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400",
    };

    useEffect(() => { fetchTaskDetails(); }, [taskId, currentWorkspace]);

    if (loading) return (
        <div className="flex items-center justify-center h-64 text-zinc-500 dark:text-zinc-400">
            <Loader2 className="size-6 animate-spin mr-2" /> Loading task...
        </div>
    );
    if (!task) return (
        <div className="text-center py-20 text-zinc-500 dark:text-zinc-400">
            <p className="text-lg">Task not found.</p>
        </div>
    );

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-6 sm:p-4 text-gray-900 dark:text-zinc-100 max-w-6xl mx-auto">
            {/* Left: Discussion / Comments */}
            <div className="w-full lg:w-3/5">
                <div className="p-5 rounded-xl border border-gray-200 dark:border-zinc-700/50 bg-white dark:bg-zinc-800/60 flex flex-col lg:h-[80vh] shadow-sm">
                    <h2 className="text-base font-semibold flex items-center gap-2 mb-4 text-gray-900 dark:text-zinc-100">
                        <MessageCircle className="size-5 text-blue-500" /> Task Discussion ({comments.length})
                    </h2>

                    <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
                        {comments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-32 text-zinc-400 dark:text-zinc-500">
                                <MessageCircle className="size-8 mb-2 opacity-40" />
                                <p className="text-sm">No comments yet. Start the discussion!</p>
                            </div>
                        ) : (
                            comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className={`max-w-4/5 bg-zinc-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-3 rounded-xl ${
                                        comment.user.id === 'current_user' ? "ml-auto" : "mr-auto"
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-1 text-xs text-gray-500 dark:text-zinc-400">
                                        <div className="size-5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold">
                                            {comment.user.name[0].toUpperCase()}
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-zinc-200">{comment.user.name}</span>
                                        <span>• {format(new Date(comment.createdAt), "dd MMM, HH:mm")}</span>
                                    </div>
                                    <p className="text-sm text-gray-800 dark:text-zinc-300">{comment.content}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Add Comment */}
                    <div className="flex gap-3 border-t border-gray-100 dark:border-zinc-700/50 pt-4">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleAddComment(); }}
                            placeholder="Write a comment... (Ctrl+Enter to submit)"
                            className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-3 text-sm text-gray-900 dark:text-zinc-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
                            rows={3}
                        />
                        <button
                            onClick={handleAddComment}
                            disabled={submitting || !newComment.trim()}
                            className="self-end bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm px-4 py-2.5 rounded-lg transition-colors font-medium"
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>

            {/* Right: Task Info */}
            <div className="w-full lg:w-2/5 flex flex-col gap-4">
                {/* Task Info */}
                <div className="p-5 rounded-xl bg-white dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/50 shadow-sm">
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-3">{task.title}</h1>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${statusColors[task.status] || 'bg-zinc-100 text-zinc-600'}`}>
                            {task.status?.replace("_", " ")}
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 text-xs font-medium">
                            {task.type}
                        </span>
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${priorityColors[task.priority] || 'bg-zinc-100 text-zinc-600'}`}>
                            {task.priority}
                        </span>
                    </div>

                    {task.description && (
                        <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed mb-4 pb-4 border-b border-gray-100 dark:border-zinc-700/50">
                            {task.description}
                        </p>
                    )}

                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-zinc-400">
                            <User className="size-4 shrink-0" />
                            <span className="font-medium text-gray-700 dark:text-zinc-300">Assignee:</span>
                            {task.assignee?.image ? (
                                <img src={task.assignee.image} className="size-5 rounded-full" alt="avatar" />
                            ) : (
                                <div className="size-5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold">
                                    {(task.assignee?.name || 'U')[0].toUpperCase()}
                                </div>
                            )}
                            <span>{task.assignee?.name || task.assignee?.email || "Unassigned"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-zinc-400">
                            <CalendarIcon className="size-4 shrink-0" />
                            <span className="font-medium text-gray-700 dark:text-zinc-300">Due:</span>
                            <span className={new Date(task.due_date) < new Date() && task.status !== 'DONE' ? 'text-red-500 font-medium' : ''}>
                                {task.due_date ? format(new Date(task.due_date), "dd MMM yyyy") : 'No due date'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Project Info */}
                {project && (
                    <div className="p-4 rounded-xl bg-white dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/50 shadow-sm">
                        <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Project</p>
                        <h2 className="text-base font-medium text-gray-900 dark:text-zinc-100 flex items-center gap-2 mb-3">
                            <PenIcon className="size-4 text-blue-500" /> {project.name}
                        </h2>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-zinc-400">
                            <span className="bg-zinc-50 dark:bg-zinc-800 rounded-lg px-3 py-2">Status: <span className="font-medium text-zinc-700 dark:text-zinc-300">{project.status?.replace('_', ' ')}</span></span>
                            <span className="bg-zinc-50 dark:bg-zinc-800 rounded-lg px-3 py-2">Priority: <span className="font-medium text-zinc-700 dark:text-zinc-300">{project.priority}</span></span>
                            <span className="col-span-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg px-3 py-2">Progress: <span className="font-medium text-blue-600 dark:text-blue-400">{project.progress}%</span></span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskDetails;
