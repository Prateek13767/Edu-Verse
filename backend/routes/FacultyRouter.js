import express from "express";
import {
    registerFaculty,
    loginFaculty,
    getAllFaculty,
    getFacultyById,
    getFacultyCourses,
    getFacultyCoordinatingCourses
} from "../controllers/FacultyController.js";

const facultyRouter = express.Router();

facultyRouter.post("/register", registerFaculty);
facultyRouter.post("/login", loginFaculty);

// GET ALL FACULTY
facultyRouter.get("/", getAllFaculty);

// GET FACULTY BY ID
facultyRouter.get("/:id", getFacultyById);

// GET COURSES FACULTY TEACHES
facultyRouter.get("/:id/courses", getFacultyCourses);

// GET COURSES COORDINATED BY FACULTY
facultyRouter.get("/:id/coordinating", getFacultyCoordinatingCourses);

export { facultyRouter };
