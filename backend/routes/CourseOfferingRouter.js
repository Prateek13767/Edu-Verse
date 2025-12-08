import express from "express";
import { addCourseOffering, deleteCourseOffering, getAllOfferings, getOfferingByFilter, getOfferingById, updateCourseOffering } from "../controllers/CourseOfferingController.js";

const courseOfferingRouter = express.Router();

courseOfferingRouter.post("/add", addCourseOffering);

courseOfferingRouter.get("/", getAllOfferings);

courseOfferingRouter.post("/filter", getOfferingByFilter);

courseOfferingRouter.get("/:offeringId", getOfferingById);

courseOfferingRouter.put("/:offeringId/update", updateCourseOffering);

courseOfferingRouter.delete("/:offeringId/delete", deleteCourseOffering);

export { courseOfferingRouter };
