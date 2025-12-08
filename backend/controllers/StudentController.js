import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Attendance from "../models/Attendance.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import bcrypt from "bcrypt";
import Student from "../models/student.js";
import Grade from "../models/Grade.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/emailService.js";

const JWT_SECRET = process.env.JWT_SECRET;
const createToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });

function calculateSGPA(courses) {
  let totalCredits = 0;
  let earnedCredits = 0;
  let totalPoints = 0;

  courses.forEach(c => {
    const credit = c.course.credits;
    const gradePoint = c.grade.gradePoints;

    totalCredits += credit;
    if (gradePoint > 0) earnedCredits += credit;
    totalPoints += (credit * gradePoint);
  });

  const sgpa = totalPoints / totalCredits;

  return {
    sgpa: parseFloat(sgpa.toFixed(2)),
    creditsOffered: totalCredits,
    creditsEarned
  };
}

// --------------------------------------
// REGISTER STUDENT
// --------------------------------------
const registerStudent = async (req, res) => {
  try {
    const {
      name, email, password, phone, age, fathersName,
      fatherPhone, collegeId, dob, batch, programme,
      department, address, currentSem, gender
    } = req.body;

    if (!name || !email || !password || !phone || !age || !fathersName ||
      !collegeId || !dob || !batch || !programme || !department ||
      !address || !currentSem || !gender) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
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
      fatherPhone,            // ADDED
      gender,                 // ADDED
      dob,
      batch,
      programme,
      department,
      address,
      currentSem,
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

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Student details are required in an array format"
      });
    }

    let inserted = [];
    let skipped = [];

    for (const student of students) {
      const {
        name, email, password, phone, age, fathersName,
        fatherPhone, collegeId, dob, batch, programme,
        department, address, currentSem, gender
      } = student;

      if (!name || !email || !password || !phone || !age ||
        !fathersName || !collegeId || !dob || !batch ||
        !programme || !department || !address || !currentSem || !gender) {
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
        fatherPhone,     // ADDED
        gender,          // ADDED
        dob,
        programme,
        batch,
        department,
        address,
        currentSem,
        gradeSheets: []
      });

      inserted.push({ studentId: newStudent._id, email });
    }

    return res.status(201).json({
      success: true,
      message: "Bulk student registration completed",
      inserted,
      skipped
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error while registering students"
    });
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
    return res.status(200).json({ success: true, token, studentId: student._id });

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
      .select("-password") // already returns gender + fatherPhone
      .populate({
        path: "gradeSheets.courses.grade",
        model: "Grade"
      })
      .populate({
        path: "gradeSheets.courses.enrollment",
        model: "Enrollment"
      });

    if (!student)
      return res.status(404).json({ success: false, message: "Student not found" });

    return res.json({ success: true, student });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------------------------
// GET ALL STUDENTS
// --------------------------------------
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select("name collegeId email currentSem department cgpa gender fatherPhone"); // UPDATED

    return res.json({ success: true, students });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------------------------
// FILTER
// --------------------------------------
const getStudentByFilter = async (req, res) => {
  try {
    const { name, department, batch, programme, currentSem, gender } = req.body;
    const filter = {};

    if (name) filter.name = { $regex: name, $options: "i" };
    if (department) filter.department = department;
    if (batch) filter.batch = batch;
    if (programme) filter.programme = programme;
    if (currentSem) filter.currentSem = currentSem;
    if (gender) filter.gender = gender; // ADDED

    const students = await Student.find(filter);

    if (!students.length)
      return res.status(404).json({ message: "No students found" });

    res.json({ success: true, students });

  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --------------------------------------
// STUDENT COURSES
// --------------------------------------
const getStudentCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.params.id })
      .populate({
        path: "offering",
        populate: { path: "course" }
      });

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
    const { id } = req.params;
    const enrollments = await Enrollment.find({ student: id });
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
