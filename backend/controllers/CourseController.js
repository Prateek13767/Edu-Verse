import mongoose from "mongoose";
import Course from "../models/Course.js";

// ✅ ADD COURSE
const addCourse = async (req, res) => {
    try {
        const { name, code, syllabus, credits, courseType } = req.body;

        if (!name || !code || !syllabus || !credits || !courseType) {
            return res.json({ success: false, message: "Fields missing" });
        }

        const newCourse = await Course.create({
            name,
            code,
            syllabus,
            credits,
            courseType
        });

        return res.json({ success: true, message: "Course added", newCourse });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
};

const addCoursesBulk = async (req, res) => {
  try {
    const { courses } = req.body;

    // Validate input format
    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Courses must be provided in an array"
      });
    }

    let inserted = [];
    let duplicate = [];

    for (const course of courses) {
      const { name, code, syllabus, credits, courseType } = course;

      // Check missing fields
      if (!name || !code || !syllabus || !credits || !courseType) {
        duplicate.push({
          code,
          reason: "Fields missing"
        });
        continue;
      }

      // Check duplicate course code
      const exists = await Course.findOne({ code });
      if (exists) {
        duplicate.push({
          code,
          reason: "Course code already exists"
        });
        continue;
      }

      // Insert course
      const created = await Course.create({
        name,
        code,
        syllabus,
        credits,
        courseType
      });

      inserted.push(created);
    }

    return res.status(200).json({
      success: true,
      message: "Bulk course upload completed",
      insertedCount: inserted.length,
      duplicateCount: duplicate.length,
      inserted,
      duplicate
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error while uploading courses",
      error: error.message
    });
  }
};

// ✅ GET ALL COURSES
const getAllCourses = async (req, res) => {
    try {
        const allcourses = await Course.find();
        return res.json({ success: true, allcourses, message: "Courses fetched successfully" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
};

// ✅ GET COURSE BY ID
const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!courseId) {
            return res.json({ success: false, message: "Id missing" });
        }

        const courseDetails = await Course.findById(courseId);

        if (!courseDetails) {
            return res.json({ success: false, message: "Invalid Course" });
        }

        return res.json({
            success: true,
            courseDetails,
            message: "Details fetched successfully"
        });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
};

// ✅ UPDATE COURSE (Partial Update Supported)
const updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { name, code, syllabus, credits, courseType } = req.body;

        if (!courseId) {
            return res.json({ success: false, message: "Id missing" });
        }

        // ✅ Fetch existing course
        const existing = await Course.findById(courseId);
        if (!existing) {
            return res.json({ success: false, message: "Course not found" });
        }

        // ✅ Only update fields provided
        const updatedData = {
            name: name || existing.name,
            code: code || existing.code,
            syllabus: syllabus || existing.syllabus,
            credits: credits || existing.credits,
            courseType: courseType || existing.courseType
        };

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            updatedData,
            { new: true }
        );

        return res.json({
            success: true,
            message: "Updated Successfully",
            updatedCourse
        });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
};

// ✅ DELETE COURSE
const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!courseId) {
            return res.json({ success: false, message: "Id missing" });
        }

        const deleted = await Course.findByIdAndDelete(courseId);

        if (!deleted) {
            return res.json({ success: false, message: "Invalid Course Id" });
        }

        return res.json({ success: true, message: "Course Deleted Successfully" });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
};

export { addCourse,addCoursesBulk, getAllCourses, getCourseById, updateCourse, deleteCourse };
