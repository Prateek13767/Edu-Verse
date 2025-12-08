import express from "express";
import {
    addEnrollment,
    changeEnrollmentStatus,
    dropCourse,
    getEnrollmentsByOffering,
    getStudentEnrollments,
    getEnrollmentsByFields,
    getAllEnrollments,
    removeEnrollment,
    addBulkEnrollments,getEnrollmentById,
    assignFacultyAndSchedule
} from "../controllers/EnrollmentController.js";

const enrollmentRouter = express.Router();

// Add a new enrollment
enrollmentRouter.post("/add", addEnrollment);

enrollmentRouter.post("/addbulk",addBulkEnrollments);

// Get all enrollments of a student
enrollmentRouter.get("/student/:studentId", getStudentEnrollments);

// Change status of a specific enrollment
enrollmentRouter.put("/:enrollmentId/change", changeEnrollmentStatus);

// Drop a course (by student)
enrollmentRouter.put("/:courseOfferingId/drop", dropCourse);

// Get enrollments for a specific offering
enrollmentRouter.get("/offering/:offeringId", getEnrollmentsByOffering);

// Get enrollments based on dynamic filters (faculty, status, student, offering, etc.)
enrollmentRouter.post("/filter", getEnrollmentsByFields);

// Admin: Get all enrollments
enrollmentRouter.get("/", getAllEnrollments);

enrollmentRouter.get("/:enrollmentId",getEnrollmentById);
// Admin: Delete an enrollment
enrollmentRouter.delete("/:enrollmentId/delete", removeEnrollment);


enrollmentRouter.put("/assign-faculty-schedule", assignFacultyAndSchedule);

export { enrollmentRouter };
