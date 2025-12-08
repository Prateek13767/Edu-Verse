import express from "express"
import { getSettings, updateSetting } from "../controllers/SettingsController.js";

const settingsRouter=express.Router();

settingsRouter.post("/update",updateSetting);
settingsRouter.get("/get",getSettings);

export default settingsRouter;