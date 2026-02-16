import express from "express"
import { addHostel, deleteHostel, getAllHostels, getHostelById, updateHostel } from "../controllers/HostelController.js";

const hostelRouter=express.Router();

hostelRouter.post("/create",addHostel);
hostelRouter.get("/",getAllHostels);
hostelRouter.get("/:hostelId",getHostelById);
hostelRouter.put("/update/:hostelId",updateHostel);
hostelRouter.delete("/delete",deleteHostel);

export default hostelRouter;