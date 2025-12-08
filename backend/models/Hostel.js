import mongoose from "mongoose";

const HostelSchema = new mongoose.Schema({

  // Basic identity
  name: {
    type: String,
    required: true,
    unique: true,              // e.g., Aryabhatta Hostel
  },

  code: {
    type: String,
    unique: true,              // e.g., H1, H10, GH2
  },

  type: {
    type: String,
    enum: ["boys", "girls", "mixed"],
    required: true,
  },

  // Optional for now — useful later for Warden portal
  warden: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warden",
  },

  // Stats (updated automatically when rooms & allotments happen)
  totalRooms: {
    type: Number,
    default: 0,
  },

  totalCapacity: {
    type: Number,
    default: 0,
  },

  totalOccupied: {
    type: Number,
    default: 0,
  },

  status: {
    type: String,
    enum: ["active", "closed", "maintenance"],
    default: "active",
  },

}, { timestamps: true });

export default mongoose.model("Hostel", HostelSchema);
