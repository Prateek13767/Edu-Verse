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
      type: String,
      required: true,
      trim: true,
    },

    formattedRoom: {
      type: String,
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

    status: {
      type: String,
      enum: ["active", "maintenance", "closed"],
      default: "active",
    },

    // 🪑 Room Assets (count auto-filled = capacity)
    assets: {
      bed: {
        count: { type: Number },
        condition: { type: String, enum: assetConditionEnum, default: "good" },
      },
      chair: {
        count: { type: Number },
        condition: { type: String, enum: assetConditionEnum, default: "good" },
      },
      table: {
        count: { type: Number },
        condition: { type: String, enum: assetConditionEnum, default: "good" },
      },
      cupboard: {
        count: { type: Number },
        condition: { type: String, enum: assetConditionEnum, default: "good" },
      },
      fan: {
        count: { type: Number },
        condition: { type: String, enum: assetConditionEnum, default: "good" },
      },
    },
  },
  { timestamps: true }
);

// 🔥 Auto-generate default asset counts based on capacity
RoomSchema.pre("validate", function (next) {
  if (this.capacity) {
    const cap = this.capacity;

    this.assets = {
      bed: { count: cap, condition: this.assets?.bed?.condition || "good" },
      chair: { count: cap, condition: this.assets?.chair?.condition || "good" },
      table: { count: cap, condition: this.assets?.table?.condition || "good" },
      cupboard: { count: cap, condition: this.assets?.cupboard?.condition || "good" },
      fan: { count: cap, condition: this.assets?.fan?.condition || "good" },
    };
  }

  next();
});

// 🔥 Prevent duplicate formattedRoom in the same hostel
RoomSchema.index({ hostel: 1, formattedRoom: 1 }, { unique: true });

export default mongoose.model("Room", RoomSchema);
