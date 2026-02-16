import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const ManualAllocate = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [student, setStudent] = useState(null);
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [selectedHostel, setSelectedHostel] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  const [loading, setLoading] = useState(false);

  // ================= FETCH STUDENT (FOR DETAILS CARD) =================
  const fetchStudent = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/student/${studentId}`
      );
      setStudent(res.data.student);
    } catch (error) {
      console.error("Student fetch error:", error);
    }
  };

  // ================= FETCH HOSTELS =================
  const fetchHostels = async () => {
    try {
      const res = await axios.get(`${backendUrl}/hostel/all`);
      setHostels(res.data.hostels || []);
    } catch (error) {
      console.error("Hostel fetch error:", error);
    }
  };

  // ================= FETCH VACANT ROOMS =================
  const fetchRooms = async (hostelId) => {
    try {
      const res = await axios.post(`${backendUrl}/room/filter`, {
        hostel: hostelId,
        vacantOnly: "true",
      });
      setRooms(res.data.rooms || []);
    } catch (error) {
      console.error("Room fetch error:", error);
    }
  };

  useEffect(() => {
    fetchStudent();
    fetchHostels();
  }, []);

  useEffect(() => {
    if (selectedHostel) {
      fetchRooms(selectedHostel);
    } else {
      setRooms([]);
    }
  }, [selectedHostel]);

  // ================= ALLOCATE ROOM =================
  const allocateRoom = async () => {
    if (!selectedHostel || !selectedRoom) {
      alert("Please select hostel and room");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${backendUrl}/hostel/manual-allocate`, {
        studentId,
        hostel: selectedHostel,
        roomId: selectedRoom,
      });

      alert("Room allocated successfully");
      navigate("/room-allocation");
    } catch (error) {
      console.error("Allocation error:", error);
      alert("Room allocation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* SIDEBAR */}
      <aside className="w-64 fixed left-0 top-0 h-full bg-[#0F172A] text-white z-50">
        <Sidebar />
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 px-10 pt-24 pb-10 max-w-5xl mx-auto w-full">

          <h1 className="text-3xl font-bold mb-6">
            Manual Room Allocation
          </h1>

          {/* STUDENT DETAILS (SAME AS ROOM ALLOCATION TABLE) */}
          {student && (
            <div className="bg-white border rounded-xl shadow-lg mb-8">
              <div className="bg-gray-100 px-6 py-3 font-semibold">
                Student Details
              </div>

              <div className="grid grid-cols-4 gap-6 px-6 py-5 text-sm">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium">{student.name}</p>
                </div>

                <div>
                  <p className="text-gray-500">Roll No</p>
                  <p className="font-medium">{student.collegeId}</p>
                </div>

                <div>
                  <p className="text-gray-500">Branch</p>
                  <p className="font-medium">{student.department}</p>
                </div>

                <div>
                  <p className="text-gray-500">Gender</p>
                  <p className="font-medium capitalize">{student.gender}</p>
                </div>
              </div>
            </div>
          )}

          {/* ALLOCATION CARD */}
          <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">

            {/* HOSTEL */}
            <div>
              <label className="block font-medium mb-2">
                Select Hostel
              </label>
              <select
                value={selectedHostel}
                onChange={(e) => setSelectedHostel(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg"
              >
                <option value="">-- Select Hostel --</option>
                {hostels.map((hostel) => (
                  <option key={hostel._id} value={hostel._id}>
                    {hostel.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ROOM */}
            <div>
              <label className="block font-medium mb-2">
                Select Available Room
              </label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg"
                disabled={!selectedHostel}
              >
                <option value="">-- Select Room --</option>
                {rooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    Room {room.roomIndex} | Block {room.block} | Floor{" "}
                    {room.floor} (Vacant: {room.capacity - room.occupied})
                  </option>
                ))}
              </select>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={allocateRoom}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                {loading ? "Allocating..." : "Allocate Room"}
              </button>

              <button
                onClick={() => navigate(-1)}
                className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default ManualAllocate;
