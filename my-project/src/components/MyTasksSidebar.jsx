import { useEffect, useState } from 'react';
import { CheckSquareIcon, ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/react';

function MyTasksSidebar() {
    const { user } = useUser();
    const { currentWorkspace } = useSelector((state) => state.workspace);
    const [showMyTasks, setShowMyTasks] = useState(false);
    const [myTasks, setMyTasks] = useState([]);

    const statusDot = {
        DONE: 'bg-emerald-500',
        IN_PROGRESS: 'bg-amber-400',
        TODO: 'bg-zinc-400 dark:bg-zinc-500',
    };

    useEffect(() => {
        if (!currentWorkspace || !user) return;
        // Get all tasks assigned to the current logged-in user
        const allTasks = currentWorkspace.projects?.flatMap((project) =>
            project.tasks?.filter((task) =>
                task?.assigneeId === user.id ||
                task?.assignee?.email === user.primaryEmailAddress?.emailAddress
            ).map(t => ({ ...t, projectId: project.id })) || []
        ) || [];
        setMyTasks(allTasks);
    }, [currentWorkspace, user]);

    return (
        <div className="mt-2 px-3">
            <button
                onClick={() => setShowMyTasks(prev => !prev)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <CheckSquareIcon className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">My Tasks</span>
                    {myTasks.length > 0 && (
                        <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs px-1.5 py-0.5 rounded-md font-medium">
                            {myTasks.length}
                        </span>
                    )}
                </div>
                {showMyTasks
                    ? <ChevronDownIcon className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500" />
                    : <ChevronRightIcon className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500" />
                }
            </button>

            {showMyTasks && (
                <div className="mt-1 space-y-0.5 pl-2">
                    {myTasks.length === 0 ? (
                        <div className="px-3 py-3 text-xs text-gray-400 dark:text-zinc-600 text-center">
                            No tasks assigned to you
                        </div>
                    ) : (
                        myTasks.map((task, index) => (
                            <Link
                                key={task.id || index}
                                // FIX: use correct route /taskdetail (matches App.jsx)
                                to={`/taskdetail?projectId=${task.projectId}&taskId=${task.id}`}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white"
                            >
                                <div className={`w-2 h-2 rounded-full shrink-0 ${statusDot[task.status] || 'bg-zinc-400'}`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">{task.title}</p>
                                    <p className="text-[10px] text-gray-400 dark:text-zinc-600 capitalize">
                                        {task.status?.replace('_', ' ').toLowerCase()}
                                    </p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default MyTasksSidebar;
