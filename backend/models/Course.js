import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({

    name: { type: String, required: true },

    code: { type: String, required: true, unique: true },

    syllabus: { type: String, required: true },

    credits: { type: Number, required: true },

    courseType:{type:String,enum:["Lab","Theory"],required:true},

}, { timestamps: true });

const Course = mongoose.model("Course", CourseSchema);

export default Course;
