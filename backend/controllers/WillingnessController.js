import Willingness from "../models/Willingness.js";
import Student from "../models/Student.js";

// -------------------------------------------------------
// 1️⃣ SUBMIT WILLINGNESS
// -------------------------------------------------------
export const submitWillingness = async (req, res) => {
  try {
    const { studentId, year } = req.body;

    if (!studentId || !year) {
      return res.json({ success: false, message: "Missing fields" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.json({ success: false, message: "Invalid Student" });
    }

    // Create willingness (duplicate prevented by schema index)
    const willingness = await Willingness.create({
      student: studentId,
      year,
      status: "Submitted",
    });

    return res.json({
      success: true,
      message: "Willingness submitted successfully",
      willingness,
    });
  } catch (error) {
    console.log(error);

    // Duplicate error handling
    if (error.code === 11000) {
      return res.json({
        success: false,
        message: "Willingness already submitted for this year",
      });
    }

    return res.json({
      success: false,
      message: "Error submitting willingness",
      error,
    });
  }
};

// -------------------------------------------------------
// 2️⃣ GET ALL WILLINGNESS FORM ENTRIES
// -------------------------------------------------------
export const getAllWillingness = async (req, res) => {
  try {
    const all = await Willingness.find()
      .populate("student");

    return res.json({
      success: true,
      message: "Willingness forms fetched",
      count: all.length,
      willingnesses: all,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error fetching willingness" });
  }
};

// -------------------------------------------------------
// 3️⃣ GET WILLINGNESS OF A SPECIFIC STUDENT
// -------------------------------------------------------
export const getWillingnessByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const forms = await Willingness.find({ student: studentId })
      .populate("student");

    return res.json({
      success: true,
      message: "Student willingness fetched",
      data: forms,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error fetching student's willingness",
    });
  }
};

export const getWillingnessByFilter = async (req, res) => {
  try {
    const { year, status } = req.body;

    // ---------------- VALIDATION ----------------
    if (!year) {
      return res.status(400).json({
        success: false,
        message: "Year is required",
        willingness: []
      });
    }

    // ---------------- BUILD FILTER ----------------
    const filter = {
      year: Number(year)
    };

    if (status) {
      filter.status = status; // Submitted | Approved | Rejected
    }

    // ---------------- FETCH DATA ----------------
    const willingnesses = await Willingness.find(filter)
      .populate("student")
      .sort({ createdAt: 1 }); // FIFO processing

    // ---------------- RESPONSE ----------------
    return res.json({
      success: true,
      count: willingnesses.length,
      willingnesses
    });

  } catch (error) {
    console.error("Error fetching willingness:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching willingness",
      willingness: []
    });
  }
};

// -------------------------------------------------------
// 4️⃣ UPDATE WILLINGNESS STATUS (Approve / Reject)
// -------------------------------------------------------
export const updateWillingnessStatus = async (req, res) => {
  try {
    const { willingnessId } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.json({ success: false, message: "Invalid status" });
    }

    const updated = await Willingness.findByIdAndUpdate(
      willingnessId,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.json({ success: false, message: "Willingness entry not found" });
    }

    return res.json({
      success: true,
      message: "Status updated successfully",
      updated,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error updating willingness status",
    });
  }
};
