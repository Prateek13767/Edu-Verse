import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Home from './pages/Home'
import Students from './pages/Students'
import MyCourses from './pages/MyCourses'
import MarkAttendance from './pages/MarkAttendance'
import AssignGrade from './pages/AssignGrade'
import CoordinatorCourseOfferingDetails from './pages/CoordinatorCourseOfferingDetails'
import InstructorCourseOfferingDetails from './pages/InstructorCourseOfferingDetails'
import InstructorStudentDetails from './pages/InstructorStudentDetails'
import CoordinatorStudentDetails from './pages/CoordinatorStudentDetails'
function App() {
  return (
    <Routes>
      <Route path='/faculty-login' element={<Login/>}></Route>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/students' element={<Students/>}></Route>
      <Route path='/courses' element={<MyCourses/>}></Route>
      <Route path='/attendance' element={<MarkAttendance/>} ></Route>
      <Route path='/grades' element={<AssignGrade/>}></Route>
      <Route path="/courses/coordinator/:offeringId" element={<CoordinatorCourseOfferingDetails />} />
      <Route path="/courses/instructor/:offeringId" element={<InstructorCourseOfferingDetails/>}></Route>
      <Route path="/courses/instructor/enrollment/:enrollmentId" element={<InstructorStudentDetails/>}></Route>
      <Route path="/courses/coordinator/enrollment/:enrollmentId" element={<CoordinatorStudentDetails/>}></Route>
      <Route path="/courses/instructor/:offeringId/attendance" element={<MarkAttendance/>}></Route>
      <Route path="/courses/instructor/:offeringId/grades" element={<AssignGrade/>}></Route>
    </Routes>
  )
}

export default App
