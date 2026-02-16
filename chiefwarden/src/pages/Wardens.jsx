import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Wardens = () => {
  const [hostels, setHostels] = useState([]);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch Hostels
  useEffect(() => {
    const loadHostels = async () => {
      try {
        const res = await axios.get(`${backendUrl}/hostel`);
        if (res.data.success) {
          setHostels(res.data.hostels);
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadHostels();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* Sidebar */}
      <aside className="w-64 fixed left-0 top-0 h-full bg-[#0F172A] text-white shadow-lg z-50">
        <Sidebar />
      </aside>

      {/* Right Content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 px-10 pt-24 pb-10 max-w-7xl mx-auto w-full">

          <h1 className="text-3xl font-bold mb-10">Hostel Management</h1>

          <p className="text-gray-600 mb-6">
            Assign wardens and caretakers to each hostel.
          </p>

          {/* Hostel Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {hostels.map((hostel) => (
              <div
                key={hostel._id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl border border-gray-200 transition-all"
              >
                <h2 className="text-2xl font-semibold mb-3">{hostel.name}</h2>

                <div className="text-gray-700 space-y-1 mb-4">
                  <p><strong>Code:</strong> {hostel.code}</p>
                  <p><strong>Type:</strong> {hostel.type}</p>
                  <p><strong>Total Rooms:</strong> {hostel.totalRooms}</p>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(`/wardens/assign-warden/${hostel._id}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Assign Warden
                  </button>

                  <button
                    onClick={() => navigate(`/assign-caretaker/${hostel._id}`)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Assign Caretaker
                  </button>
                </div>

              </div>
            ))}
          </div>

          {hostels.length === 0 && (
            <p className="text-center text-gray-500 mt-10">No hostels found.</p>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Wardens;
