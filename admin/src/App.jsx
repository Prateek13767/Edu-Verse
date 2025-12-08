import React from 'react'
import {Routes,Route} from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import AddFaculty from './pages/AddFaculty';
import AddStudent from './pages/AddStudent';
import ViewFaculty from './pages/ViewFaculty';
import ViewStudent from './pages/ViewStudent';
import AddCourseOffering from './pages/AddCourseOffering';
import ViewCourseOffering from './pages/ViewCourseOffering';
import CourseOfferingDetails from './pages/CourseOfferingDetails';
import AssignFaculty from './pages/AssignFaculty';
import AssignFacultyOnOffering from './pages/AssignFacultyOnOffering';
import ShowAttendance from './pages/ShowAttendance';
import ShowAttendanceOffering from './pages/ShowAttendanceOffering';
import AccessGradeSheets from './pages/AccessGradeSheets';
import StudentsGradeSheets from './pages/StudentsGradeSheets';

import ChangeSettings from './pages/ChangeSettings';
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/admin-login" element={<Login/>}></Route>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/admin/add-faculty" element={<AddFaculty/>}></Route>
        <Route path='/admin/add-student' element={<AddStudent/>}></Route>
        <Route path='/admin/view-faculty' element={<ViewFaculty/>}></Route>
        <Route path='/admin/view-students' element={<ViewStudent/>}></Route>
        <Route path='/admin/add-offering' element={<AddCourseOffering/>}></Route>
        <Route path='/admin/view-offerings' element={<ViewCourseOffering/>}></Route>
        <Route path='/admin/view-offerings/:offeringId' element={<CourseOfferingDetails/>}></Route>
        <Route path='/admin/assign-faculty' element={<AssignFaculty/>}></Route>
        <Route path="/admin/assign-faculty/:offeringId" element={<AssignFacultyOnOffering/>}></Route>
        <Route path="/admin/attendance" element={<ShowAttendance/>}></Route>
        <Route path="/admin/attendance/:offeringId" element={<ShowAttendanceOffering/>}></Route>
        <Route path="/admin/gradesheets" element={<AccessGradeSheets/>}></Route>
        <Route path="/admin/gradesheets/:studentId" element={<StudentsGradeSheets/>}></Route>
        <Route path="/admin/settings" element={<ChangeSettings/>}></Route>
        {/* <Route path="/admin/create-academic-calendar" element={<CreateAcademicCalendar/>}></Route>
        <Route path='/admin/show-academic-calendar' element={<ShowPreviousCalendars/>}></Route> */}
      </Routes>
    </div>
  )
}

export default App
