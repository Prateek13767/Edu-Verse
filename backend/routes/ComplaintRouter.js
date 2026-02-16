import express from "express"
import {
  addComplaint,
  getAllComplaints,
  getComplaintById,
  getComplaintByFilter,
  updateStatus,
  deleteComplaint
} from "../controllers/ComplaintController.js";

const complaintRouter=express.Router();

complaintRouter.post("/add", addComplaint);

complaintRouter.post("/filter", getComplaintByFilter);

complaintRouter.get("/:complaint", getComplaintById);

complaintRouter.get("/", getAllComplaints);

complaintRouter.put("/status/update", updateStatus);

complaintRouter.delete("/delete", deleteComplaint);

export default complaintRouter;
