import mongoose from "mongoose";

const AcademicCalendarSchema = new mongoose.Schema({
  semester: { type: String,enum:["even","odd"], required: true },
  year:{ type:Number,required:true},
  resultReleaseDate: { type: Date, required: true },
  courseRegStart: { type: Date, required: true },
  courseRegEnd: { type: Date, required: true },
  classesStart:{type:Date,required:true},
  classesEnd:{type:Date,required:true},
  midSemesterStart : {type:Date ,required:true},
  midSemesterEnd:{type:Date,required:true},
  semesterStart: { type: Date, required: true },
  semesterEnd: { type: Date, required: true },

  endSemesterStart:{type:Date,required:true},
  endSemesterEnd:{type:Date,required:true},

  supplementaryStart: { type:Date,required:true },
  supplementaryEnd: { type:Date,required:true},

  holidays: [
    {
        name: { type: String, required: true }, // optional but useful
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true }
    }
]

}, { timestamps: true });

const AcademicCalendar=mongoose.model("AcademicCalendar", AcademicCalendarSchema);

export default AcademicCalendar
