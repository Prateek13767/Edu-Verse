import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Attendance from "../models/Attendance.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import bcrypt from "bcrypt";
import Student from "../models/Student.js";
import Grade from "../models/Grade.js";
import jwt from "jsonwebtoken";
import PDFDocument from "pdfkit";

const JWT_SECRET = process.env.JWT_SECRET;
const createToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });

// --------------------------------------
// REGISTER STUDENT
// --------------------------------------
const registerStudent = async (req, res) => {
  try {
    const {
      name, email, password, phone, age, fathersName,
      fatherPhone, collegeId, dob, batch, programme,
      department, currentSem, gender, city, state
    } = req.body;

    // Required validation
    if (!name || !email || !password || !phone || !age || !fathersName || !collegeId || !dob ||
      !batch || !programme || !department || !currentSem || !gender  ||
      !city || !state) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const existing = await Student.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = await Student.create({
      name,
      collegeId,
      email,
      password: hashedPassword,
      phone,
      age,
      fathersName,
      fatherPhone,
      gender,
      dob,
      batch,
      programme,
      department,
      currentSem,
      city,
      state,
      gradeSheets: []
    });

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      studentId: newStudent._id,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------------------------
// BULK REGISTER
// --------------------------------------
const registerMany = async (req, res) => {
  try {
    const { students } = req.body;

    if (!students || !Array.isArray(students) || students.length === 0)
      return res.status(400).json({ success: false, message: "Students array required" });

    let inserted = [], skipped = [];

    for (const s of students) {
      const {
        name, email, password, phone, age, fathersName,
        fatherPhone, collegeId, dob, batch, programme,
        department, currentSem, gender, city, state
      } = s;

      if (!name || !email || !password || !phone || !age || !fathersName || !collegeId ||
        !dob || !batch || !programme || !department || !currentSem || !gender || !city || !state) {
        skipped.push({ email, reason: "Required fields missing" });
        continue;
      }

      const existing = await Student.findOne({ email });
      if (existing) {
        skipped.push({ email, reason: "Email already registered" });
        continue;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newStudent = await Student.create({
        name,
        collegeId,
        email,
        password: hashedPassword,
        phone,
        age,
        fathersName,
        fatherPhone,
        gender,
        dob,
        batch,
        programme,
        department,
        currentSem,
        city,
        state,
        gradeSheets: []
      });

      inserted.push({ studentId: newStudent._id, email });
    }

    return res.status(201).json({
      success: true,
      message: "Bulk registration complete",
      inserted,
      skipped
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------------------------
// LOGIN
// --------------------------------------
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email or password missing" });

    const student = await Student.findOne({ email });
    if (!student)
      return res.status(404).json({ success: false, message: "Student not found" });

    const match = await bcrypt.compare(password, student.password);
    if (!match)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = createToken(student._id);

    return res.status(200).json({
      success: true,
      token,
      studentId: student._id
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------------------------
// GET BY ID
// --------------------------------------
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .select("-password")
      .populate({
        path: "gradeSheets.courses.grade",
        model: "Grade"
      }).populate({
          path: "gradeSheets.courses.enrollment",
          populate: {
            path: "offering",
            populate: {
              path: "course"
            }
          }
        })


    if (!student)
      return res.status(404).json({ success: false, message: "Student not found" });

    res.json({ success: true, student });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------------------------
// GET ALL STUDENTS
// --------------------------------------
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();

    res.json({ success: true, students });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------------------------
// FILTER
// --------------------------------------
const getStudentByFilter = async (req, res) => {
  try {
    const { name, department, batch, programme, currentSem, gender, residentialStatus, city, state } = req.body;
    const filter = {};

    if (name) filter.name = { $regex: name, $options: "i" };
    if (department) filter.department = department;
    if (batch) filter.batch = batch;
    if (programme) filter.programme = programme;
    if (currentSem) filter.currentSem = currentSem;
    if (gender) filter.gender = gender;
    if (residentialStatus) filter.residentialStatus = residentialStatus;
    if (city) filter.city = city;
    if (state) filter.state = state;

    const students = await Student.find(filter);
    if (!students.length)
      return res.status(404).json({ success: false, message: "No matching students" });

    res.json({ success: true, students });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------------------------
// STUDENT COURSES
// --------------------------------------
const getStudentCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.params.id })
      .populate({ path: "offering", populate: { path: "course" } });

    return res.json({ success: true, enrollments });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------------------------
// ATTENDANCE
// --------------------------------------
const getStudentAttendance = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.params.id });
    const enrollmentIds = enrollments.map(e => e._id);
    const attendance = await Attendance.find({ enrollment: { $in: enrollmentIds } });

    return res.json({ success: true, attendance });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------------------------
// GET CGPA
// --------------------------------------
const getStudentCGPA = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("cgpa");
    if (!student)
      return res.status(404).json({ success: false, message: "Student not found" });

    return res.json({ success: true, cgpa: student.cgpa });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const downloadGradeSheet = async (req, res) => {
  try {
    const { studentId, semester } = req.params;

    const student = await Student.findById(studentId)
      .populate({
        path: "gradeSheets.courses.grade",
      })
      .populate({
        path: "gradeSheets.courses.enrollment",
        populate: {
          path: "offering",
          populate: { path: "course" },
        },
      });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const sheet = student.gradeSheets.find(
      (g) => g.semester === Number(semester)
    );

    if (!sheet) {
      return res.status(404).json({
        success: false,
        message: "Grade sheet not found",
      });
    }

    // ================= PDF SETUP =================
    const doc = new PDFDocument({ size: "A4", margin: 40 });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Semester_${semester}_GradeSheet_${student.collegeId}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // ================= TITLE =================
    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .text(`Semester ${semester} Grade Sheet`, 40, 40);

    doc.moveDown(1.5);

    // ================= STUDENT INFO =================
    doc.fontSize(11).font("Helvetica");

    doc.text(`Name: ${student.name}`);
    doc.text(`Roll No: ${student.collegeId}`);
    doc.text(`Branch: ${student.department}`);
    doc.text(`CGPA: ${student.cgpa}`);

    doc.moveDown(1.5);

    // ================= TABLE HEADER =================
    const tableStartY = doc.y;
    const tableLeftX = 40;
    const tableRightX = 555;
    const rowHeight = 28;

    // Purple header background
    doc
      .rect(tableLeftX, tableStartY, tableRightX - tableLeftX, rowHeight)
      .fill("#4F46E5"); // Indigo / Purple

    doc
      .fillColor("white")
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Course", tableLeftX + 10, tableStartY + 8, {
        width: 420,
        align: "center",
      })
      .text("Grade", tableRightX - 90, tableStartY + 8, {
        width: 60,
        align: "center",
      });

    let y = tableStartY + rowHeight;

    // ================= TABLE ROWS =================
    doc.font("Helvetica").fontSize(11);

    sheet.courses.forEach((c, idx) => {
      const courseName =
        c.enrollment?.offering?.course?.name || "N/A";
      const grade = c.grade?.letterGrade || "-";

      // Border
      doc
        .rect(tableLeftX, y, tableRightX - tableLeftX, rowHeight)
        .stroke();

      // Vertical divider
      doc
        .moveTo(tableRightX - 110, y)
        .lineTo(tableRightX - 110, y + rowHeight)
        .stroke();

      // Text
      doc
        .fillColor("black")
        .font("Helvetica")
        .text(courseName, tableLeftX + 10, y + 8, {
          width: 420,
          align: "center",
        });

      doc
        .font("Helvetica-Bold")
        .text(grade, tableRightX - 90, y + 8, {
          width: 60,
          align: "center",
        });

      y += rowHeight;

      // New page if needed
      if (y > 760) {
        doc.addPage();
        y = 50;
      }
    });

    doc.moveDown(2);

    // ================= FOOTER SUMMARY =================
   doc.moveDown(1.5);

doc
  .font("Helvetica-Bold")
  .fontSize(11)
  .fillColor("black")
  .text(`Credits Offered: ${sheet.creditsOffered}`, 40);

doc
  .font("Helvetica")
  .text(`Credits Earned: ${sheet.creditsEarned}`, 40);

doc.text(`SGPA: ${sheet.sgpa}`, 40);

doc.moveDown(1);

doc
  .fontSize(9)
  .fillColor("gray")
  .text(
    `Generated on: ${new Date(sheet.generatedAt).toLocaleDateString()} • ERP System`,
    40
  );

doc.end();

  } catch (error) {
    console.error("Download grade sheet error:", error);
    res.status(500).json({ success: false, message: "Failed to generate PDF" });
  }
};



export {
  registerStudent,
  registerMany,
  loginStudent,
  getStudentById,
  getAllStudents,
  getStudentCourses,
  getStudentAttendance,
  getStudentCGPA,
  getStudentByFilter,
};
