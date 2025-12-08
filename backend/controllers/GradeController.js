import Grade from "../models/Grade.js";
import Enrollment from "../models/Enrollment.js";
import Faculty from "../models/Faculty.js";
import CourseOffering from "../models/CourseOffering.js";
import { sendEmail } from "../utils/emailService.js";
import Course from "../models/Course.js";

// ⭐ Converts letter grades to grade points
const letterToPoints = (g) => {
  switch (g) {
    case "A+": return 10;
    case "A": return 9;
    case "B+": return 8;
    case "B": return 7;
    case "C": return 6;
    case "D": return 5;
    case "F": return 0;
    default: return 0;
  }
};

// ==================================================================
// Create grade for a student enrollment
// ==================================================================
export const createGrade = async (req, res) => {
  try {
    const { enrollmentId } = req.body;
    if (!enrollmentId) return res.status(400).json({ success: false, message: "Enrollment ID is required" });

    const existingGrade = await Grade.findOne({ enrollment: enrollmentId });
    if (existingGrade) return res.status(400).json({ success: false, message: "Grade already exists" });

    const newGrade = await Grade.create({ enrollment: enrollmentId });
    res.status(201).json({ success: true, message: "Grade created successfully", grade: newGrade });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==================================================================
// Upload marks for a single student
// ==================================================================
export const uploadMarks = async (req, res) => {
  try {
    const { enrollmentId, type, marks } = req.body;
    if (!enrollmentId || !type || marks === undefined)
      return res.status(400).json({ success: false, message: "Fields Missing" });

    const grade = await Grade.findOne({ enrollment: enrollmentId });
    if (!grade) return res.status(404).json({ success: false, message: "Grade record does not exist" });

    grade[type] = marks;
    grade.total =
      (grade.assignments || 0) +
      (grade.quiz || 0) +
      (grade.project || 0) +
      (grade.midsem || 0) +
      (grade.endsem || 0);

    await grade.save();
    return res.json({ success: true, message: "Marks updated", grade });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

// ==================================================================
// Upload marks in bulk
// ==================================================================
export const uploadMarksBulk = async (req, res) => {
  try {
    const { offeringId, type, data } = req.body;
    if (!offeringId || !type || !data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ success: false, message: "Fields missing or invalid" });
    }

    const updatedGrades = [];
    for (let item of data) {
      const grade = await Grade.findOne({ enrollment: item.enrollmentId });
      if (!grade) continue;

      grade[type] = item.marks;
      grade.total =
        (grade.assignments || 0) +
        (grade.quiz || 0) +
        (grade.project || 0) +
        (grade.midsem || 0) +
        (grade.endsem || 0);

      await grade.save();
      updatedGrades.push(grade);
    }

    return res.json({ success: true, message: "Bulk marks uploaded successfully", updatedGrades });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==================================================================
// ⭐ Assign relative grades — UPDATED LOGIC
// ==================================================================
export const assignGradesInBulk = async (req, res) => {
  try {
    const { offeringId } = req.body;
    if (!offeringId)
      return res.status(400).json({ success: false, message: "Offering ID is required" });

    const offering = await CourseOffering.findById(offeringId);
    const course = await Course.findById(offering.course);

    const enrollments = await Enrollment.find({ offering: offeringId }).select("_id student");
    const enrollmentIds = enrollments.map(e => e._id);

    const grades = await Grade.find({ enrollment: { $in: enrollmentIds } })
      .populate({ path: "enrollment", populate: { path: "student" } });

    // Sort by score descending
    const sorted = grades.sort((a, b) => (b.total || 0) - (a.total || 0));
    const n = sorted.length;

    // Percentage buckets
    const pAplus = Math.ceil(n * 0.08);
    const pA = Math.ceil(n * 0.12);
    const pBplus = Math.ceil(n * 0.15);
    const pC = Math.ceil(n * 0.12);
    const pD = Math.ceil(n * 0.08);

    for (let i = 0; i < n; i++) {
      const g = sorted[i];
      const score = g.total || 0;

      // Rule 1: Fail
      if (score < 35) {
        g.letterGrade = "F";
        g.gradePoints = 0;
      }
      // A+ only if score >= 85 and ranking in top 8%
      else if (score >= 85 && i < pAplus) {
        g.letterGrade = "A+";
        g.gradePoints = 10;
      }
      else if (i < pAplus + pA) {
        g.letterGrade = "A";
        g.gradePoints = 9;
      }
      else if (i < pAplus + pA + pBplus) {
        g.letterGrade = "B+";
        g.gradePoints = 8;
      }
      // B majority
      else if (i < pAplus + pA + pBplus + Math.ceil(n * 0.45)) {
        g.letterGrade = "B";
        g.gradePoints = 7;
      }
      else if (i < pAplus + pA + pBplus + Math.ceil(n * 0.45) + pC) {
        g.letterGrade = "C";
        g.gradePoints = 6;
      }
      else if (i < pAplus + pA + pBplus + Math.ceil(n * 0.45) + pC + pD) {
        g.letterGrade = "D";
        g.gradePoints = 5;
      }
      else {
        g.letterGrade = "B"; // fallback
        g.gradePoints = 7;
      }

      await g.save();

      const student = g.enrollment.student;
      // await sendEmail({
      //   to: student.email,
      //   subject: `Final Grade Assigned - Course ${course.code}`,
      //   html: `
      //     <div style="font-family:Arial">
      //       <h3>Your Final Grade</h3>
      //       <p>Hi <strong>${student.name}</strong>,</p>
      //       <p>Your final result for <strong>${course.code}</strong> has been published.</p>
      //       <p><strong>Total Marks:</strong> ${score}</p>
      //       <p><strong>Letter Grade:</strong> ${g.letterGrade}</p>
      //       <p><strong>Grade Points:</strong> ${g.gradePoints}</p>
      //     </div>
      //   `
      // });
    }

    return res.json({ success: true, message: "Grades assigned successfully", updatedGrades: grades });
  } catch (err) {
    console.error("Error in assignGradesInBulk:", err);
    return res.status(500).json({ success: false, message: "Error assigning grades" });
  }
};


// ==================================================================
// Utility functions: get/update grades
// ==================================================================
export const getGradesByEnrollment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const gradeDetails = await Grade.findOne({ enrollment: enrollmentId });
    if (!gradeDetails) return res.status(404).json({ success: false, message: "No grade record found" });
    return res.json({ success: true, gradeDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

export const getGradesByOffering = async (req, res) => {
  try {
    const { offeringId } = req.params;
    const enrollments = await Enrollment.find({ offering: offeringId }).select("_id student");
    const enrollmentIds = enrollments.map(e => e._id);
    const grades = await Grade.find({ enrollment: { $in: enrollmentIds } })
      .populate("enrollment")
      .populate("student");
    return res.json({ success: true, grades });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

export const updateGrade = async (req, res) => {
  try {
    const { gradeId, newAssignments, newMidSem, newEndSem, newQuiz, newProject } = req.body;
    const updated = await Grade.findByIdAndUpdate(
      gradeId,
      { assignments: newAssignments, midsem: newMidSem, endsem: newEndSem, quiz: newQuiz, project: newProject },
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: "Grade update failed" });

    updated.total =
      (updated.assignments || 0) +
      (updated.quiz || 0) +
      (updated.project || 0) +
      (updated.midsem || 0) +
      (updated.endsem || 0);

    await updated.save();
    return res.json({ success: true, updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};
