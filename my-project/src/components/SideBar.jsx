import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import MyTasksSidebar from './MyTasksSidebar'
import ProjectSidebar from './ProjectSidebar'
import { DatabaseIcon, FolderOpenIcon, LayoutDashboardIcon, SettingsIcon, UsersIcon, Zap } from 'lucide-react'
import WorkspaceDropdown from './WorkspaceDropdown'
import { useRBAC } from '../hooks/useRBAC'
import PersonalRBACBox from './PersonalRBACBox'
import { ShieldCheckIcon } from 'lucide-react'

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const { canManageWorkspaceSettings, canAccessDatabaseViewer, canAccessTeamPage } = useRBAC();

    const menuItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboardIcon },
        { name: 'Projects', href: '/projects', icon: FolderOpenIcon },
        ...(canAccessTeamPage ? [{ name: 'Team', href: '/team', icon: UsersIcon }] : []),
        {
    name: 'Roles',
    href: '/roles',
    icon: ShieldCheckIcon
}
    ]

    const sidebarRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setIsSidebarOpen]);

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 py-2.5 px-3 text-sm cursor-pointer rounded-xl transition-all font-medium ${
            isActive
                ? 'bg-gradient-to-r from-blue-500/15 to-indigo-500/5 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20 shadow-sm'
                : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-100/80 dark:hover:bg-zinc-800/60 hover:text-gray-900 dark:hover:text-zinc-100'
        }`;

    const showWorkspaceGroup = canManageWorkspaceSettings || canAccessDatabaseViewer;

    return (
        <div
            ref={sidebarRef}
            className={`z-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur min-w-64 flex flex-col h-screen border-r border-gray-100 dark:border-zinc-800 max-sm:absolute transition-all duration-300 ${isSidebarOpen ? 'left-0' : '-left-full'}`}
        >
            {/* Brand */}
            <div className="p-4 border-b border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2.5 px-1">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                        <Zap className="size-4 text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm" style={{fontFamily:'Outfit,sans-serif'}}>ProjectFlow</p>
                        <p className="text-[10px] text-gray-400 dark:text-zinc-500">Workspace Hub</p>
                    </div>
                </div>
            </div>

            <WorkspaceDropdown />

            <hr className='border-gray-100 dark:border-zinc-800/80' />

            <div className='flex-1 no-scrollbar flex flex-col overflow-y-auto'>
                <div>
                    <div className='p-3 space-y-0.5'>
                        <p className="text-[10px] font-semibold text-gray-400 dark:text-zinc-600 uppercase tracking-widest px-3 pt-2 pb-1">Main Menu</p>
                        {menuItems.map((item) => (
                            <NavLink to={item.href} key={item.name} className={navLinkClass} end={item.href === '/'}>
                                <item.icon size={16} />
                                <p className='text-sm truncate'>{item.name}</p>
                            </NavLink>
                        ))}
                        {showWorkspaceGroup && (
                            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800/80">
                                <p className="text-[10px] font-semibold text-gray-400 dark:text-zinc-600 uppercase tracking-widest px-3 pb-1">Workspace</p>
                                {canManageWorkspaceSettings && (
                                    <NavLink to="/settings" className={navLinkClass}>
                                        <SettingsIcon size={16} />
                                        <p className='text-sm truncate'>Settings</p>
                                    </NavLink>
                                )}
                                {canAccessDatabaseViewer && (
                                    <NavLink to="/database" className={navLinkClass}>
                                        <DatabaseIcon size={16} />
                                        <p className='text-sm truncate'>Admin IT Panel</p>
                                    </NavLink>
                                )}
                            </div>
                        )}
                    </div>
                    <MyTasksSidebar />
                    <ProjectSidebar />
                </div>
            </div>
            <hr className='border-gray-100 dark:border-zinc-800/80 mt-auto' />
            <PersonalRBACBox />
        </div>
    )
}

export default Sidebar
