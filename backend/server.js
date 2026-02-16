import dotenv from "dotenv";
dotenv.config();          // ✅ MUST BE FIRST LINE

import express from "express";
import cors from "cors";
import { connectdb } from "./configs/db.js";
import { studentRouter } from "./routes/StudentRouter.js";
import { facultyRouter } from "./routes/FacultyRouter.js";
import { courseRouter } from "./routes/CourseRouter.js";
import { courseOfferingRouter } from "./routes/CourseOfferingRouter.js";
import { enrollmentRouter } from "./routes/EnrollmentRouter.js";
import attendanceRouter from "./routes/AttendanceRouter.js";
import gradeRouter from "./routes/GradeRouter.js";
import adminRouter from "./routes/AdminRouter.js";
import academicCalendarRouter from "./routes/AcademicCalendarRouter.js";
import settingsRouter from "./routes/SettingsRouter.js";
import hostelRouter from "./routes/HostelRouter.js";
import roomRouter from "./routes/RoomRouter.js";
import wardenRouter from "./routes/WardenRouter.js";
import roomAllotmentRouter from "./routes/RoomAllotmentRouter.js";
import willingnessRouter from "./routes/WillingnessRouter.js";
import complaintRouter from "./routes/ComplaintRouter.js";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectdb();

app.use("/student", studentRouter);
app.use("/faculty",facultyRouter);
app.use("/course",courseRouter);
app.use("/courseOffering",courseOfferingRouter);
app.use("/enrollment",enrollmentRouter);
app.use("/attendance",attendanceRouter);
app.use("/grade",gradeRouter);
app.use("/admin",adminRouter);
app.use("/academiccalendar",academicCalendarRouter);
app.use("/settings",settingsRouter);
app.use("/hostel",hostelRouter);
app.use("/room",roomRouter);
app.use("/willingness",willingnessRouter);
app.use("/roomallotment",roomAllotmentRouter);
app.use("/warden",wardenRouter);
app.use("/complaint",complaintRouter);

app.listen(PORT, () => {
    console.log(`Server is listening to PORT ${PORT}`);
});
