import mongoose from "mongoose";

const assetConditionEnum = ["new", "good", "damaged", "missing"];

const RoomSchema = new mongoose.Schema(
  {
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },

    block: {
      type: String,
      required: true,
      trim: true,
    },

    floor: {
      type: Number,
      required: true,
    },

    roomIndex: {
      type: String, // 01, 02, 05 etc.
      required: true,
      trim: true,
    },

    formattedRoom: {
      type: String, // A-205
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    occupied: {
      type: Number,
      default: 0,
    },

    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],

    status: {
      type: String,
      enum: ["active", "maintenance", "closed"],
      default: "active",
    },

    // 🪑 Room Assets
    assets: {
      bed: {
        count: { type: Number, default: 0 },
        condition: { type: String, enum: assetConditionEnum, default: "good" },
      },
      chair: {
        count: { type: Number, default: 0 },
        condition: { type: String, enum: assetConditionEnum, default: "good" },
      },
      table: {
        count: { type: Number, default: 0 },
        condition: { type: String, enum: assetConditionEnum, default: "good" },
      },
      cupboard: {
        count: { type: Number, default: 0 },
        condition: { type: String, enum: assetConditionEnum, default: "good" },
      },
      fan: {
        count: { type: Number, default: 0 },
        condition: { type: String, enum: assetConditionEnum, default: "good" },
      },
    },
  },
  { timestamps: true }
);

// 🔥 Prevent duplicate formattedRoom in the same hostel
RoomSchema.index({ hostel: 1, formattedRoom: 1 }, { unique: true });

export default mongoose.model("Room", RoomSchema);
