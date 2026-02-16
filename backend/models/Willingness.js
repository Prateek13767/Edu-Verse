import mongoose from "mongoose";

const WillingnessSchema = new mongoose.Schema(
  {
    // Student who submitted willingness
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    // Academic year for which willingness is submitted
    year: {
      type: Number,
      required: true
    },

    // Current status of willingness
    status: {
      type: String,
      enum: ["Submitted", "Approved", "Rejected"],
      default: "Submitted"
    }
  },
  { timestamps: true }
);

// Prevent duplicate willingness submissions for the same year
WillingnessSchema.index({ student: 1, year: 1 }, { unique: true });

const Willingness = mongoose.model("Willingness", WillingnessSchema);
export default Willingness;
