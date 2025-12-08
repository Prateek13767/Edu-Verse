import express from "express";
import {
    registerStudent,
    loginStudent,
    getAllStudents,
    getStudentById,
    getStudentCourses,
    getStudentAttendance,
    getStudentCGPA,
    getStudentByFilter,
    registerMany
} from "../controllers/StudentController.js";

const studentRouter = express.Router();

// Auth
studentRouter.post("/register", registerStudent);
studentRouter.post("/registermany",registerMany);
studentRouter.post("/login", loginStudent);

// Students
studentRouter.get("/", getAllStudents);


studentRouter.post("/filter",getStudentByFilter);
studentRouter.get("/:id", getStudentById);

// Student courses
studentRouter.get("/:id/courses", getStudentCourses);

// Attendance (optional courseId filter)
studentRouter.get("/:id/attendance", getStudentAttendance);

// CGPA (needs auth middleware to set req.userId)
studentRouter.get("/:id/cgpa", getStudentCGPA);

export { studentRouter };5 
