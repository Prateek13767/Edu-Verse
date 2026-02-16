import Grade from "../models/Grade.js";
import Enrollment from "../models/Enrollment.js";
import Faculty from "../models/Faculty.js";
import CourseOffering from "../models/CourseOffering.js";
import Course from "../models/Course.js";
// import { sendEmail } from "../utils/emailService.js";

/*
====================================================
LETTER GRADE → GRADE POINTS (AA SYSTEM)
====================================================
*/
const letterToPoints = (g) => {
  switch (g) {
    case "AA": return 10;
    case "AB": return 9;
    case "BB": return 8;
    case "BC": return 7;
    case "CC": return 6;
    case "CD": return 5;
    case "DD": return 4;
    case "F": return 0;
    default: return 0;
  }
};

const gradeRank = {
  AA: 7,
  AB: 6,
  BB: 5,
  BC: 4,
  CC: 3,
  CD: 2,
  DD: 1,
  F: 0,
};

const absoluteGradeFloor = (total) => {
  if (total >= 80) return "AA";
  if (total >= 70) return "AB";
  if (total >= 60) return "BC";
  if (total >= 50) return "CC";
  if (total >= 45) return "CD";
  if (total >= 35) return "DD";
  return "F";
};


/*
====================================================
CREATE GRADE (ONE PER ENROLLMENT)
====================================================
*/
export const createGrade = async (req, res) => {
  try {
    const { enrollmentId } = req.body;

    if (!enrollmentId)
      return res.status(400).json({ success: false, message: "Enrollment ID is required" });

    const existingGrade = await Grade.findOne({ enrollment: enrollmentId });
    if (existingGrade)
      return res.status(400).json({ success: false, message: "Grade already exists" });

    const grade = await Grade.create({ enrollment: enrollmentId });
    return res.status(201).json({ success: true, grade });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/*
====================================================
UPLOAD MARKS (SINGLE STUDENT)
====================================================
*/
export const uploadMarks = async (req, res) => {
  try {
    const { enrollmentId, type, marks } = req.body;

    if (!enrollmentId || !type || marks === undefined)
      return res.status(400).json({ success: false, message: "Fields missing" });

    const grade = await Grade.findOne({ enrollment: enrollmentId });
    if (!grade)
      return res.status(404).json({ success: false, message: "Grade record not found" });

    grade[type] = marks;

    grade.total =
      (grade.assignments || 0) +
      (grade.quiz || 0) +
      (grade.project || 0) +
      (grade.midsem || 0) +
      (grade.endsem || 0);

    await grade.save();
    return res.json({ success: true, grade });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error updating marks" });
  }
};

/*
====================================================
UPLOAD MARKS (BULK)
====================================================
*/
export const uploadMarksBulk = async (req, res) => {
  try {
    const { offeringId, type, data } = req.body;

    if (!offeringId || !type || !Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload",
      });
    }

    let updatedCount = 0;

    for (const item of data) {
      if (!item.enrollmentId) continue;

      // 🔥 CREATE IF NOT EXISTS + UPDATE IF EXISTS
      const grade = await Grade.findOneAndUpdate(
        { enrollment: item.enrollmentId },
        { $set: { [type]: item.marks } },
        {
          new: true,
          upsert: true, // ✅ creates grade if missing
          setDefaultsOnInsert: true,
        }
      );

      // 🔢 Recalculate total
      grade.total =
        (grade.assignments || 0) +
        (grade.quiz || 0) +
        (grade.project || 0) +
        (grade.midsem || 0) +
        (grade.endsem || 0);

      await grade.save();
      updatedCount++;
    }

    return res.json({
      success: true,
      message: "Bulk marks uploaded successfully",
      updatedCount,
    });
  } catch (error) {
    // 🔒 Handle duplicate key race condition safely
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate grade detected (race condition)",
      });
    }

    console.error("uploadMarksBulk error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/*
====================================================
ASSIGN FINAL GRADES (AA / AB SYSTEM)
RULES:
- TOTAL < 35 → F
- AA → TOTAL ≥ 80 AND top 10%
- Relative grading among PASSED students
====================================================
*/
export const assignGradesInBulk = async (req, res) => {
  try {
    const { offeringId } = req.body;

    if (!offeringId)
      return res.status(400).json({ success: false, message: "Offering ID required" });

    const offering = await CourseOffering.findById(offeringId);
    if (!offering)
      return res.status(404).json({ success: false, message: "Offering not found" });

    const course = await Course.findById(offering.course);
    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });

    const enrollments = await Enrollment.find({ offering: offeringId }).select("_id student");
    const enrollmentIds = enrollments.map(e => e._id);

    const grades = await Grade.find({ enrollment: { $in: enrollmentIds } })
      .populate({ path: "enrollment", populate: { path: "student" } });

    // Sort by total (descending)
    grades.sort((a, b) => (b.total || 0) - (a.total || 0));

    const passed = grades.filter(g => (g.total || 0) >= 35);
    const failed = grades.filter(g => (g.total || 0) < 35);

    const n = passed.length;

    const aaCut = Math.ceil(n * 0.10);
    const abCut = aaCut + Math.ceil(n * 0.20);
    const bbCut = abCut + Math.ceil(n * 0.20);
    const bcCut = bbCut + Math.ceil(n * 0.30);
    const ccCut = bcCut + Math.ceil(n*0.08);
    const cdCut =ccCut +  Math.ceil(n*0.04);
    // Remaining → CC

    passed.forEach((g, i) => {
      if (i < aaCut && g.total >= 80) g.letterGrade = "AA";
      else if (i < abCut  ) g.letterGrade = "AB";
      else if (i < bbCut || g.total >=65 ) g.letterGrade = "BB";
      else if (i < bcCut || g.total>= 55) g.letterGrade = "BC";
      else if (i < ccCut || g.total>=45 ) g.letterGrade = "CC";
      else if (i < cdCut || g.total>=40) g.letterGrade="CD";
      else g.letterGrade="DD";

      g.gradePoints = letterToPoints(g.letterGrade);
    });

    failed.forEach(g => {
      g.letterGrade = "F";
      g.gradePoints = 0;
    });

    await Promise.all(grades.map(g => g.save()));

    return res.json({
      success: true,
      message: "Grades assigned successfully (AA system)",
      summary: {
        totalStudents: grades.length,
        passed: passed.length,
        failed: failed.length,
        AA: passed.filter(g => g.letterGrade === "AA").length
      }
    });

  } catch (error) {
    console.error("assignGradesInBulk error:", error);
    return res.status(500).json({ success: false, message: "Grade assignment failed" });
  }
};

