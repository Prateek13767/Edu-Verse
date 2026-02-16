import mongoose from "mongoose";
import Enrollment from "../models/Enrollment.js";
import CourseOffering from "../models/CourseOffering.js";
import Student from "../models/Student.js";
import Faculty from "../models/Faculty.js";
import { sendEmail } from "../utils/emailService.js";


/* ------------------------ ADD SINGLE ENROLLMENT ------------------------ */
const addEnrollment = async (req, res) => {
  try {
    const { student, offering, faculty, status, schedule } = req.body;

    if (!student || !offering) {
      return res.status(400).json({ success: false, message: "Student or offering missing" });
    }

    const offeringData = await CourseOffering.findById(offering)
      .populate("course instructors");
    if (!offeringData) return res.json({ success: false, message: "Invalid course offering" });

    if (faculty && !offeringData.instructors.map(id => id.toString()).includes(faculty)) {
      return res.json({ success: false, message: "Faculty not assigned to this offering" });
    }

    const studentData = await Student.findById(student).select("name email");
    if (!studentData) return res.json({ success: false, message: "Invalid student" });

    const facultyData = faculty ? await Faculty.findById(faculty).select("name") : null;

    const newEnrollment = await Enrollment.create({
      student,
      offering,
      faculty: faculty || null,
      status: status || "selected",
      schedule: Array.isArray(schedule) ? schedule : []
    });

    /* Email format update */
    const html = `
      <h2>Enrollment Confirmation</h2>
      <p>Dear <b>${studentData.name}</b>,</p>
      <p>You have been successfully enrolled in <b>${offeringData.course.name}</b>.</p>
      <p><b>Faculty:</b> ${facultyData ? facultyData.name : "To be assigned"}</p>
    `;

    await sendEmail({ to: studentData.email, subject: "Enrollment Successful", html });

    return res.json({ success: true, message: "Enrollment created successfully", newEnrollment });

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};


/* ------------------------ ADD BULK ENROLLMENTS ------------------------ */
const addBulkEnrollments = async (req, res) => {
  try {
    const { student, offerings, facultyAssignments } = req.body;

    if (!student || !offerings?.length) {
      return res.json({ success: false, message: "Student or offerings missing/invalid" });
    }

    const studentData = await Student.findById(student).select("name email");
    if (!studentData) return res.json({ success: false, message: "Student not found" });

    const createdEnrollments = [];
    const enrolledCourses = [];

    for (let id of offerings) {
      const offering = await CourseOffering.findById(id).populate("course instructors");
      if (!offering) continue;

      const assignedFaculty = facultyAssignments?.[id] || null;
      if (assignedFaculty && !offering.instructors.map(i => i.toString()).includes(assignedFaculty)) continue;

      const enrollment = await Enrollment.create({
        student,
        offering: id,
        faculty: assignedFaculty,
        status: "selected",
        schedule: [] // no schedule at enrollment time
      });

      let facultyName = "To be assigned";
      if (assignedFaculty) {
        const fac = await Faculty.findById(assignedFaculty).select("name");
        if (fac) facultyName = fac.name;
      }

      createdEnrollments.push(enrollment);
      enrolledCourses.push({
        name: offering.course.name,
        semester: offering.semester,
        year: offering.year,
        credits: offering.course.credits,
        faculty: facultyName,
        schedule: "To be assigned", // will update later when admin adds schedule
        status: "selected"
      });
    }

    if (!createdEnrollments.length)
      return res.json({ success: false, message: "No valid enrollments created" });

    // Table header + rows
    const rows = enrolledCourses
      .map(
        c => `
          <tr>
            <td>${c.name}</td>
            <td>${c.semester}</td>
            <td>${c.year}</td>
            <td>${c.credits}</td>
            <td>${c.faculty}</td>
            <td>${c.schedule}</td>
            <td>${c.status}</td>
          </tr>`
      )
      .join("");

    const html = `
      <h2 style="font-size:20px;">📌 Bulk Enrollment Confirmation</h2>
      <p>Dear <b>${studentData.name}</b>,</p>
      <p>You have been successfully enrolled in the following courses:</p>
      <table border="1" cellpadding="8" style="border-collapse:collapse; font-size:15px;">
        <thead style="background:#f2f2f2;">
          <tr>
            <th>Course</th>
            <th>Semester</th>
            <th>Year</th>
            <th>Credits</th>
            <th>Faculty Assigned</th>
            <th>Schedule</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <br/>
      <p style="font-size:14px;">
        ⏳ <i>Schedule will be assigned soon by the department.</i><br/>
        📌 <i>You will receive another email once timetable is finalized.</i>
      </p>
    `;

    // await sendEmail({
    //   to: studentData.email,
    //   subject: "Bulk Enrollment Successful",
    //   html
    // });

    return res.json({
      success: true,
      message: "Bulk enrollments created",
      createdEnrollments
    });

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};



/* ------------------------ GET ENROLLMENT BY ID ------------------------ */
const getEnrollmentById = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    const enrollmentDetails = await Enrollment.findById(enrollmentId)
      .populate("student", "name email collegeId")
      .populate({
        path: "offering",
        populate: { path: "course", select: "name code credits" }
      })
      .populate("faculty", "name email");

    if (!enrollmentDetails)
      return res.status(404).json({ success: false, message: "Enrollment not found" });

    return res.json({ success: true, enrollment: enrollmentDetails });

  } catch {
    return res.json({ success: false, message: "Error fetching enrollment details" });
  }
};


