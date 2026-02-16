import express from "express"
import { chiefWardenLogin } from "../controllers/ChiefWardenController.js";

const chiefWarden=express.Router();

chiefWarden.post("/login",chiefWardenLogin);

export default chiefWarden;