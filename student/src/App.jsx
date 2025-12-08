import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import MyProfile from './pages/MyProfile'
import Courses from './pages/Courses'
import GradeSheets from './pages/GradeSheets'
import TimeTable from './pages/TimeTable'

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login/>}></Route>
      <Route path='/' element={<Home/>}></Route>
      <Route path="/profile" element={<MyProfile/>}></Route>
      <Route path="/courses" element={<Courses/>}></Route>
      <Route path="/grades" element={<GradeSheets/>}></Route>
      <Route path="/timetable" element={<TimeTable/>}></Route>
    </Routes>
  )
}

export default App
