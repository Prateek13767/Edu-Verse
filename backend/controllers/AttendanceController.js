import mongoose from "mongoose";
import Attendance from "../models/Attendance.js";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import { sendEmail } from "../utils/emailService.js";
const markAttendance =async (req,res)=>{

    try {
        
        const {enrollmentId,date,status}=req.body;
        if (!enrollmentId || !date || !status){
            return res.json({success:false,message:"Fields are missing"});
        }

        const newRecord=await Attendance.create({
            enrollment:enrollmentId,
            status:status,
            date:date
        });

        const enrollment=await Enrollment.findById(enrollmentId).populate("student").populate("offering");
        
        const course=await Course.findById(enrollment.offering.course);
        const faculty=enrollment.faculty;
        const student=enrollment.student;
        const studentHtml = `
        <div style="font-family:Arial">
            <h2>Attendance Marked</h2>
            <p>Dear <strong>${student.name}</strong>,</p>
            <p>Your attendance has been marked for the course:</p>

            <p><strong>${course.name}</strong></p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Status:</strong> ${status}</p>

            <p>Regards,<br>University Administration</p>
        </div>`;

        // await sendEmail({
        //     to: student.email,
        //     subject: "Attendance Updated",
        //     html: studentHtml
        // });

        const facultyHtml = `
        <div style="font-family:Arial">
            <h2>Attendance Marked</h2>
            <p>The following student's attendance was marked:</p>

            <table border="1" cellpadding="6" style="border-collapse:collapse;">
                <tr><th>Name</th><td>${student.name}</td></tr>
                <tr><th>College ID</th><td>${student.collegeId}</td></tr>
                <tr><th>Date</th><td>${date}</td></tr>
                <tr><th>Status</th><td>${status}</td></tr>
            </table>
        </div>`;
        // await sendEmail({
        //     to: faculty.email,
        //     subject: "Attendance Data Submitted",
        //     html: facultyHtml
        // });

        return res.json({ success: true, message: "Attendance Marked & Emails Sent" });

    } catch (error) {
        console.log(error);
        return res.json({success:false,message:"Error"});
    }
}

const markAttendanceforAll = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid or missing data" });
    }

    // 1️⃣ Insert attendance records
    const attendanceRecords = await Attendance.insertMany(data);

    // 2️⃣ Fetch enrollments with student & offering info
    const enrollmentIds = data.map(d => d.enrollment);
    const enrollments = await Enrollment.find({ _id: { $in: enrollmentIds } })
      .populate("student")
      .populate({
        path: "offering",
        populate: { path: "course" }
      });

    // 3️⃣ Group attendance by student
    const studentEmails = {}; // { studentId: [{ courseName, date, status }] }

    for (let record of attendanceRecords) {
      const enrollment = enrollments.find(e => e._id.toString() === record.enrollment.toString());
      if (!enrollment || !enrollment.student) continue;

      const student = enrollment.student;
      const course = enrollment.offering.course;

      if (!student.email) continue; // skip if email not defined

      const sId = student._id.toString();
      if (!studentEmails[sId]) studentEmails[sId] = [];

      studentEmails[sId].push({
        courseName: course.name,
        date: record.date,
        status: record.status
      });
    }

    // 4️⃣ Send email to each student
    for (let studentId in studentEmails) {
      const student = enrollments.find(e => e.student._id.toString() === studentId).student;
      const rows = studentEmails[studentId].map(a => `
        <tr>
          <td style="border:1px solid #ddd;padding:8px">${a.courseName}</td>
          <td style="border:1px solid #ddd;padding:8px">${a.date}</td>
          <td style="border:1px solid #ddd;padding:8px">${a.status}</td>
        </tr>
      `).join("");

      const html = `
        <div style="font-family:Arial">
          <h2>Attendance Marked</h2>
          <p>Dear <strong>${student.name}</strong>,</p>
          <p>Your attendance has been recorded for the following classes:</p>

          <table style="border-collapse:collapse;width:100%">
            <tr>
              <th style="border:1px solid #ddd;padding:8px">Course</th>
              <th style="border:1px solid #ddd;padding:8px">Date</th>
              <th style="border:1px solid #ddd;padding:8px">Status</th>
            </tr>
            ${rows}
          </table>

          <p>Regards,<br>University Administration</p>
        </div>
      `;

      // Debug log before sending
      console.log("Sending attendance email to:", student.email);

      // Send email
      await sendEmail({
        to: student.email,
        subject: "Attendance Updated",
        html
      });
    }

    return res.json({ success: true, message: "Attendance marked and emails sent to students" });

  } catch (error) {
    console.error("Error in markAttendanceforAll:", error);
    return res.status(500).json({ success: false, message: "Error marking attendance" });
  }
};


