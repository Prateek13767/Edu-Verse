import mongoose from "mongoose";

const CourseOfferingSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    // Student semester (1,2,3...)
    semester: {
      type: Number,
      required: true
    },

    // Academic year (matches Settings)
    academicYear: {
      type: String, // "2022-2023"
      required: true
    },

    // Odd / Even (matches Settings.currentSem)
    semType: {
      type: String,
      enum: ["Odd", "Even"],
      required: true
    },

    branches: [
      {
        type: String,
        required: true
      }
    ],

    coordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true
    },

    instructors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
      }
    ]
  },
  { timestamps: true }
);

// Prevent duplicate offerings
CourseOfferingSchema.index(
  { course: 1, semester: 1, academicYear: 1, semType: 1 },
  { unique: true }
);

const CourseOffering =
  mongoose.models.CourseOffering ||
  mongoose.model("CourseOffering", CourseOfferingSchema);

export default CourseOffering;
