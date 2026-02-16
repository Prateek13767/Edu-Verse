import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const RoomAllocation = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [year, setYear] = useState(2025);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH WILLINGNESS =================
  const fetchWillingness = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${backendUrl}/willingness/filter`,
        { year }
      );

      setRequests(
        Array.isArray(res.data.willingnesses)
          ? res.data.willingnesses
          : []
      );
    } catch (error) {
      console.error("Fetch error:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWillingness();
  }, [year]);

  // ================= APPROVE / REJECT =================
  const updateStatus = async (willingnessId, status) => {
    try {
      await axios.put(
        `${backendUrl}/willingness/update-status/${willingnessId}`,
        { status }
      );
      fetchWillingness();
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  // ================= AUTO ALLOCATION =================
  const autoAllocate = async () => {
    const ok = window.confirm(
      "Run hostel allotment as per policy for approved students?"
    );
    if (!ok) return;

    try {
      await axios.post(
        `${backendUrl}/hostel/auto-allocate`,
        { year }
      );
      alert("Hostel allotment completed successfully");
      fetchWillingness();
    } catch (error) {
      console.error("Auto allocation error:", error);
      alert("Auto allocation failed");
    }
  };

  // ================= MANUAL ALLOCATION (REDIRECT) =================
  const manualAllocate = (studentId) => {
    navigate(`/room-allocation/manual/${studentId}`);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* FIXED SIDEBAR */}
      <aside className="w-64 fixed left-0 top-0 h-full bg-[#0F172A] text-white z-50">
        <Sidebar />
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 px-10 pt-24 pb-10 max-w-7xl mx-auto w-full">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Room Allocation</h1>

            <button
              onClick={autoAllocate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow"
            >
              Auto Allocate (Policy)
            </button>
          </div>

          {/* YEAR FILTER */}
          <div className="flex gap-4 items-center mb-6">
            <label className="font-medium">Select Year:</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border px-3 py-2 rounded"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto bg-white border rounded-xl shadow-lg">
            <table className="min-w-full border-collapse">

              {/* TABLE HEAD */}
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Name</th>
                  <th className="px-6 py-3 text-center font-semibold">Roll No</th>
                  <th className="px-6 py-3 text-center font-semibold">Branch</th>
                  <th className="px-6 py-3 text-center font-semibold">Gender</th>
                  <th className="px-6 py-3 text-center font-semibold">Status</th>
                  <th className="px-6 py-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody>

                {/* LOADING */}
                {loading && (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      Loading willingness requests...
                    </td>
                  </tr>
                )}

                {/* DATA */}
                {!loading && requests.map((req) => (
                  <tr
                    key={req._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      {req.student?.name || "N/A"}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {req.student?.collegeId || "N/A"}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {req.student?.department || "N/A"}
                    </td>

                    <td className="px-6 py-4 text-center capitalize">
                      {req.student?.gender || "N/A"}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          req.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : req.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        {req.status === "Submitted" && (
                          <>
                            <button
                              onClick={() =>
                                updateStatus(req._id, "Approved")
                              }
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() =>
                                updateStatus(req._id, "Rejected")
                              }
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {req.status === "Approved" && (
                          <button
                            onClick={() =>
                              manualAllocate(req.student?._id)
                            }
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-md text-sm"
                          >
                            Manual Allocate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {/* EMPTY */}
                {!loading && requests.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No willingness requests found
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default RoomAllocation;
