import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    offering: { type: mongoose.Schema.Types.ObjectId, ref: "CourseOffering", required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" }, 
    status: { type: String, enum: ["approved", "dropped", "completed", "selected","Attendance Failure","Supplementary"], default: "selected" },
    schedule: [
        {
            day: String,
            startTime: String,
            endTime: String,
            room: String
        }
    ]
}, { timestamps: true });

const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);

export default Enrollment;
