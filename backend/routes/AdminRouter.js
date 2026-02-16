import express from "express";
import { adminLogin, generateResultsForAllStudents } from "../controllers/AdminController.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/generate-result",generateResultsForAllStudents);

export default adminRouter;
