import axios from "axios"

export const getWillingnesses =async(year)=>{

    const willingnessData=await axios.post("http://localhost:3000/willingness/filter",{year:year,status:"Submitted" });
    return willingnessData.data.willingnesses;

}

export const finalData=async (year)=>{

    const willingnessData=await getWillingnesses(year);
    const requiredData=[];
    for (const willingness of willingnessData){
        const format={};
        format.name=willingness.student.name;
        format._id=willingness._id;
        format.studentId=willingness.student._id;
        format.collegeId=willingness.student.collegeId;
        format.currentSem=willingness.student.currentSem;
        format.gender=willingness.student.gender;
        format.email=willingness.student.email;
        format.city=willingness.student.city;
        format.state=willingness.student.state;
        format.department=willingness.student.department;
        format.programme=willingness.student.programme;
        format.status=willingness.status;
        requiredData.push(format);
    }

    return requiredData;

}
