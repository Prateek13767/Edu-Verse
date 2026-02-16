import express from "express";
import { 
  submitWillingness,
  getAllWillingness,
  getWillingnessByStudent,
  updateWillingnessStatus,
  getWillingnessByFilter
} from "../controllers/WillingnessController.js";

const willingnessRouter = express.Router();

// Submit willingness form
willingnessRouter.post("/submit", submitWillingness);

// Get all willingness forms
willingnessRouter.get("/", getAllWillingness);

willingnessRouter.post("/filter",getWillingnessByFilter);

// Get willingness of a specific student
willingnessRouter.get("/student/:studentId", getWillingnessByStudent);

// Update willingness status (Approve / Reject)
willingnessRouter.put("/update-status/:willingnessId", updateWillingnessStatus);

export default willingnessRouter;
