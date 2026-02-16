import mongoose from "mongoose";

const RoomAllotmentSchema = new mongoose.Schema(
  {
    // Student who is allotted the room
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    // Hostel assigned
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true
    },

    // Room assigned
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },

    // Academic year of allotment
    year: {
      type: Number,
      required: true
    },

    // Status of this room allotment entry
    status: {
      type: String,
      enum: ["Allotted", "Vacated"],
      default: "Allotted"
    },

    // Link back to willingness entry
    willingness: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Willingness",
      required: true
    }
  },
  { timestamps: true }
);

// Prevent multiple allocations for same year
RoomAllotmentSchema.index({ student: 1, year: 1 }, { unique: true });

const RoomAllotment = mongoose.model("RoomAllotment", RoomAllotmentSchema);
export default RoomAllotment;
