import mongoose from "mongoose"
import Student from "../models/student.js";
import Room from "../models/Room.js";


// 🔹 Add New Room
export const addRoom = async (req, res) => {
  try {
    const { hostel, block, floor, roomIndex, capacity } = req.body;

    if (!hostel || !block || !floor || !roomIndex || !capacity) {
      return res.json({ success: false, message: "Missing fields" });
    }

    const formattedRoom = `${block}-${floor}${roomIndex}`;

    const exists = await Room.findOne({ hostel, formattedRoom });
    if (exists) {
      return res.json({ success: false, message: "Room already exists in this hostel" });
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



// 🔹 Allot Room to Student
export const allotRoom = async (req, res) => {
  try {
    const { roomId, studentId } = req.body;

    const roomDetails = await Room.findById(roomId).populate("hostel");
    const studentDetails = await Student.findById(studentId);

    if (!roomDetails || !studentDetails) {
      return res.json({ success: false, message: "Invalid student or room" });
    }

    // Gender validation
    if (roomDetails.hostel.type !== studentDetails.gender) {
      return res.json({ success: false, message: "Gender mismatch for this hostel" });
    }

    // Room capacity check
    if (roomDetails.occupied >= roomDetails.capacity) {
      return res.json({ success: false, message: "Room already full" });
    }

    // Student must not have a current room
    if (studentDetails.currentRoom) {
      return res.json({ success: false, message: "Student already has a room" });
    }

    // Update room
    roomDetails.students.push(studentId);
    roomDetails.occupied += 1;
    await roomDetails.save();

    // Update student
    studentDetails.currentRoom = roomId;
    studentDetails.currentHostel = roomDetails.hostel._id;
    studentDetails.rooms.push({ room: roomId, status: "allotted" });
    await studentDetails.save();

    return res.json({ success: true, message: "Room allotted successfully" });

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Error occurred while allotting room" });
  }
};



// 🔹 Vacate Room
export const vacateRoom = async (req, res) => {
  try {
    const { studentId, roomId } = req.body;

    if (!studentId || !roomId) {
      return res.json({ success: false, message: "Fields Missing" });
    }

    const studentDetails = await Student.findById(studentId);
    const roomDetails = await Room.findById(roomId).populate("hostel students");

    if (!studentDetails || !roomDetails) {
      return res.json({ success: false, message: "Details not found" });
    }

    // Update student room history status
    let found = false;
    for (let i = 0; i < studentDetails.rooms.length; i++) {
      if (String(studentDetails.rooms[i].room) === String(roomId)) {
        studentDetails.rooms[i].status = "vacated";
        found = true;
        break;
      }
    }

    if (!found) {
      return res.json({ success: false, message: "Student was not living in this room" });
    }

    // Clear student's current room + hostel
    studentDetails.currentRoom = null;
    studentDetails.currentHostel = null;
    await studentDetails.save();

    // Remove student from room list
    roomDetails.students = roomDetails.students.filter(
      (s) => String(s) !== String(studentId)
    );

    // Reduce occupancy count
    if (roomDetails.occupied > 0) {
      roomDetails.occupied -= 1;
    }

    await roomDetails.save();

    return res.json({
      success: true,
      message: "Room successfully vacated",
      student: studentDetails,
      room: roomDetails,
    });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Server Error", error });
  }
};



// 🔹 Get Room Details
export const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.json({ success: false, message: "Room Id Not Found" });
    }

    const roomDetails = await Room.findById(roomId)
      .populate("hostel")
      .populate("students");

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



// 🔹 Update Assets (bed / table / chair / cupboard / fan / light)
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

    for (const key in updatedAssets) {
      if (roomDetails.assets[key] !== undefined) {
        if (updatedAssets[key].count !== undefined) {
          roomDetails.assets[key].count = updatedAssets[key].count;
        }
        if (updatedAssets[key].condition !== undefined) {
          roomDetails.assets[key].condition = updatedAssets[key].condition;
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
    return res.json({ success: false, message: "Error while updating assets", error });
  }
};
