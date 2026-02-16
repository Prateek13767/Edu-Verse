import Room from "../../models/Room.js";
import axios from "axios";

export const fetchHostels = async () => {
  const res = await axios.get("http://localhost:3000/hostel");
  return res.data.hostels;
};

export const getRoomsByFilterService = async ({ hostel,vacantOnly}) => {
  const res=await axios.post("http://localhost:3000/room/filter", { hostel,vacantOnly});
  return res.data.rooms;
};

export const hostelWithRooms=async (params)=>{

  const hostelData=await fetchHostels();
  const roomData=await getRoomsByFilterService({hostel:params.hostel,vacantOnly:params.vacantOnly});
  const reqFormat=[];
  for (const hostel of hostelData){
    const hostelDetails ={id:hostel._id,name:hostel.name,type:hostel.type,totalRooms:hostel.totalRooms,totalCapacity:hostel.totalCapacity};
    const hostelRooms=[];
    for (const room of roomData){
      if (room.hostel._id===hostel._id  ){
        hostelRooms.push({id:room._id,block:room.block,floor:room.floor,roomIndex:room.roomIndex,formattedRoom:room.formattedRoom,capacity:room.capacity,occupied:room.occupied})
      }
    }
    hostelDetails.rooms=hostelRooms
    reqFormat.push(hostelDetails)
  }
  return reqFormat;
  
}
