import mongoose from "mongoose";
import Room from "../models/Room.js";

// ------------------------------------------------------
// 1️⃣ ADD ROOM
// ------------------------------------------------------
export const addRoom = async (req, res) => {
  try {
    const { hostel, block, floor, roomIndex, capacity } = req.body;

    // Floor check must allow 0
    if (!hostel || !block || floor === undefined || roomIndex === "" || !capacity) {
      return res.json({ success: false, message: "Missing fields" });
    }

    const formattedRoom = `${block}-${floor}${roomIndex}`;

    const exists = await Room.findOne({ hostel, formattedRoom });
    if (exists) {
      return res.json({
        success: false,
        message: "Room already exists in this hostel",
      });
    }

    const newRoom = await Room.create({
      hostel,
      block,
      floor,
      roomIndex,
      formattedRoom,
      capacity,
    });

    return res.json({
      success: true,
      message: "Room created successfully",
      roomId: newRoom._id,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error occurred" });
  }
};

// ------------------------------------------------------
// 2️⃣ GET ROOM BY ID
// ------------------------------------------------------
export const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.json({ success: false, message: "Room Id Not Found" });
    }

    const roomDetails = await Room.findById(roomId).populate("hostel");

    if (!roomDetails) {
      return res.json({ success: false, message: "Room Not Found" });
    }

    return res.json({
      success: true,
      message: "Details Fetched Successfully",
      roomDetails,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error", error });
  }
};

// ------------------------------------------------------
// 3️⃣ GET ALL ROOMS
// ------------------------------------------------------
export const getAllRooms = async (req, res) => {
  try {
    const roomDetails = await Room.find().populate("hostel");

    return res.json({
      success: true,
      message: "Details Fetched Successfully",
      roomDetails,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error" });
  }
};

// ------------------------------------------------------
// 4️⃣ GET ROOMS BY HOSTEL ID (used in HostelDetails page)
// ------------------------------------------------------
export const getRoomsByHostel = async (req, res) => {
  try {
    const { hostelId } = req.params;

    if (!hostelId) {
      return res.json({ success: false, message: "Hostel ID missing" });
    }

    const rooms = await Room.find({ hostel: hostelId }).populate("hostel");

    return res.json({
      success: true,
      message: "Rooms fetched successfully",
      rooms,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error fetching rooms", error });
  }
};

// ------------------------------------------------------
// 5️⃣ FILTER ROOMS (GET request)
// ------------------------------------------------------
export const getRoomsByFilter = async (req, res) => {
  try {
    const { hostel, block, floor, status, vacantOnly } = req.body;

    let filter = {};

    if (hostel) filter.hostel = hostel;
    if (block) filter.block = block;
    if (floor) filter.floor = Number(floor);
    if (status) filter.status = status;

    if (vacantOnly === "true") {
      filter.$expr = { $lt: ["$occupied", "$capacity"] };
    }

    const rooms = await Room.find(filter).populate("hostel");

    return res.json({
      success: true,
      message: "Rooms fetched successfully",
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error fetching rooms",
      error,
    });
  }
};

// ------------------------------------------------------
// 6️⃣ UPDATE ROOM ASSETS
// ------------------------------------------------------
export const updateAssets = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { updatedAssets } = req.body;

    if (!roomId || !updatedAssets) {
      return res.json({ success: false, message: "Fields Missing" });
    }

    const roomDetails = await Room.findById(roomId);

    if (!roomDetails) {
      return res.json({ success: false, message: "Room Not Found" });
    }

    // Update only valid assets
    for (const assetKey in updatedAssets) {
      if (roomDetails.assets[assetKey]) {
        const update = updatedAssets[assetKey];

        if (update.count !== undefined) {
          roomDetails.assets[assetKey].count = update.count;
        }
        if (update.condition !== undefined) {
          roomDetails.assets[assetKey].condition = update.condition;
        }
      }
    }

    await roomDetails.save();

    return res.json({
      success: true,
      message: "Room assets updated successfully",
      assets: roomDetails.assets,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error while updating assets",
      error,
    });
  }
};