const getAttendanceByOffering = async (req, res) => {
  try {
    const { offeringId } = req.params;  // offering ID from route
    const { date } = req.body;          // date from request body

    if (!offeringId) {
      return res.status(400).json({ success: false, message: "Offering ID is required" });
    }

    if (!date) {
      return res.status(400).json({ success: false, message: "Date is required" });
    }

    // Find enrollments for this offering
    const enrollments = await Enrollment.find({ offering: offeringId, status: "approved" })
      .populate("student")
      .populate("faculty");

    if (!enrollments || enrollments.length === 0) {
      return res.json({ success: true, attendance: [] });
    }

    // Get enrollment IDs
    const enrollmentIds = enrollments.map((e) => e._id);

    // Fetch attendance records for the given date
    const attendanceRecords = await Attendance.find({
      enrollment: { $in: enrollmentIds },
      date,
    });

    // Map attendance records to enrollment IDs for easier frontend access
    const attendanceData = attendanceRecords.map((record) => ({
      enrollment: record.enrollment.toString(),
      date: record.date,
      status: record.status,
    }));

    return res.json({ success: true, attendance: attendanceData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Error fetching attendance" });
  }
};

const getAttendanceByEnrollment =async (req,res)=>{

    try {
        
        const {enrollmentId}=req.body;
        if (!enrollmentId){
            return res.json({success:false,message:"ID not found"});
        }
        const attendanceData=await Attendance.find({enrollment:enrollmentId});
        if (!attendanceData){
            return res.json({success:false,message:"Attendance Data Not found"});
        }
        return res.json({success:true,attendanceData,message:"Details Fetched Successfully"});

    } catch (error) {
        console.log(error);
        return res.json({success:false,message:"Error"});
    }
}

const getAttendancePercentage = async (req, res) => {
  try {
    const { enrollmentId } = req.params; // ⬅️ use params for GET

    if (!enrollmentId) {
      return res.json({
        success: false,
        message: "Enrollment ID missing",
      });
    }

    // Fetch all attendance records for this enrollment
    const attendanceDetails = await Attendance.find({ enrollment: enrollmentId });

    if (!attendanceDetails || attendanceDetails.length === 0) {
      return res.json({
        success: true,
        percentage: 0,
        totalClasses: 0,
        presentCount: 0,
        message: "No attendance records found",
      });
    }

    // Count Present / Absent
    const totalClasses = attendanceDetails.length;
    const presentCount = attendanceDetails.filter(a => a.status === "present").length;

    // Calculate percentage
    const percentage = ((presentCount / totalClasses) * 100).toFixed(2);

    return res.json({
      success: true,
      percentage,
      totalClasses,
      presentCount,
    });

  } catch (error) {
    console.log("Error calculating attendance %:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


const updateAttendance=async (req,res)=>{

    try {
        const {enrollmentId,date,newStatus}=req.body;
        if (!enrollmentId || !date){
            return res.json({success:false,message:"Fields Missing"});
        }
        const newAttendanceDetails=await Attendance.findByIdAndUpdate({enrollment:enrollmentId,date:date},newStatus);
        if (!newAttendanceDetails){
            return res.json({success:false,message:"Attendance Not Updated Successfully"});
        }

        return res.json({success:true,newAttendanceDetails,message:"Attendance Updated Successfully"});

    } catch (error) {
        console.log(error);
        return res.json({success:false,message:"Error"});
    }
}

export {markAttendance,markAttendanceforAll,getAttendanceByEnrollment,updateAttendance,getAttendanceByOffering,getAttendancePercentage};