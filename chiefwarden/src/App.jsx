import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Hostels from './pages/Hostels.jsx'
import Wardens from './pages/Wardens.jsx'
import Students from './pages/Students.jsx'
import RoomAllocation from './pages/RoomAllocation.jsx'
import Complaints from './pages/Complaints.jsx'
import Reports from './pages/Reports.jsx'
import AddHostel from './pages/AddHostel.jsx'
import HostelDetails from './pages/HostelDetails.jsx'
import AssignWarden from './pages/AssignWarden.jsx'
import StudentDetails from './pages/StudentDetails.jsx'
import ManualAllocate from './pages/ManualAllocate.jsx'
import ComplaintDetails from './pages/ComplaintDetails.jsx'

const App = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login/>}></Route>
      <Route path="/" element={<Home/>}></Route>
      <Route path='/hostels' element={<Hostels/>}></Route>
      <Route path="/hostels/add-hostel" element={<AddHostel/>}></Route>
      <Route path='/hostels/:hostelId' element={<HostelDetails/>}></Route>
      <Route path="/wardens" element={<Wardens/>}></Route>
      <Route path="/students" element={<Students/>}></Route>
      <Route path="/complaints" element={<Complaints/>}></Route>
      <Route path="/room-allocation" element={<RoomAllocation/>}></Route>
      <Route path="/wardens/assign-warden/:hostelId" element={<AssignWarden/>}></Route>
      <Route path="/students/:studentId" element={<StudentDetails/>}></Route>
      <Route path="/room-allocation/manual/:willingnessId" element={<ManualAllocate/>}></Route>
      <Route path="/complaints/:complaintId" element={<ComplaintDetails/>}></Route>
      <Route path="/reports" element={<Reports/>}></Route>
    </Routes>
  )
}

export default App
