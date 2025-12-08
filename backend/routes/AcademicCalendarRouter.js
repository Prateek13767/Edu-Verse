import express from "express";
import {
  createCalendar,
  updateCalendar,
  getCalendarByYearSem,
  getActiveCalendar,
  checkRegistrationStatus,
  checkGradeSheetStatus,
  deleteCalendar
} from "../controllers/AcademicCalendarController.js";

const academicCalendarRouter = express.Router();

/* ------------------ ADMIN OPERATIONS ------------------ */

// Create a new academic calendar
academicCalendarRouter.post("/create", createCalendar);

// Update existing academic calendar
academicCalendarRouter.put("/:id", updateCalendar);

// Delete academic calendar
academicCalendarRouter.delete("/:id", deleteCalendar);


/* ------------------ FETCH CALENDAR ------------------ */

// Get calendar by year & semester
// expects: { year, semester } in req.body
academicCalendarRouter.post("/get-by-year-sem", getCalendarByYearSem);

// Get currently active academic calendar
academicCalendarRouter.get("/active", getActiveCalendar);


/* ------------------ AUTO FEATURES ------------------ */

// Auto detect if course registration is open
academicCalendarRouter.get("/status/registration", checkRegistrationStatus);

// Auto detect if grade sheets can be viewed
academicCalendarRouter.get("/status/gradesheet", checkGradeSheetStatus);


export default academicCalendarRouter;
