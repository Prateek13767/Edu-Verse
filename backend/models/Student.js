import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({

    // Basic Profile
    name: { type: String, required: true },
    collegeId: { type: String, required: true, unique: true },   // Roll No / Admission No
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    fathersName: { type: String, required: true },
    fatherPhone: { type: Number },    // Optional but useful later
    gender: { type: String, enum: ["male", "female", "other"], required: true },

    // Academic Details
    age: { type: Number, required: true },
    dob: { type: Date, required: true },
    batch: { type: Number, required: true },                     // e.g., 2022
    programme: { 
        type: String, 
        enum: ["B.Tech", "M.Tech", "MBA", "PhD", "M.Sc"],
        required: true 
    },
    department: { type: String, required: true },
    currentSem: { type: Number, required: true },

    // Grade Sheet / Semester Performance
    gradeSheets: [
        {
            semester: { type: Number, required: true },
            sgpa: { type: Number, required: true },
            cgpa: { type: Number, required: true },
            creditsOffered: { type: Number, required: true },
            creditsEarned: { type: Number, required: true },
            courses: [
                {
                    enrollment: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Enrollment",
                        required: true,
                    },
                    grade: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Grade",
                        required: true,
                    }
                }
            ],
            generatedAt: { type: Date, default: Date.now }
        }
    ],

    cgpa: { type: Number, default: 0 },

    // 🏠 Hostel & Room Section (for hostel management system)
    currentHostel: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel", default: null },
    currentRoom: { type: mongoose.Schema.Types.ObjectId, ref: "Room", default: null },

    // Room history — for all semesters / past hostel sessions
    rooms: [
        {
            room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
            currentStatus: { type: String, enum: ["allotted", "vacated"], default: "allotted" }
        }
    ],

}, { timestamps: true });

// 🔍 Index for faster queries
StudentSchema.index({ collegeId: 1 });

const Student = mongoose.model("Student", StudentSchema);
export default Student;
