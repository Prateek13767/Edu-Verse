import mongoose from "mongoose"

const GradeSchema = new mongoose.Schema({
    enrollment: { type: mongoose.Schema.Types.ObjectId, ref: "Enrollment", required: true },
    assignments: {type:Number},
    midsem: {type:Number},
    endsem: {type:Number},
    quiz: {type:Number},
    project: {type:Number},
    total: {type:Number},
    letterGrade: {type:String },
    gradePoints: {type:Number}
}, { timestamps: true });


const Grade = mongoose.model("Grade", GradeSchema);

export default Grade 