/* ------------------------ GET ENROLLMENTS OF A STUDENT ------------------------ */
const getStudentEnrollments = async (req, res) => {
  try {
    const { studentId } = req.params;

    const enrollments = await Enrollment.find({ student: studentId })
      .populate({
        path: "offering",
        populate: { path: "course", select: "name code credits semester year" }
      })
      .populate("faculty", "name email");

    return res.json({ success: true, enrollments });

  } catch {
    return res.json({ success: false, message: "Error" });
  }
};


/* ------------------------ CHANGE STATUS ------------------------ */
const changeEnrollmentStatus = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { newStatus } = req.body;

    const updated = await Enrollment.findByIdAndUpdate(
      enrollmentId,
      { status: newStatus },
      { new: true }
    );

    return res.json({ success: true, updated });

  } catch {
    return res.json({ success: false, message: "Error" });
  }
};


/* ------------------------ GET ENROLLMENTS BY OFFERING ------------------------ */
const getEnrollmentsByOffering = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      offering: req.params.offeringId,
      status: { $in: ["approved", "selected", "completed", "Attendance Failure", "Supplementary"] }
    })
      .populate("student", "name email collegeId batch department cgpa ")
      .populate("faculty", "name email");

    return res.json({ success: true, enrollments });

  } catch {
    return res.json({ success: false, message: "Error" });
  }
};


/* ------------------------ DROP COURSE ------------------------ */
const dropCourse = async (req, res) => {
  try {
    const studentId = req.id;
    const { courseOfferingId } = req.body;

    const dropped = await Enrollment.findOneAndUpdate(
      { student: studentId, offering: courseOfferingId },
      { status: "dropped" },
      { new: true }
    );

    return res.json({ success: true, dropped });

  } catch {
    return res.json({ success: false, message: "Error" });
  }
};


/* ------------------------ FILTER ENROLLMENTS ------------------------ */
const getEnrollmentsByFields = async (req, res) => {
  try {
    const filters = req.body;
    const result = await Enrollment.find(filters)
      .populate("student faculty")
      .populate({
        path: "offering",
        populate: { path: "course", select: "name code" }
      });

    return res.json({ success: true, enrollments: result });

  } catch {
    return res.json({ success: false, message: "Error" });
  }
};


/* ------------------------ GET ALL ENROLLMENTS ------------------------ */
const getAllEnrollments = async (req, res) => {
  try {
    const result = await Enrollment.find()
      .populate("student faculty")
      .populate({
        path: "offering",
        populate: { path: "course", select: "name code" }
      });

    return res.json({ success: true, enrollments: result });

  } catch {
    return res.json({ success: false, message: "Error" });
  }
};


/* ------------------------ DELETE ENROLLMENT ------------------------ */
const removeEnrollment = async (req, res) => {
  try {
    const deleted = await Enrollment.findByIdAndDelete(req.params.enrollmentId);
    if (!deleted) return res.json({ success: false, message: "Enrollment not found" });

    return res.json({ success: true, message: "Enrollment removed", deleted });

  } catch {
    return res.json({ success: false, message: "Error" });
  }
};


/* ---------------- ASSIGN FACULTY + SCHEDULE TO MULTIPLE ENROLLMENTS ---------------- */
const assignFacultyAndSchedule = async (req, res) => {
  try {
    const { enrollmentIds, facultyId, schedules } = req.body;

    if (!enrollmentIds?.length)
      return res.json({ success: false, message: "No enrollments selected" });

    if (!facultyId)
      return res.json({ success: false, message: "Faculty ID missing" });

    // ✅ schedules is OPTIONAL
    let finalSchedules = [];

    if (Array.isArray(schedules) && schedules.length > 0) {
      for (const s of schedules) {
        if (!s.day || !s.startTime || !s.endTime || !s.room)
          return res.json({
            success: false,
            message: "Schedules contain empty fields",
          });
      }
      finalSchedules = schedules;
    }

    const enrollments = await Enrollment.find({
      _id: { $in: enrollmentIds },
    })
      .populate({
        path: "offering",
        populate: { path: "instructors course" },
      })
      .populate("student", "name email");

    if (!enrollments.length)
      return res.json({ success: false, message: "Enrollments not found" });

    const offering = enrollments[0].offering;

    // 🔥 supports ObjectIds & populated instructors
    const instructorIds = offering.instructors.map((i) =>
      i?._id ? i._id.toString() : i.toString()
    );

    if (!instructorIds.includes(facultyId.toString()))
      return res.json({
        success: false,
        message: "Selected faculty does not belong to this offering",
      });

    // 🔥 Update records
    const updateResult = await Enrollment.updateMany(
      { _id: { $in: enrollmentIds } },
      {
        $set: {
          faculty: facultyId,
          schedule: finalSchedules, // ✅ may be empty
          status: "approved",
        },
      }
    );

    if (!updateResult.acknowledged)
      return res.json({ success: false, message: "Database update failed" });

    return res.json({
      success: true,
      message: finalSchedules.length
        ? "Faculty & schedule assigned successfully 🎉"
        : "Faculty assigned successfully 🎉",
    });
  } catch (err) {
    console.error("❌ Backend error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong in assignFacultyAndSchedule",
      error: err.message,
    });
  }
};




export {
  addEnrollment,
  addBulkEnrollments,
  getEnrollmentById,
  getStudentEnrollments,
  changeEnrollmentStatus,
  getEnrollmentsByOffering,
  dropCourse,
  getEnrollmentsByFields,
  getAllEnrollments,
  removeEnrollment,
  assignFacultyAndSchedule
};
