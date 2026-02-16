import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Students from './pages/Students'
import Complaints from './pages/Complaints'
import RoomManagement from './pages/RoomManagement'
import Reports from './pages/Reports'
import ComplaintDetails from './pages/ComplaintDetails'

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login/>}></Route>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/students' element={<Students/>}></Route>
      <Route path="/complaints" element={<Complaints/>}></Route>
      <Route path="/complaints/:complaintId" element={<ComplaintDetails/>}></Route>
      <Route path="/rooms" element={<RoomManagement/>}></Route>
      <Route path="/reports" element={<Reports/>}></Route>
    </Routes>
  )
}

export default App
