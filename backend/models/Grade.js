import mongoose from "mongoose"

const GradeSchema = new mongoose.Schema({
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Enrollment",
    required: true,
    unique: true,          // 🔥 CRITICAL
    index: true
  },
  assignments: Number,
  midsem: Number,
  endsem: Number,
  quiz: Number,
  project: Number,
  total: Number,
  letterGrade: String,
  gradePoints: Number
}, { timestamps: true });


const Grade = mongoose.model("Grade", GradeSchema);

export default Grade 