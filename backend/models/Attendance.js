import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
    enrollment: { type: mongoose.Schema.Types.ObjectId, ref: "Enrollment", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["present", "absent"], required: true }
}, { timestamps: true });


const Attendance = mongoose.model("Attendance", AttendanceSchema);

export default Attendance;