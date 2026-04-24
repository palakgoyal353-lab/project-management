import { useEffect, useState } from "react";
import { UsersIcon, Search, UserPlus, Shield, Activity } from "lucide-react";
import InviteMemberDialog from "../components/InviteMemberDailog";
import { useSelector } from "react-redux";

const Team = () => {

    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const currentWorkspace = useSelector((state) => state?.workspace?.currentWorkspace || null);
    const projects = currentWorkspace?.projects || [];

    const filteredUsers = users.filter(
        (user) =>
            user?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        setUsers(currentWorkspace?.members || []);
        setTasks(currentWorkspace?.projects?.reduce((acc, project) => [...acc, ...project.tasks], []) || []);
    }, [currentWorkspace]);

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-zinc-100 mb-1">Team</h1>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm">
                        Manage team members and their contributions
                    </p>
                </div>
                <button onClick={() => setIsDialogOpen(true)} className="flex items-center px-5 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white transition" >
                    <UserPlus className="w-4 h-4 mr-2" /> Invite Member
                </button>
                <InviteMemberDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
            </div>

            {/* Stats Cards */}
            <div className="flex flex-wrap gap-4">
                {/* Total Members */}
                <div className="max-sm:w-full bg-white dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/50 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-8 md:gap-16">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-zinc-400">Total Members</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-500/10">
                            <UsersIcon className="size-5 text-blue-500" />
                        </div>
                    </div>
                </div>

                {/* Active Projects */}
                <div className="max-sm:w-full bg-white dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/50 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-8 md:gap-16">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-zinc-400">Active Projects</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {projects.filter((p) => p.status !== "CANCELLED" && p.status !== "COMPLETED").length}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-500/10">
                            <Activity className="size-5 text-emerald-500" />
                        </div>
                    </div>
                </div>

                {/* Total Tasks */}
                <div className="max-sm:w-full bg-white dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/50 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-8 md:gap-16">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-zinc-400">Total Tasks</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{tasks.length}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-purple-500/10">
                            <Shield className="size-5 text-purple-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-zinc-500 size-4" />
                <input placeholder="Search team members..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-full text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
            </div>

            {/* Team Members */}
            <div className="w-full">
                {filteredUsers.length === 0 ? (
                    <div className="col-span-full text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                            <UsersIcon className="w-12 h-12 text-gray-400 dark:text-zinc-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100 mb-2">
                            {users.length === 0
                                ? "No team members yet"
                                : "No members match your search"}
                        </h3>
                        <p className="text-gray-500 dark:text-zinc-400 mb-6">
                            {users.length === 0
                                ? "Invite team members to start collaborating"
                                : "Try adjusting your search term"}
                        </p>
                    </div>
                ) : (
                    <div className="max-w-4xl w-full">
                        {/* Desktop Table */}
                        <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200 dark:border-zinc-700/50 shadow-sm">
                            <table className="min-w-full divide-y divide-gray-100 dark:divide-zinc-700/50">
                                <thead className="bg-zinc-50 dark:bg-zinc-800/80">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-semibold text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left font-semibold text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left font-semibold text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Role</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-zinc-800/40 divide-y divide-gray-100 dark:divide-zinc-700/50">
                                    {filteredUsers.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-zinc-50 dark:hover:bg-zinc-700/30 transition-colors"
                                        >
                                            <td className="px-6 py-3 whitespace-nowrap flex items-center gap-3">
                                                {user.user?.image ? (
                                                    <img
                                                        src={user.user.image}
                                                        alt={user.user.name}
                                                        className="size-8 rounded-full bg-gray-200 dark:bg-zinc-700 object-cover"
                                                    />
                                                ) : (
                                                    <div className="size-8 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-medium">
                                                        {(user.user?.name || user.user?.email || '?')[0].toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100 truncate">
                                                    {user.user?.name || "Unknown User"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                                                {user.user?.email}
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap">
                                                <span
                                                    className={`px-2.5 py-1 text-xs font-medium rounded-md ${user.role === "ADMIN"
                                                        ? "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400"
                                                        : "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                                                    }`}
                                                >
                                                    {user.role || "MEMBER"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="sm:hidden space-y-3">
                            {filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="p-4 border border-gray-100 dark:border-zinc-700/50 rounded-xl bg-white dark:bg-zinc-800/60 shadow-sm"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        {user.user?.image ? (
                                            <img
                                                src={user.user.image}
                                                alt={user.user.name}
                                                className="size-10 rounded-full bg-gray-200 dark:bg-zinc-700 object-cover"
                                            />
                                        ) : (
                                            <div className="size-10 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-medium">
                                                {(user.user?.name || user.user?.email || '?')[0].toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-zinc-100">
                                                {user.user?.name || "Unknown User"}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-zinc-400">
                                                {user.user?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`px-2.5 py-1 text-xs font-medium rounded-md ${user.role === "ADMIN"
                                            ? "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400"
                                            : "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                                        }`}
                                    >
                                        {user.role || "MEMBER"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>


        </div>
    );
};

export default Team;
