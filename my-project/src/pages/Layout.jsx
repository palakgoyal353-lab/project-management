import { Loader2Icon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import { loadTheme } from '../feature/themeSlice'
import { useUser, SignIn } from '@clerk/react'
import SideBar from '../components/SideBar'


const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const {loading} = useSelector((state)=> state.workspace)
    const dispatch = useDispatch()
    const {user, isLoaded} = useUser()

    // initial load of theme
    useEffect(()=>{
       dispatch(loadTheme())
    },[])

    if(!user){
        return(
            <div className='flex justify-center items-center h-screen bg-white'>
                <SignIn/>
            </div>
        )
    }

    if(loading) return(
        <div className='flex items-center justify-center h-screen bg-white dark:bg-white'>
           <Loader2Icon className='size-7 text-blue-500 animate-spin'/>
        </div>
    )
  return (
    <div className='flex bg-white  text-gray-900 dark:text-slate-100'>
      <SideBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
      <div className='flex-1 flex flex-col h-screen'>
       <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
       <div className='flex-1 h-full p-6 xl:p-10 xl:px-16 overflow-y-scroll  '>
         <Outlet/>
       </div>
      </div>
    </div>
  )
}

export default Layout
