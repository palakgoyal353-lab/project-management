import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Plus, Search, FolderOpen } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import CreateProjectDialog from "../components/CreateProjectDialog";

export default function Projects() {

    const projects = useSelector(
        (state) => state?.workspace?.currentWorkspace?.projects || []
    );

    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filters, setFilters] = useState({ status: "ALL", priority: "ALL" });

    const filterProjects = () => {
        let filtered = projects;
        if (searchTerm) {
            filtered = filtered.filter(
                (p) =>
                    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (filters.status !== "ALL") filtered = filtered.filter((p) => p.status === filters.status);
        if (filters.priority !== "ALL") filtered = filtered.filter((p) => p.priority === filters.priority);
        setFilteredProjects(filtered);
    };

    useEffect(() => { filterProjects(); }, [projects, searchTerm, filters]);

    const selectClasses = "px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30";

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-zinc-100 mb-1">Projects</h1>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm">
                        {projects.length} project{projects.length !== 1 ? 's' : ''} in this workspace
                    </p>
                </div>
                <button
                    onClick={() => setIsDialogOpen(true)}
                    className="flex items-center px-4 py-2.5 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition font-medium shadow-sm"
                >
                    <Plus className="size-4 mr-2" /> New Project
                </button>
                <CreateProjectDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-zinc-500 w-4 h-4" />
                    <input
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                        className="w-full pl-10 text-sm pr-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
                        placeholder="Search projects..."
                    />
                </div>
                <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className={selectClasses}>
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PLANNING">Planning</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
                <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })} className={selectClasses}>
                    <option value="ALL">All Priority</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                </select>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProjects.length === 0 ? (
                    <div className="col-span-full text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-5 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                            <FolderOpen className="w-10 h-10 text-gray-400 dark:text-zinc-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-1">
                            {projects.length === 0 ? "No projects yet" : "No projects match your filters"}
                        </h3>
                        <p className="text-gray-500 dark:text-zinc-400 mb-6 text-sm">
                            {projects.length === 0 ? "Create your first project to get started" : "Try adjusting your search or filters"}
                        </p>
                        {projects.length === 0 && (
                            <button
                                onClick={() => setIsDialogOpen(true)}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
                            >
                                <Plus className="size-4" /> Create Project
                            </button>
                        )}
                    </div>
                ) : (
                    filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))
                )}
            </div>
        </div>
    );
}
