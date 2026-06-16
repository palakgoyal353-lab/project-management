import { Loader2Icon, Zap } from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import { loadTheme } from '../feature/themeSlice'
import { useUser } from '@clerk/react'
import SideBar from '../components/SideBar'
import { useState } from 'react'
import { fetchWorkspaces } from '../feature/WorkspaceSlice'

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { loading } = useSelector((state) => state.workspace)
    const dispatch = useDispatch()
    const { isLoaded, user } = useUser()

    useEffect(() => {
        dispatch(loadTheme()) 
    }, [])

    useEffect(() => {  
        if (isLoaded && user) {
            dispatch(fetchWorkspaces())
        }
    }, [isLoaded, user])

    if (!isLoaded) return (
        <div className='flex items-center justify-center h-screen bg-gradient-to from-black to-blue-50 dark:from-zinc-950 dark:to-zinc-900'>
            <div className='flex flex-col items-center gap-4'>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl animate-float">
                    <Zap className="size-7 text-white" />
                </div>
                <div className='flex flex-col items-center gap-2'>
                    <p className='text-base font-semibold text-zinc-700 dark:text-zinc-200' style={{fontFamily:'Outfit,sans-serif'}}>ProjectFlow</p>
                    <div className="flex gap-1">
                        {[0,1,2].map(i => (
                            <div key={i} className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

    if (loading) return (
        <div className='flex items-center justify-center h-screen bg-gradient-to from-black to-blue-50 dark:from-zinc-950 dark:to-zinc-900'>
            <div className='flex flex-col items-center gap-4'>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl">
                    <Zap className="size-7 text-white animate-pulse" />
                </div>
                <p className='text-sm font-medium text-zinc-500 dark:text-zinc-400'>Loading workspace...</p>
            </div>
        </div>
    )

    return (
        <div className='flex bg-zinc-50/80 dark:bg-zinc-950 text-gray-900 dark:text-slate-100 min-h-screen'>
            <SideBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className='flex-1 flex flex-col h-screen'>
                <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <div className='flex-1 h-full p-6 xl:p-8 overflow-y-auto'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout
