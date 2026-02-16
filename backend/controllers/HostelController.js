import Hostel from "../models/Hostel.js";
import Room from "../models/Room.js";
import Warden from "../models/Warden.js";

export const addHostel = async (req, res) => {
  try {
    const { name, code, type, totalRooms, totalCapacity, caretaker, warden } = req.body;

    // Required fields
    if (!name || !code || !type || totalRooms == null || totalCapacity == null) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Check duplicates
    const exists = await Hostel.findOne({ $or: [{ name }, { code }] });
    if (exists) {
      return res.json({
        success: false,
        message: "Hostel with same name or code already exists",
      });
    }

    // Create hostel with admin-entered stats
    const newHostel = await Hostel.create({
      name,
      code,
      type,
      totalRooms,
      totalCapacity,
      totalOccupied: 0,   // Always zero when created
      caretaker: caretaker || "",
      warden: warden || null
    });

    return res.json({
      success: true,
      message: "Hostel created successfully",
      hostelId: newHostel._id,
    });

  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error occurred",
      error,
    });
  }
};



// 🔹 Get All Hostels
export const getAllHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find();

    // For each hostel, fetch its warden + faculty
    const hostelsWithWarden = await Promise.all(
      hostels.map(async (hostel) => {
        const warden = await Warden.findOne({ hostel: hostel._id })
          .populate("faculty"); // populate faculty inside warden

        return {
          ...hostel._doc,
          warden: warden || null, // attach warden to hostel
        };
      })
    );

    return res.json({
      success: true,
      message: "Hostels fetched successfully",
      count: hostels.length,
      hostels: hostelsWithWarden,
    });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error occurred", error });
  }
};



// 🔹 Get Hostel by ID with Rooms
export const getHostelById = async (req, res) => {
  try {
    const { hostelId } = req.params;

    if (!hostelId) {
      return res.json({ success: false, message: "Hostel ID missing" });
    }

    const hostelDetails = await Hostel.findById(hostelId);

    if (!hostelDetails) {
      return res.json({ success: false, message: "Hostel not found" });
    }

    // attach rooms inside hostel
    const rooms = await Room.find({ hostel: hostelId });

    return res.json({
      success: true,
      message: "Hostel details fetched successfully",
      hostel: hostelDetails,
      rooms
    });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error occurred", error });
  }
};



// 🔹 Edit / Update Hostel Data
export const updateHostel = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const updatedData = req.body;

    const updatedHostel = await Hostel.findByIdAndUpdate(
      hostelId,
      updatedData,
      { new: true }
    );

    if (!updatedHostel) {
      return res.json({ success: false, message: "Hostel not found" });
    }

    return res.json({
      success: true,
      message: "Hostel updated successfully",
      hostel: updatedHostel
    });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error updating hostel", error });
  }
};



// 🔹 Disable / Close Hostel (Soft Delete)
export const deleteHostel = async (req, res) => {
  try {
    const { hostelId } = req.params;

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.json({ success: false, message: "Hostel not found" });
    }

    hostel.status = "closed";
    await hostel.save();

    return res.json({
      success: true,
      message: "Hostel closed successfully"
    });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error closing hostel", error });
  }
};
