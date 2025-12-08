import mongoose from "mongoose";

const CourseOfferingSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    semester: { type: Number, required: true }, 
    year:{ type: Number, required: true },
    branches:[ {type:String,required:true }],
    coordinator: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
    instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Faculty" }]
}, { timestamps: true });


const CourseOffering = mongoose.model("CourseOffering", CourseOfferingSchema);

export default CourseOffering