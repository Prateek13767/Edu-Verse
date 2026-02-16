import express from "express";
import { 
  addRoom, 
  getAllRooms, 
  getRoomById, 
  getRoomsByFilter, 
  getRoomsByHostel, 
  updateAssets 
} from "../controllers/RoomController.js";

const roomRouter = express.Router();

// Room Creation
roomRouter.post("/create", addRoom);

// Fetch Rooms
roomRouter.get("/", getAllRooms);

roomRouter.post("/filter", getRoomsByFilter);
roomRouter.get("/:roomId", getRoomById);
roomRouter.get("/hostel/:hostelId",getRoomsByHostel);
// Update Room Assets
roomRouter.put("/update/:roomId", updateAssets);

export default roomRouter;
