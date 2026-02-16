import Complaint from "../models/Complaint.js";
import Student from "../models/Student.js";
import Hostel from "../models/Hostel.js";
import Room from "../models/Room.js";
import { sendEmail } from "../utils/emailService.js";
import dotenv from "dotenv";
dotenv.config();


/* =========================================================
   ADD COMPLAINT
========================================================= */
export const addComplaint = async (req, res) => {
  try {
    const { student, hostel, room, type, description } = req.body;

    // 🔴 Validation
    if (!student || !hostel || !room || !type || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // 🔴 Check student exists
    const studentDetails = await Student.findById(student);
    if (!studentDetails) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // ✅ Create complaint
    const newComplaint = await Complaint.create({
      student,
      hostel,
      room,
      type,
      description
    });

    // 🔹 Fetch hostel & room details (for email readability)
    const hostelDetails = await Hostel.findById(hostel);
    const roomDetails = await Room.findById(room);

    // 📅 Format date & time from timestamps
    const createdAt = newComplaint.createdAt;

    const formattedDate = createdAt.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });

    const formattedTime = createdAt.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    // 📧 Email HTML
    const emailHTML = `
      <p>Hello <b>${studentDetails.name}</b>,</p>

      <p>Your complaint has been registered successfully with the following details:</p>

      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
        <tr>
          <th>Complaint ID</th>
          <th>Date</th>
          <th>Time</th>
          <th>Hostel</th>
          <th>Room</th>
          <th>Type</th>
          <th>Description</th>
          <th>Status</th>
        </tr>
        <tr>
          <td>${newComplaint._id}</td>
          <td>${formattedDate}</td>
          <td>${formattedTime}</td>
          <td>${hostelDetails?.name || "N/A"}</td>
          <td>${roomDetails?.formattedRoom || "N/A"}</td>
          <td>${newComplaint.type}</td>
          <td>${newComplaint.description}</td>
          <td>${newComplaint.status}</td>
        </tr>
      </table>

      <p>We will notify you once the complaint is resolved.</p>

      <p>Regards,<br/>Hostel Administration</p>
    `;

    // 📤 Send email
    await sendEmail({
      to: studentDetails.email,
      subject: "Hostel Complaint Registered",
      html: emailHTML
    });

    return res.status(201).json({
      success: true,
      message: "Complaint registered successfully",
      complaint: newComplaint
    });

  } catch (error) {
    console.error("Add Complaint Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/* =========================================================
   GET ALL COMPLAINTS
========================================================= */
export const getAllComplaints = async (req, res) => {
  try {
    const complaintDetails = await Complaint.find()
      .populate("student", "name collegeId")
      .populate("hostel", "name")
      .populate("room", "formattedRoom");

    return res.json({
      success: true,
      message: "Details fetched successfully",
      complaintDetails
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

/* =========================================================
   GET COMPLAINT BY ID
========================================================= */
export const getComplaintById = async (req, res) => {
  try {
    const { complaint } = req.params;

    const complaintDetails = await Complaint.findById(complaint)
      .populate("student", "name collegeId")
      .populate("hostel", "name")
      .populate("room", "formattedRoom");

    if (!complaintDetails) {
      return res.json({
        success: false,
        message: "Complaint does not exist"
      });
    }

    return res.json({
      success: true,
      message: "Details fetched successfully",
      complaintDetails
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

/* =========================================================
   GET COMPLAINT BY FILTER
========================================================= */
export const getComplaintByFilter = async (req, res) => {
  try {
    const { student, hostel, room, type, date, year } = req.body;

    let filter = {};

    if (student) filter.student = student;
    if (hostel) filter.hostel = hostel;
    if (room) filter.room = room;
    if (type) filter.type = type;

    // 📅 Filter by specific date
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: start, $lte: end };
    }

    // 📆 Filter by year
    if (year) {
      const startYear = new Date(`${year}-01-01`);
      const endYear = new Date(`${year}-12-31`);
      filter.createdAt = { $gte: startYear, $lte: endYear };
    }

    const complaintDetails = await Complaint.find(filter)
      .populate("student", "name email")
      .populate("hostel", "name")
      .populate("room", "formattedRoom");

    return res.json({
      success: true,
      message: "Filtered complaints fetched successfully",
      complaintDetails
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

/* =========================================================
   UPDATE COMPLAINT STATUS
========================================================= */
export const updateStatus = async (req, res) => {
  try {
    const { complaint, status, remarks } = req.body;

    if (!complaint || !status || !remarks) {
      return res.json({
        success: false,
        message: "Fields missing",
      });
    }

    const complaintDetails = await Complaint.findByIdAndUpdate(
      complaint,
      { status, remarks },
      { new: true }
    )
      .populate({
        path: "student",
        select: "name collegeId",
      })
      .populate({
        path: "hostel",
        select: "name",
      })
      .populate({
        path: "room",
        select: "formattedRoom block floor",
      });

    if (!complaintDetails) {
      return res.json({
        success: false,
        message: "Complaint not found",
      });
    }

    return res.json({
      success: true,
      message: "Status updated successfully",
      complaintDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error updating complaint status",
    });
  }
};

/* =========================================================
   DELETE COMPLAINT
========================================================= */
export const deleteComplaint = async (req, res) => {
  try {
    const { complaint } = req.body;

    if (!complaint) {
      return res.json({
        success: false,
        message: "Complaint missing"
      });
    }

    const complaintDetails = await Complaint.findByIdAndDelete(complaint);

    if (!complaintDetails) {
      return res.json({
        success: false,
        message: "Complaint not found"
      });
    }

    return res.json({
      success: true,
      message: "Complaint deleted successfully"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};
