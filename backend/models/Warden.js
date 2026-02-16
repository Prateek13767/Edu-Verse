import mongoose from "mongoose";

const wardenSchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },

    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    }
  },
  { timestamps: true }
);

// Prevent assigning multiple wardens to one hostel
wardenSchema.index({ hostel: 1 }, { unique: true });

export default mongoose.model("Warden", wardenSchema);
