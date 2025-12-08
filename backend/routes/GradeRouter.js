import express from "express";
import {
  uploadMarks,
  getGradesByEnrollment,
  getGradesByOffering,
  updateGrade,
  assignGradesInBulk,
  createGrade,
  uploadMarksBulk,
} from "../controllers/GradeController.js";

const gradesRouter = express.Router();

gradesRouter.post("/create",createGrade);
// ✅ Upload / update marks of a single student
gradesRouter.post("/upload", uploadMarks);

gradesRouter.post("/upload-bulk",uploadMarksBulk);
// ✅ Get grades of a single student using enrollmentId
gradesRouter.get("/enrollment/:enrollmentId", getGradesByEnrollment);

// ✅ Get grades of all students of a course offering
gradesRouter.get("/offering/:offeringId", getGradesByOffering);

// ✅ Update entire grade object (assignments, quiz, project etc.)
gradesRouter.put("/update", updateGrade);

// ✅ Assign letter grades to many enrollment IDs at once
gradesRouter.post("/assign-bulk", assignGradesInBulk);

export default gradesRouter;
