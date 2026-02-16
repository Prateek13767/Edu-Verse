import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { AllContext } from "../context/AllContext";
import axios from "axios";
import { toast } from "react-toastify";

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const { hostelId, backendUrl } = useContext(AllContext);

  // ================= FETCH ROOMS =================
  const fetchRooms = async (hostelId) => {
    if (!hostelId) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `${backendUrl}/room/hostel/${hostelId}`
      );

      if (res.data.success) {
        setRooms(Array.isArray(res.data.rooms) ? res.data.rooms : []);
      } else {
        toast.error(res.data.message || "Failed to fetch rooms");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms(hostelId);
  }, [hostelId]);

  // ================= UI =================
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 fixed left-0 top-0 h-full z-50">
        <Sidebar />
      </aside>

      {/* RIGHT SIDE */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 px-14 pt-28 pb-14 max-w-6xl mx-auto w-full">
          <h1 className="text-4xl font-bold mb-3">Room Overview</h1>
          <p className="text-gray-600 mb-10 text-lg">
            View room occupancy and availability in your assigned hostel.
            <strong className="block mt-1 text-sm text-blue-600">
              (Warden Access: View Only)
            </strong>
          </p>

          <div className="bg-white shadow-lg rounded-2xl p-10 overflow-x-auto">
            {loading ? (
              <p className="text-center py-10 text-gray-500">
                Loading rooms...
              </p>
            ) : rooms.length === 0 ? (
              <p className="text-center py-10 text-gray-500">
                No rooms found for this hostel
              </p>
            ) : (
              <table className="min-w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-4">Hostel</th>
                    <th className="px-6 py-4">Room</th>
                    <th className="px-6 py-4">Capacity</th>
                    <th className="px-6 py-4">Occupied</th>
                    <th className="px-6 py-4 text-center">Availability</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {rooms.map((room) => {
                    // SAFE OCCUPIED CALCULATION
                    const occupied =
                      typeof room.occupied === "number"
                        ? room.occupied
                        : room.occupants?.length || 0;

                    const available = room.capacity - occupied;

                    return (
                      <tr
                        key={room._id}
                        className="bg-gray-50 hover:bg-gray-100 transition"
                      >
                        {/* HOSTEL NAME (OBJECT-SAFE) */}
                        <td className="px-6 py-4">
                          {typeof room.hostel === "object"
                            ? room.hostel.name
                            : "—"}
                        </td>

                        {/* ROOM */}
                        <td className="px-6 py-4">
                          {room.formattedRoom || "—"}
                        </td>

                        {/* CAPACITY */}
                        <td className="px-6 py-4">
                          {room.capacity}
                        </td>

                        {/* OCCUPIED */}
                        <td className="px-6 py-4">
                          {occupied}
                        </td>

                        {/* AVAILABILITY */}
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              available > 0
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {available > 0
                              ? `${available} Available`
                              : "Full"}
                          </span>
                        </td>

                        {/* ACTION */}
                        <td className="px-6 py-4 text-center">
                          <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm">
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default RoomManagement;
