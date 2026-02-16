import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Faculty from "../models/Faculty.js";
import CourseOffering from "../models/CourseOffering.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/emailService.js";

const JWT_SECRET = process.env.JWT_SECRET;
const createToken = id => jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });


// ✅ REGISTER FACULTY
const registerFaculty = async (req, res) => {
    try {
        const { name, email, password, employeeId, designation, department, phone, address } = req.body;

        if (!name || !email || !password || !phone || !employeeId || !designation || !department || !address)
            return res.json({ success: false, message: "Fields Are Missing" });

        const existing = await Faculty.findOne({ email });
        if (existing) return res.json({ success: false, message: "Email already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newFaculty = await Faculty.create({
            name,
            email,
            password: hashedPassword,
            phone,
            employeeId,
            designation,
            department,
            address
        });

        await sendEmail({
            to: newFaculty.email,
            subject: "Welcome to Course Registration Portal",
            html: `
                <h2>Hello ${newFaculty.name},</h2>
                <p>Your account has been created successfully.</p>
                <p>Thank you,<br>MNIT Registration Team</p>
            `
        });


        res.json({ success: true, message:"Faculty Registered Successfully",facultyId:newFaculty._id });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};


export const registerManyFaculty = async (req, res) => {
  try {
    const { faculties } = req.body;

    if (!Array.isArray(faculties) || faculties.length === 0) {
      return res.json({
        success: false,
        message: "Faculty array is required"
      });
    }

    const inserted = [];
    const skipped = [];

    for (const faculty of faculties) {
      const {
        name,
        email,
        password,
        employeeId,
        designation,
        department,
        phone,
        address
      } = faculty;

      // 🔹 Validate fields
      if (
        !name || !email || !password || !employeeId ||
        !designation || !department || !phone || !address
      ) {
        skipped.push({ email, reason: "Missing fields" });
        continue;
      }

      // 🔹 Check existing email or employeeId
      const exists = await Faculty.findOne({
        $or: [{ email }, { employeeId }]
      });

      if (exists) {
        skipped.push({ email, reason: "Already exists" });
        continue;
      }

      // 🔹 Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 🔹 Create faculty
      const newFaculty = await Faculty.create({
        name,
        email,
        password: hashedPassword,
        employeeId,
        designation,
        department,
        phone,
        address
      });

      inserted.push({
        facultyId: newFaculty._id,
        email: newFaculty.email
      });

      // 🔹 Optional email (safe to comment for bulk load)
      /*
      await sendEmail({
        to: email,
        subject: "Welcome to Course Registration Portal",
        html: `
          <h2>Hello ${name},</h2>
          <p>Your faculty account has been created successfully.</p>
          <p>Regards,<br>MNIT Registration Team</p>
        `
      });
      */
    }

    res.json({
      success: true,
      message: "Bulk Faculty Registration Completed",
      insertedCount: inserted.length,
      skippedCount: skipped.length,
      inserted,
      skipped
    });

  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Bulk registration failed"
    });
  }
};



// ✅ LOGIN FACULTY
const loginFaculty = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.json({ success: false, message: "Email/Password Missing" });

        const faculty = await Faculty.findOne({ email });
        if (!faculty)
            return res.json({ success: false, message: "Faculty Not Found" });

        const match = await bcrypt.compare(password, faculty.password);
        if (!match)
            return res.json({ success: false, message: "Invalid Credentials" });

        const token = createToken(faculty._id);

        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};


// ✅ GET FACULTY BY ID
const getFacultyById = async (req, res) => {
    try {
        const { id } = req.params;

        const faculty = await Faculty.findById(id);
        if (!faculty)
            return res.json({ success: false, message: "Faculty Not Found" });

        res.json({ success: true, faculty });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};


// ✅ GET ALL FACULTY
const getAllFaculty = async (req, res) => {
    try {
        const allFaculty = await Faculty.find();
        res.json({ success: true, allFaculty });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};


// ✅ GET COURSES FACULTY TEACHES
const getFacultyCourses = async (req, res) => {
    try {
        const { id } = req.params;
        const { semester } = req.query;

        const courses = await CourseOffering.find({
            semester,
            instructors: id
        });

        res.json({ success: true, courses });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};


// ✅ GET COURSES COORDINATED BY FACULTY
const getFacultyCoordinatingCourses = async (req, res) => {
    try {
        const { id } = req.params;
        const { semester } = req.query;

        const courses = await CourseOffering.find({
            semester,
            coordinator: id
        });

        res.json({ success: true, courses });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};


export {
    loginFaculty,
    registerFaculty,
    getFacultyById,
    getAllFaculty,
    getFacultyCourses,
    getFacultyCoordinatingCourses
};
