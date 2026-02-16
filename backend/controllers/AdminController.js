import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

import Student from "../models/Student.js";
import Enrollment from "../models/Enrollment.js";
import Grade from "../models/Grade.js";


const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password required",
            });
        }

        if (email !== ADMIN_EMAIL) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email",
            });
        }

        // Plain password compare (simple & works)
        if (password !== ADMIN_PASSWORD) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password",
            });
        }

        const token = jwt.sign(
            { role: "admin", email: ADMIN_EMAIL },
            ADMIN_JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            success: true,
            message: "Admin login successful",
            token,
            admin: {
                email: ADMIN_EMAIL,
                role: "admin",
            },
        });
    } catch (err) {
        console.error("Admin Login Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

/*
====================================================
GENERATE / UPDATE RESULTS FOR ALL STUDENTS
(ALL SEMESTERS)
====================================================
*/
export const generateResultsForAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    let processedStudents = 0;

    for (const student of students) {
      const enrollments = await Enrollment.find({
        student: student._id,
      }).populate({
        path: "offering",
        populate: { path: "course", select: "credits semester" },
      });

      if (!enrollments.length) continue;

      // 🔹 Group enrollments by semester
      const semesterMap = {};
      enrollments.forEach((enr) => {
        const sem = enr.offering?.semester;
        if (!sem) return;
        if (!semesterMap[sem]) semesterMap[sem] = [];
        semesterMap[sem].push(enr);
      });

      let totalWeightedPoints = 0;
      let totalCredits = 0;

      let currentSemesterProcessed = false;

      for (const semester of Object.keys(semesterMap)) {
        const semEnrollments = semesterMap[semester];

        let creditsOffered = 0;
        let creditsEarned = 0;
        let weightedPoints = 0;
        const courseEntries = [];

        for (const enr of semEnrollments) {
          const grade = await Grade.findOne({ enrollment: enr._id });
          if (!grade || grade.gradePoints === undefined) continue;

          const credits = enr.offering.course.credits;
          creditsOffered += credits;

          if (grade.gradePoints > 0) {
            creditsEarned += credits;
          }

          weightedPoints += grade.gradePoints * credits;
          courseEntries.push({
            enrollment: enr._id,
            grade: grade._id,
          });
        }

        if (!courseEntries.length) continue;

        const sgpa =
          creditsOffered > 0
            ? Number((weightedPoints / creditsOffered).toFixed(2))
            : 0;

        // 🔹 Update totals for CGPA
        totalWeightedPoints += weightedPoints;
        totalCredits += creditsOffered;

        // 🔹 Check existing gradesheet
        const gsIndex = student.gradeSheets.findIndex(
          (gs) => gs.semester === Number(semester)
        );

        if (gsIndex !== -1) {
          // UPDATE
          student.gradeSheets[gsIndex].sgpa = sgpa;
          student.gradeSheets[gsIndex].creditsOffered = creditsOffered;
          student.gradeSheets[gsIndex].creditsEarned = creditsEarned;
          student.gradeSheets[gsIndex].courses = courseEntries;
          student.gradeSheets[gsIndex].generatedAt = new Date();
        } else {
          // CREATE
          student.gradeSheets.push({
            semester: Number(semester),
            sgpa,
            cgpa: 0, // temp
            creditsOffered,
            creditsEarned,
            courses: courseEntries,
          });
        }

        // 🔥 Mark current semester processed
        if (Number(semester) === student.currentSem) {
          currentSemesterProcessed = true;
        }
      }

      // 🔹 Update CGPA
      if (totalCredits > 0) {
        student.cgpa = Number(
          (totalWeightedPoints / totalCredits).toFixed(2)
        );
      }

      // 🔹 Sync CGPA in all gradeSheets
      student.gradeSheets.forEach((gs) => {
        gs.cgpa = student.cgpa;
      });

      // 🔥 PROMOTE SEMESTER (ONLY ONCE)
      if (currentSemesterProcessed) {
        student.currentSem += 1;
      }

      await student.save();
      processedStudents++;
    }

    return res.json({
      success: true,
      message: "Results generated & students promoted successfully",
      processedStudents,
    });
  } catch (error) {
    console.error("generateResultsForAllStudents error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate results",
    });
  }
};
