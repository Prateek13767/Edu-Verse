import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  // 🔹 Basic Profile
  name: { type: String, required: true },
  collegeId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  phone: { type: Number, required: true },
  fathersName: { type: String, required: true },
  fatherPhone: { type: Number },

  gender: { type: String, enum: ["male", "female"], required: true },

  // 🔹 Address
  city: { type: String, required: true },
  state: { type: String, required: true },

  // 🔹 Academic Details
  age: { type: Number, required: true },
  dob: { type: Date, required: true },

  batch: { type: Number, required: true },
  programme: {
    type: String,
    enum: ["B.Tech", "M.Tech", "MBA", "PhD", "M.Sc"],
    required: true
  },
  department: { type: String, required: true },
  currentSem: { type: Number, required: true },

  // 🔹 Grade Sheets
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
      backlogs: {
        type: [
          {
            course: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Course",
              required: true
            },
            grade: {
              type: String,
              required: true // F, D, etc.
            }
          }
        ],
        required: false,
        default: undefined
      },
      generatedAt: { type: Date, default: Date.now }
    }
  ],

  cgpa: { type: Number, default: 0 },

}, { timestamps: true });

StudentSchema.index({ collegeId: 1 });

// ✅ SAFE EXPORT (prevents OverwriteModelError)
const Student =
  mongoose.models.Student || mongoose.model("Student", StudentSchema);

export default Student;
