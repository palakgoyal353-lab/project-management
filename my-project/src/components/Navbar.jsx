import { SearchIcon, PanelLeft } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import { UserButton } from '@clerk/react'

const Navbar = ({ setIsSidebarOpen }) => {

    const dispatch = useDispatch();
    const { theme } = useSelector(state => state.theme);

    return (
        <div className="w-full bg-white dark:bg-zinc-500 border-b border-gray-100 dark:border-zinc-800 px-6 xl:px-16 py-3 flex-shrink:0">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
                {/* Left section */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                   
                    <button onClick={() => setIsSidebarOpen((prev) => !prev)} className="sm:hidden p-2 rounded-lg transition-colors text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800" >
                        <PanelLeft size={20} />
                    </button>

                    {/* Search Input */}
                    <div className="relative flex-1 max-w-sm">
                        <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-400 size-3.5" />
                        <input
                            type="text"
                            placeholder="Search projects, tasks..."
                            className="pl-8 pr-4 py-2 w-full dark:bg-zinc-500 border dark:border-zinc-700 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-400 focus:outline-none focus:ring-1  transition"
                        />
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-3">

                    {/* User Button */}
                   <UserButton  />
                </div>
            </div>
        </div>
    )
}

export default Navbar
