import mongoose from "mongoose";

const complaintSchema=new mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
        required:true
    },
    hostel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hostel",
        required:true
    },
    room:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Room",
        required:true
    },
    type:{
        type:String,
        enum:["Cleanliness","Electricity","Internet","Furniture","Security","Discipline","Water and Sanitation","Staff and Administration","Others"],
        required:true
    },
    description:{
        type:String,
        required:true,
        default:""
    },
    status:{
        type:String,
        enum:["Pending","Resolved"],
        default:"Pending",
        required:true
    },
    remarks:{
        type:String
    }
},{timestamps:true});

const Complaint=mongoose.model("Complaint",complaintSchema);

export default Complaint