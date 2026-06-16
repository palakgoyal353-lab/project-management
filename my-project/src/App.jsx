import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchWorkspaces } from './feature/WorkspaceSlice'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import Team from './pages/Team'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import TaskDetail from './pages/TaskDetail'
import Settings from './pages/Settings'
import DatabaseViewer from './pages/DatabaseViewer'

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  return (
   <>
     <Toaster/>
     <Routes>
      <Route path='/' element={<Layout/>}>
      <Route index element={<Dashboard/>}/>
      <Route path='/team' element={<Team/>}/>
      <Route path='/projects' element={<Projects/>}/>
      <Route path='/projectdetail' element={<ProjectDetail/>}/>
      <Route path='/taskdetail' element={<TaskDetail/>}/>
      <Route path='/settings' element={<Settings/>}/>
      <Route path='/database' element={<DatabaseViewer/>}/>
      </Route>
     </Routes>
   </>
  )
}

export default App

