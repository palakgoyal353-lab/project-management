import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import Team from './pages/Team'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import TaskDetail from './pages/TaskDetail'

const App = () => {
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
      </Route>
     </Routes>
   </>
  )
}

export default App

