import mongoose from "mongoose";

export const connectdb=async ()=>{
    try {
       const conn= await mongoose.connect(`${process.env.MONGODB_URI}/EduManage`);
       console.log('Database Connected');
        
    } catch (error) {
        console.log(error);

    }
}