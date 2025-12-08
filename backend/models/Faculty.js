import mongoose from "mongoose";

const FacultySchema = new mongoose.Schema({

    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },   // store hashed password

    employeeId: { type: String, required: true, unique: true },

    designation: {
        type: String,
        enum: ["Professor", "Associate Professor", "Assistant Professor"],
        required: true
    },

    department: { type: String, required: true },

    phone: { type: String },

    address: { type: String },

}, { timestamps: true });

const Faculty = mongoose.model("Faculty", FacultySchema);

export default Faculty;
