import express from "express";
import {
  allotRoom,
  vacateRoom,
  getAllAllotments,
  getStudentAllotment,
  getHostelAllotments,
  getHostelAllotmentPolicy
} from "../controllers/RoomAllotmentController.js";

const roomAllotmentRouter = express.Router();

// Allot a room
roomAllotmentRouter.post("/allot", allotRoom);

roomAllotmentRouter.post("/allomentpolicy",getHostelAllotmentPolicy);
// Vacate a room
roomAllotmentRouter.put("/vacate", vacateRoom);

// Get all allotments
roomAllotmentRouter.get("/", getAllAllotments);

// Get allotment of a specific student
roomAllotmentRouter.get("/student/:studentId", getStudentAllotment);

// Get allotments for a specific hostel
roomAllotmentRouter.get("/hostel/:hostelId", getHostelAllotments);

export default roomAllotmentRouter;
