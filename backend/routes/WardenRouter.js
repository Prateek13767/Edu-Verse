import express from "express"
import { addWarden, getAllWardens, getWardenByHostel, getWardenById, loginWarden, updateWarden } from "../controllers/WardenController.js";

const wardenRouter=express.Router();

wardenRouter.post("/login",loginWarden);
wardenRouter.post("/add",addWarden);
wardenRouter.get("/",getAllWardens);
wardenRouter.get("/hostel/:hostelId",getWardenByHostel);
wardenRouter.get("/:wardenId",getWardenById);
wardenRouter.put("/update/:wardenId",updateWarden);

export default wardenRouter;