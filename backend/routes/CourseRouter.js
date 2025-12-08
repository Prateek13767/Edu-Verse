import express from "express";
import { addCourse, addCoursesBulk, deleteCourse, getAllCourses, getCourseById, updateCourse } from "../controllers/CourseController.js";

const courseRouter=express.Router();

courseRouter.post("/add",addCourse);
courseRouter.post("/addBulk",addCoursesBulk);
courseRouter.get("/",getAllCourses);
courseRouter.get("/:courseId",getCourseById);
courseRouter.put("/:courseId/update",updateCourse);
courseRouter.delete("/:courseId/delete",deleteCourse);

export {courseRouter}