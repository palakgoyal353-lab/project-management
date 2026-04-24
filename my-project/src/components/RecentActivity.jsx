import { useEffect, useState } from "react";
import { GitCommit, MessageSquare, Clock, Bug, Zap, Square, Activity } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";

const typeConfig = {
    BUG:         { icon: Bug,          color: "text-red-500",    bg: "bg-red-500/10",    label: "Bug" },
    FEATURE:     { icon: Zap,          color: "text-blue-500",   bg: "bg-blue-500/10",   label: "Feature" },
    TASK:        { icon: Square,       color: "text-emerald-500",bg: "bg-emerald-500/10",label: "Task" },
    IMPROVEMENT: { icon: MessageSquare,color: "text-amber-500",  bg: "bg-amber-500/10",  label: "Improvement" },
    OTHER:       { icon: GitCommit,    color: "text-purple-500", bg: "bg-purple-500/10", label: "Other" },
};

const statusConfig = {
    TODO:        { label: "To Do",      classes: "text-zinc-600 bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-700" },
    IN_PROGRESS: { label: "In Progress",classes: "text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/15" },
    DONE:        { label: "Done",       classes: "text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/15" },
};

const RecentActivity = () => {
    const [tasks, setTasks] = useState([]);
    const { currentWorkspace } = useSelector(state => state.workspace);

    useEffect(() => {
        if (!currentWorkspace) return;
        const all = currentWorkspace.projects?.flatMap(p =>
            p.tasks?.map(t => ({ ...t, projectName: p.name })) || []
        ) || [];
        all.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setTasks(all);
    }, [currentWorkspace]);

    return (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700/50 bg-white dark:bg-zinc-800/60 overflow-hidden shadow-sm card-hover">
            {/* Header */}
            <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-500/10">
                        <Activity className="size-4 text-blue-500" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Recent Activity</h2>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500">{tasks.length} task updates</p>
                    </div>
                </div>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline">View all</span>
            </div>

            {/* Timeline */}
            {tasks.length === 0 ? (
                <div className="p-12 text-center">
                    <div className="w-14 h-14 mx-auto mb-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center">
                        <Clock className="size-7 text-zinc-300 dark:text-zinc-600" />
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">No activity yet</p>
                    <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-1">Tasks will appear here once created</p>
                </div>
            ) : (
                <div className="divide-y divide-zinc-50 dark:divide-zinc-700/30">
                    {tasks.slice(0, 7).map((task, i) => {
                        const cfg = typeConfig[task.type] || typeConfig.OTHER;
                        const stt = statusConfig[task.status] || statusConfig.TODO;
                        const Icon = cfg.icon;
                        return (
                            <div key={task.id}
                                className="flex items-start gap-4 px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-700/20 transition-colors animate-fade-up"
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                <div className={`mt-0.5 p-2 rounded-xl shrink-0 ${cfg.bg}`}>
                                    <Icon className={`size-3.5 ${cfg.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 truncate">{task.title}</p>
                                        <span className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full ${stt.classes}`}>
                                            {stt.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                                        <span className={`font-medium ${cfg.color}`}>{cfg.label}</span>
                                        {task.projectName && <><span>·</span><span className="text-blue-500 dark:text-blue-400">{task.projectName}</span></>}
                                        <span>·</span>
                                        <span>{formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RecentActivity;
