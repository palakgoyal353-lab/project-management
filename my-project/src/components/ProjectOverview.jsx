import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, UsersIcon, FolderOpen } from "lucide-react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import CreateProjectDialog from "./CreateProjectDialog";

const statusColors = {
    PLANNING: "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300",
    ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
    ON_HOLD: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
    COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
    CANCELLED: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
};

const priorityDots = {
    LOW: "bg-zinc-400",
    MEDIUM: "bg-amber-400",
    HIGH: "bg-red-500",
};

const ProjectOverview = () => {
    const currentWorkspace = useSelector((state) => state?.workspace?.currentWorkspace || null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        setProjects(currentWorkspace?.projects || []);
    }, [currentWorkspace]);

    return currentWorkspace && (
        <div className="bg-white dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/50 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200 rounded-xl overflow-hidden shadow-sm">
            <div className="border-b border-zinc-200 dark:border-zinc-700/50 p-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">Project Overview</h2>
                <Link to={'/projects'} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors">
                    View all <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div>
                {projects.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                            <FolderOpen size={28} className="text-zinc-400 dark:text-zinc-500" />
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-4">No projects yet</p>
                        <button
                            onClick={() => setIsDialogOpen(true)}
                            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Create your First Project
                        </button>
                        <CreateProjectDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-700/50">
                        {projects.slice(0, 5).map((project) => {
                            const completedTasks = project.tasks?.filter(t => t.status === 'DONE').length || 0;
                            const totalTasks = project.tasks?.length || 0;
                            const computedProgress = totalTasks > 0
                                ? Math.round((completedTasks / totalTasks) * 100)
                                : (project.progress || 0);

                            return (
                                <Link
                                    key={project.id}
                                    // FIX: was /projectsDetail, correct route is /projectdetail
                                    to={`/projectdetail?id=${project.id}&tab=tasks`}
                                    className="block p-5 hover:bg-zinc-50 dark:hover:bg-zinc-700/30 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-zinc-800 dark:text-zinc-100 mb-0.5 truncate">
                                                {project.name}
                                            </h3>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">
                                                {project.description || 'No description'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4 shrink-0">
                                            <span className={`text-xs px-2 py-1 rounded-md font-medium ${statusColors[project.status]}`}>
                                                {project.status.replace('_', ' ')}
                                            </span>
                                            <div className={`w-2 h-2 rounded-full ${priorityDots[project.priority] || 'bg-zinc-400'}`} title={project.priority} />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500 mb-3">
                                        <div className="flex items-center gap-4">
                                            {project.members?.length > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <UsersIcon className="w-3 h-3" />
                                                    {project.members.length} member{project.members.length !== 1 ? 's' : ''}
                                                </div>
                                            )}
                                            {project.end_date && (
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(project.end_date), "MMM d, yyyy")}
                                                </div>
                                            )}
                                            <span>{completedTasks}/{totalTasks} tasks</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-zinc-400 dark:text-zinc-500">Progress</span>
                                            <span className="text-zinc-600 dark:text-zinc-300 font-medium">{computedProgress}%</span>
                                        </div>
                                        <div className="w-full bg-zinc-100 dark:bg-zinc-700 rounded-full h-1.5">
                                            <div
                                                className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                                                style={{ width: `${computedProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProjectOverview;
