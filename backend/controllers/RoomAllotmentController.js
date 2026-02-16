import Room from "../models/Room.js";
import Student from "../models/Student.js";
import Willingness from "../models/Willingness.js";
import RoomAllotment from "../models/RoomAllotment.js";

// -------------------------------------------------------
// 1️⃣ ALLOT ROOM TO STUDENT
// -------------------------------------------------------
export const allotRoom = async (req, res) => {
  try {
    const { studentId, roomId, year, willingnessId } = req.body;

    if (!studentId || !roomId || !year || !willingnessId) {
      return res.json({ success: false, message: "Missing fields" });
    }

    const student = await Student.findById(studentId);
    const room = await Room.findById(roomId).populate("hostel");
    const willingness = await Willingness.findById(willingnessId);

    if (!student || !room || !willingness) {
      return res.json({
        success: false,
        message: "Invalid student / room / willingness",
      });
    }

    // Check gender compatibility with hostel
    if (room.hostel.type !== student.gender) {
      return res.json({
        success: false,
        message: "Hostel is not for this gender",
      });
    }

    // Prevent multiple allotments in same year
    const existing = await RoomAllotment.findOne({ student: studentId, year });
    if (existing) {
      return res.json({
        success: false,
        message: "Student already allotted in this academic year",
      });
    }

    // Check room capacity
    if (room.occupied >= room.capacity) {
      return res.json({ success: false, message: "Room is already full" });
    }

    // Create allotment entry
    const allotment = await RoomAllotment.create({
      student: studentId,
      hostel: room.hostel._id,
      room: roomId,
      year,
      willingness: willingnessId,
      status: "Allotted",
    });

    // Update room data
    room.students.push(studentId);
    room.occupied += 1;
    await room.save();

    return res.json({
      success: true,
      message: "Room allotted successfully",
      allotment,
    });

  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error while allotting room",
      error,
    });
  }
};

// -------------------------------------------------------
// 2️⃣ VACATE ROOM
// -------------------------------------------------------
export const vacateRoom = async (req, res) => {
  try {
    const { studentId, year } = req.body;

    if (!studentId || !year) {
      return res.json({ success: false, message: "Missing fields" });
    }

    // Find current allotment
    const allotment = await RoomAllotment.findOne({
      student: studentId,
      year,
      status: "Allotted",
    });

    if (!allotment) {
      return res.json({
        success: false,
        message: "Student is not allotted a room for this year",
      });
    }

    const room = await Room.findById(allotment.room);

    // Update allotment status
    allotment.status = "Vacated";
    await allotment.save();

    // Remove student from room
    room.students = room.students.filter(
      (sid) => String(sid) !== String(studentId)
    );

    if (room.occupied > 0) room.occupied -= 1;

    await room.save();

    return res.json({
      success: true,
      message: "Room vacated successfully",
      allotment,
    });

  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error while vacating room",
      error,
    });
  }
};

// -------------------------------------------------------
// 3️⃣ GET ALL ROOM ALLOTMENTS
// -------------------------------------------------------
export const getAllAllotments = async (req, res) => {
  try {
    const data = await RoomAllotment.find()
      .populate("student")
      .populate("hostel")
      .populate("room")
      .populate("willingness");

    return res.json({
      success: true,
      message: "All allotments fetched",
      count: data.length,
      data,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error fetching allotments" });
  }
};

// -------------------------------------------------------
// 4️⃣ GET ALLOTMENTS FOR A SPECIFIC STUDENT
// -------------------------------------------------------
export const getStudentAllotment = async (req, res) => {
  try {
    const { studentId } = req.params;

    const allotments = await RoomAllotment.find({ student: studentId })
      .populate("room")
      .populate("hostel")
      .populate("willingness");

    return res.json({
      success: true,
      message: "Student allotments fetched",
      allotments,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error fetching student allotment",
    });
  }
};

// -------------------------------------------------------
// 5️⃣ GET ALLOTMENTS FOR A SPECIFIC HOSTEL
// -------------------------------------------------------
export const getHostelAllotments = async (req, res) => {
  try {
    const { hostelId } = req.params;

    const allotments = await RoomAllotment.find({ hostel: hostelId })
      .populate("student")
      .populate("room");

    return res.json({
      success: true,
      message: "Hostel allotments fetched",
      allotments,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error fetching hostel allotments",
    });
  }
};

export const getHostelAllotmentPolicy = async (req, res) => {
  try {
    const { allotmentPolicy } = req.body;

    if (!allotmentPolicy) {
      return res.status(400).json({
        success: false,
        message: "allotmentPolicy is required"
      });
    }

    // 🔹 Call Python service
    const result = await sendAllotment(allotmentPolicy);

    // 🔹 Return ONLY JSON
    return res.json({
      success: true,
      data: result
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
