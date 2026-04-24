import { SearchIcon, PanelLeft, Sun, Moon, Bell, Zap } from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { UserButton } from '@clerk/react'
import { toggleTheme } from '../feature/themeSlice'

const Navbar = ({ setIsSidebarOpen }) => {
    const dispatch = useDispatch();
    const { theme } = useSelector(state => state.theme);
    const [searchFocused, setSearchFocused] = useState(false);

    return (
        <div className="w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur border-b border-gray-100 dark:border-zinc-800 px-6 xl:px-8 py-3 flex-shrink-0 sticky top-0 z-20">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
                {/* Left */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                    <button
                        onClick={() => setIsSidebarOpen(prev => !prev)}
                        className="sm:hidden p-2 rounded-lg text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <PanelLeft size={18} />
                    </button>

                    {/* Search */}
                    <div className={`relative flex-1 max-w-sm transition-all duration-300 ${searchFocused ? 'max-w-md' : ''}`}>
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 size-3.5" />
                        <input
                            type="text"
                            placeholder="Search projects, tasks..."
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            className={`pl-9 pr-4 py-2 w-full text-sm rounded-xl border transition-all duration-200 ${
                                searchFocused
                                    ? 'border-blue-400 dark:border-blue-500 ring-4 ring-blue-500/10 bg-white dark:bg-zinc-800'
                                    : 'border-zinc-200 dark:border-zinc-700/60 bg-zinc-50 dark:bg-zinc-800/50'
                            } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none`}
                        />
                        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-600 font-mono">
                            ⌘K
                        </kbd>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2 ml-4">
                    {/* Dark mode toggle */}
                    <button
                        onClick={() => dispatch(toggleTheme())}
                        className="p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all hover:scale-105"
                        title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    >
                        {theme === 'dark'
                            ? <Sun size={17} className="text-amber-400" />
                            : <Moon size={17} />
                        }
                    </button>

                    {/* Notification bell */}
                    <button className="relative p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all hover:scale-105">
                        <Bell size={17} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white dark:border-zinc-900" />
                    </button>

                    <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700" />

                    {/* User */}
                    <UserButton />
                </div>
            </div>
        </div>
    )
}

export default Navbar
