import express from "express";
import {
    markAttendance,
    getAttendanceByEnrollment,
    updateAttendance,
    markAttendanceforAll,
    getAttendanceByOffering,
    getAttendancePercentage
} from "../controllers/AttendanceController.js";

const attendanceRouter = express.Router();

// ✅ Mark attendance for one
attendanceRouter.post("/mark", markAttendance);

// ✅ Mark attendance for all students in a class
attendanceRouter.post("/mark-all", markAttendanceforAll);

attendanceRouter.post("/offering/:offeringId",getAttendanceByOffering);
// ✅ Get attendance of a specific enrollment
attendanceRouter.get("/:enrollmentId", getAttendanceByEnrollment);

attendanceRouter.get("/attendancepercentage/:enrollmentId",getAttendancePercentage);

// ✅ Update attendance
attendanceRouter.put("/update/:attendanceId", updateAttendance);

export default attendanceRouter;
