import { useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ChevronRightIcon, SettingsIcon, KanbanIcon, ChartColumnIcon, CalendarIcon, ArrowRightIcon } from 'lucide-react';
import { useSelector } from 'react-redux';

const ProjectSidebar = () => {
    const location = useLocation();
    const [expandedProjects, setExpandedProjects] = useState(new Set());
    const [searchParams] = useSearchParams();

    const projects = useSelector(
        (state) => state?.workspace?.currentWorkspace?.projects || []
    );

    // FIX: Use correct route /projectdetail (not /projectsDetail)
    const getProjectSubItems = (projectId) => [
        { title: 'Tasks', icon: KanbanIcon, url: `/projectdetail?id=${projectId}&tab=tasks` },
        { title: 'Analytics', icon: ChartColumnIcon, url: `/projectdetail?id=${projectId}&tab=analytics` },
        { title: 'Calendar', icon: CalendarIcon, url: `/projectdetail?id=${projectId}&tab=calendar` },
        { title: 'Settings', icon: SettingsIcon, url: `/projectdetail?id=${projectId}&tab=settings` },
    ];

    const toggleProject = (id) => {
        const newSet = new Set(expandedProjects);
        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
        setExpandedProjects(newSet);
    };

    return (
        <div className="mt-4 px-3">
            <div className="flex items-center justify-between px-3 py-2">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wider">
                    Projects
                </h3>
                <Link to="/projects">
                    <button className="size-5 text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded flex items-center justify-center transition-colors">
                        <ArrowRightIcon className="size-3" />
                    </button>
                </Link>
            </div>

            <div className="space-y-0.5">
                {projects.length === 0 ? (
                    <p className="px-3 py-2 text-xs text-gray-400 dark:text-zinc-600 text-center">No projects yet</p>
                ) : (
                    projects.map((project) => (
                        <div key={project.id}>
                            <button
                                onClick={() => toggleProject(project.id)}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white"
                            >
                                <ChevronRightIcon className={`size-3 text-gray-400 dark:text-zinc-500 transition-transform duration-200 ${expandedProjects.has(project.id) ? 'rotate-90' : ''}`} />
                                <div className="size-2 rounded-full bg-blue-500 shrink-0" />
                                <span className="truncate text-sm text-left flex-1">{project.name}</span>
                            </button>

                            {expandedProjects.has(project.id) && (
                                <div className="ml-6 mt-0.5 space-y-0.5 mb-1">
                                    {getProjectSubItems(project.id).map((subItem) => {
                                        const isActive =
                                            location.pathname === '/projectdetail' &&
                                            searchParams.get('id') === project.id &&
                                            searchParams.get('tab') === subItem.title.toLowerCase();

                                        return (
                                            <Link
                                                key={subItem.title}
                                                to={subItem.url}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-xs ${
                                                    isActive
                                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                                                        : 'text-gray-500 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800'
                                                }`}
                                            >
                                                <subItem.icon className="size-3" />
                                                {subItem.title}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProjectSidebar;
