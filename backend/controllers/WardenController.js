import Warden from "../models/Warden.js";
import Faculty from "../models/Faculty.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// 🔹 Login Warden (Faculty-based login)
export const loginWarden = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 1️⃣ Find faculty
    const faculty = await Faculty.findOne({ email });

    if (!faculty) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 2️⃣ Verify password
    const isMatch = await bcrypt.compare(password, faculty.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 3️⃣ Check if faculty is a warden
    const warden = await Warden.findOne({ faculty: faculty._id })
      .populate("hostel")
      .populate("faculty");

    if (!warden) {
      return res.json({
        success: false,
        message: "You are not assigned as a warden",
      });
    }

    // 4️⃣ Generate token
    const token = jwt.sign(
      {
        id: faculty._id,
        role: "warden",
        wardenId: warden._id,
        hostelId: warden.hostel._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Warden login successful",
      token,
      warden,
    });

  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Login failed",
      error,
    });
  }
};


// 🔹 Add Hostel Warden
export const addWarden = async (req, res) => {
  try {
    const { hostel, faculty } = req.body;

    if (!hostel || !faculty) {
      return res.json({ success: false, message: "Fields Missing" });
    }

    // Prevent assigning same faculty to same hostel again
    const alreadyAssigned = await Warden.findOne({ faculty, hostel });

    if (alreadyAssigned) {
      return res.json({
        success: false,
        message: "This faculty is already assigned as warden for this hostel",
      });
    }

    // Ensure hostel has only one warden
    const hostelHasWarden = await Warden.findOne({ hostel });

    if (hostelHasWarden) {
      return res.json({
        success: false,
        message: "This hostel already has a warden",
      });
    }

    // Create new warden
    const newWarden = await Warden.create({ faculty, hostel });

    return res.json({
      success: true,
      message: "Hostel warden assigned successfully",
      warden: newWarden,
    });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error adding warden", error });
  }
};

// 🔹 Get all wardens
export const getAllWardens = async (req, res) => {
  try {
    const wardens = await Warden.find()
      .populate("faculty")
      .populate("hostel");

    return res.json({
      success: true,
      message: "Wardens fetched successfully",
      count: wardens.length,
      wardens,
    });

  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error fetching wardens",
      error,
    });
  }
};

// 🔹 Get Warden by ID
export const getWardenById = async (req, res) => {
  try {
    const { wardenId } = req.params;

    if (!wardenId) {
      return res.json({ success: false, message: "Fields Missing" });
    }

    const wardenDetails = await Warden.findById(wardenId)
      .populate("faculty")
      .populate("hostel");

    if (!wardenDetails) {
      return res.json({ success: false, message: "Warden not found" });
    }

    return res.json({
      success: true,
      message: "Details fetched successfully",
      wardenDetails,
    });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error", error });
  }
};

// 🔹 Get Warden by Hostel
export const getWardenByHostel = async (req, res) => {
  try {
    const { hostelId } = req.params;

    const warden = await Warden.findOne({ hostel: hostelId })
      .populate("faculty")
      .populate("hostel");

    return res.json({
      success: true,
      message: "Hostel warden fetched",
      warden,
    });

  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error fetching warden",
      error,
    });
  }
};

// 🔹 Update Warden
export const updateWarden = async (req, res) => {
  try {
    const { wardenId } = req.params;
    const updatedData = req.body;

    const warden = await Warden.findByIdAndUpdate(
      wardenId,
      updatedData,
      { new: true }
    ).populate("faculty hostel");

    if (!warden) {
      return res.json({ success: false, message: "Warden not found" });
    }

    return res.json({
      success: true,
      message: "Warden updated successfully",
      warden,
    });

  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error updating warden",
      error,
    });
  }
};