/*
====================================================
GET GRADE BY ENROLLMENT
====================================================
*/
export const getGradesByEnrollment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    const gradeDetails = await Grade.findOne({ enrollment: enrollmentId });
    if (!gradeDetails)
      return res.status(404).json({ success: false, message: "No grade record found" });

    return res.json({ success: true, gradeDetails });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

/*
====================================================
GET GRADES BY OFFERING
====================================================
*/
export const getGradesByOffering = async (req, res) => {
  try {
    const { offeringId } = req.params;

    const enrollments = await Enrollment.find({ offering: offeringId }).select("_id");
    const enrollmentIds = enrollments.map(e => e._id);

    const grades = await Grade.find({ enrollment: { $in: enrollmentIds } })
      .populate({ path: "enrollment", populate: { path: "student" } });

    return res.json({ success: true, grades });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

/*
====================================================
UPDATE GRADE (MANUAL EDIT)
====================================================
*/
export const updateGrade = async (req, res) => {
  try {
    const {
      gradeId,
      newAssignments,
      newQuiz,
      newProject,
      newMidSem,
      newEndSem
    } = req.body;

    const grade = await Grade.findById(gradeId);
    if (!grade)
      return res.status(404).json({ success: false, message: "Grade not found" });

    if (newAssignments !== undefined) grade.assignments = newAssignments;
    if (newQuiz !== undefined) grade.quiz = newQuiz;
    if (newProject !== undefined) grade.project = newProject;
    if (newMidSem !== undefined) grade.midsem = newMidSem;
    if (newEndSem !== undefined) grade.endsem = newEndSem;

    grade.total =
      (grade.assignments || 0) +
      (grade.quiz || 0) +
      (grade.project || 0) +
      (grade.midsem || 0) +
      (grade.endsem || 0);

    await grade.save();
    return res.json({ success: true, grade });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error updating grade" });
  }
};
