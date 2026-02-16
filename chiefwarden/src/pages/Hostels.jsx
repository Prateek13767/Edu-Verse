import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Hostels = () => {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // ================= FETCH HOSTELS =================
  const fetchHostels = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/hostel`);
      const data = res.data;

      console.log("HOSTELS RESPONSE:", data);

      if (data?.success && Array.isArray(data.hostels)) {
        setHostels(data.hostels);
      } else {
        setHostels([]);
      }
    } catch (error) {
      console.error("Error fetching hostels:", error);
      setHostels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  // ================= NAVIGATE =================
  const handleHostelClick = (id) => {
    navigate(`/hostels/${id}`);
  };

  // ================= UI =================
  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* FIXED SIDEBAR */}
      <aside className="w-64 fixed left-0 top-0 h-full bg-[#0F172A] text-white shadow-lg z-50">
        <Sidebar />
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 px-10 pt-24 pb-10 max-w-7xl mx-auto w-full">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight">Hostels</h1>

            <button
              onClick={() => navigate("/hostels/add-hostel")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-md font-medium transition-all"
            >
              + Add New Hostel
            </button>
          </div>

          <p className="text-gray-600 mb-10">
            Manage hostels, view details, and assign wardens.
          </p>

          {/* LOADING */}
          {loading && (
            <p className="text-center text-gray-500">
              Loading hostels...
            </p>
          )}

          {/* EMPTY STATE */}
          {!loading && hostels.length === 0 && (
            <p className="text-center text-gray-500">
              No hostels found.
            </p>
          )}

          {/* HOSTEL CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

            {hostels.map((hostel) => (
              <div
                key={hostel._id}
                onClick={() => handleHostelClick(hostel._id)}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl border border-gray-200 transition-all cursor-pointer"
              >
                <h2 className="text-xl font-semibold mb-4">
                  {hostel.code || "HOSTEL"} ({hostel.name || "Unnamed"})
                </h2>

                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Capacity:</strong>{" "}
                    {hostel.totalCapacity ?? "N/A"}
                  </p>
                  <p>
                    <strong>Total Rooms:</strong>{" "}
                    {hostel.totalRooms ?? 0}
                  </p>
                  <p>
                    <strong>Warden:</strong>{" "}
                    {hostel.warden?.faculty?.name || "Not Assigned"}
                  </p>
                  <p>
                    <strong>Caretaker:</strong>{" "}
                    {hostel.caretaker || "Not Assigned"}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHostelClick(hostel._id);
                  }}
                  className="mt-5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  View Details
                </button>
              </div>
            ))}

          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Hostels;
