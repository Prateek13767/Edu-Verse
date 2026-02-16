import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";

const HostelDetails = () => {
  const { hostelId } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [hostel, setHostel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // ADD ROOM FORM STATE
  const [roomForm, setRoomForm] = useState({
    block: "",
    floor: "",
    roomIndex: "",
    capacity: "",
  });

  const handleRoomInput = (e) => {
    setRoomForm({ ...roomForm, [e.target.name]: e.target.value });
  };

  // FETCH HOSTEL + ROOMS
  const loadHostelDetails = async () => {
    try {
      const hostelRes = await axios.get(`${backendUrl}/hostel/${hostelId}`);
      if (hostelRes.data.success) {
        setHostel(hostelRes.data.hostel);
      }

      const roomsRes = await axios.post(`${backendUrl}/room/filter`, {
        hostel: hostelId,
      });

      if (roomsRes.data.success) {
        setRooms(roomsRes.data.rooms);
      }
    } catch (error) {
      console.log("Error loading hostel details:", error);
    }
  };

  useEffect(() => {
    loadHostelDetails();
  }, [hostelId]);

  // ADD ROOM
  const handleAddRoom = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const block = roomForm.block.trim();
    const roomIndex = roomForm.roomIndex.trim();
    const floor = Number(roomForm.floor);
    const capacity = Number(roomForm.capacity);

    if (!block || !roomIndex || roomForm.floor === "" || roomForm.capacity === "") {
      setErrorMessage("All fields are required.");
      return;
    }

    if (!Number.isFinite(floor) || floor < 0) {
      setErrorMessage("Floor must be 0 or a positive number.");
      return;
    }

    if (!Number.isFinite(capacity) || capacity <= 0) {
      setErrorMessage("Capacity must be a positive number.");
      return;
    }

    const existingCapacity = rooms.reduce(
      (sum, r) => sum + (r.capacity || 0),
      0
    );

    const finalCapacity = existingCapacity + capacity;

    if (finalCapacity > (hostel?.totalCapacity ?? Infinity)) {
      setErrorMessage(
        `Cannot add room.\n\nHostel Total Capacity: ${hostel?.totalCapacity}\n` +
          `Currently Used: ${existingCapacity}\n` +
          `New Room Needs: ${capacity}\n` +
          `Final: ${finalCapacity} (exceeds limit)`
      );
      return;
    }

    const payload = {
      hostel: hostelId,
      block,
      floor,
      roomIndex,
      capacity,
    };

    try {
      const { data } = await axios.post(`${backendUrl}/room/create`, payload);

      if (data.success) {
        alert("Room added successfully!");

        // ❌ DO NOT RESET FORM
        // ✅ Keep previous values as requested

        await loadHostelDetails();
      } else {
        setErrorMessage(data.message || "Failed to add room");
      }
    } catch (error) {
      console.log("Error adding room:", error);
      setErrorMessage("Error adding room");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-64 fixed left-0 top-0 h-full bg-[#0F172A] text-white z-50">
        <Sidebar />
      </aside>

      {/* MAIN */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 px-10 pt-24 pb-10 max-w-6xl mx-auto w-full">
          <h1 className="text-3xl font-bold tracking-tight mb-8">
            Hostel Details
          </h1>

          {!hostel ? (
            <p>Loading...</p>
          ) : (
            <>
              {/* HOSTEL INFO */}
              <div className="bg-white rounded-xl shadow-md border p-8 mb-10">
                <h2 className="text-2xl font-semibold mb-4">
                  {hostel.name}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
                  <p><strong>Code:</strong> {hostel.code}</p>
                  <p><strong>Type:</strong> {hostel.type}</p>
                  <p><strong>Total Rooms:</strong> {hostel.totalRooms}</p>
                  <p><strong>Total Capacity:</strong> {hostel.totalCapacity}</p>
                  <p><strong>Occupied:</strong> {hostel.totalOccupied}</p>
                  <p><strong>Status:</strong> {hostel.status}</p>
                </div>
              </div>

              {/* ADD ROOM */}
              <div className="bg-white p-8 rounded-xl shadow-md border mb-12">
                <h2 className="text-2xl font-bold mb-6">Add New Room</h2>

                {errorMessage && (
                  <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 whitespace-pre-line">
                    {errorMessage}
                  </div>
                )}

                <form
                  onSubmit={handleAddRoom}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                  <input
                    type="text"
                    name="block"
                    value={roomForm.block}
                    onChange={handleRoomInput}
                    placeholder="Block (A)"
                    className="px-4 py-2 border rounded-lg"
                  />

                  <input
                    type="number"
                    name="floor"
                    value={roomForm.floor}
                    onChange={handleRoomInput}
                    placeholder="Floor (0)"
                    className="px-4 py-2 border rounded-lg"
                  />

                  <input
                    type="text"
                    name="roomIndex"
                    value={roomForm.roomIndex}
                    onChange={handleRoomInput}
                    placeholder="Room Index (01)"
                    className="px-4 py-2 border rounded-lg"
                  />

                  <input
                    type="number"
                    name="capacity"
                    value={roomForm.capacity}
                    onChange={handleRoomInput}
                    placeholder="Capacity"
                    className="px-4 py-2 border rounded-lg"
                  />

                  <button
                    type="submit"
                    className="col-span-1 sm:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold cursor-pointer"
                  >
                    Add Room
                  </button>
                </form>
              </div>

              {/* ROOMS TABLE */}
              <h2 className="text-2xl font-bold mb-6">Rooms</h2>

              {rooms.length === 0 ? (
                <p>No rooms available.</p>
              ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow-md border">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-4 text-center">Room</th>
                        <th className="p-4 text-center">Block</th>
                        <th className="p-4 text-center">Floor</th>
                        <th className="p-4 text-center">Capacity</th>
                        <th className="p-4 text-center">Occupied</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rooms.map((room) => (
                        <tr key={room._id} className="border-b">
                          <td className="p-4 text-center">{room.formattedRoom}</td>
                          <td className="p-4 text-center">{room.block}</td>
                          <td className="p-4 text-center">{room.floor}</td>
                          <td className="p-4 text-center">{room.capacity}</td>
                          <td className="p-4 text-center">{room.occupied}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default HostelDetails;
