import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const Complaints = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Filters
  const [type, setType] = useState("");
  const [hostel, setHostel] = useState("");
  const [year, setYear] = useState("");
  const [search, setSearch] = useState("");

  /* ================= FETCH COMPLAINTS ================= */
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/complaint`);
      setComplaints(res.data.complaintDetails || []);
    } catch (error) {
      console.error("Fetch complaints error", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH HOSTELS ================= */
  const fetchHostels = async () => {
    try {
      const res = await axios.get(`${backendUrl}/hostel`);
      setHostels(res.data.hostels || []);
    } catch (error) {
      console.error("Fetch hostels error", error);
    }
  };

  /* ================= UPDATE STATUS ================= */
  const resolveComplaint = async (id) => {
    try {
      await axios.put(`${backendUrl}/complaint/status/update`, {
        complaint: id,
        status: "Resolved",
        resolutionNote: "Resolved by administration"
      });
      fetchComplaints();
    } catch (error) {
      console.error("Resolve error", error);
    }
  };

  /* ================= DELETE ================= */
  const deleteComplaint = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;
    try {
      await axios.delete(`${backendUrl}/complaint/delete`, {
        data: { complaint: id }
      });
      fetchComplaints();
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  /* ================= CLIENT-SIDE FILTER + SEARCH ================= */
  const filteredComplaints = complaints.filter((c) => {
    const matchType = type ? c.type === type : true;
    const matchHostel = hostel ? c.hostel?._id === hostel : true;
    const matchYear = year
      ? new Date(c.createdAt).getFullYear().toString() === year
      : true;

    const searchText =
      `${c.student?.name} ${c.student?.collegeId}`.toLowerCase();
    const matchSearch = searchText.includes(search.toLowerCase());

    return matchType && matchHostel && matchYear && matchSearch;
  });

  useEffect(() => {
    fetchComplaints();
    fetchHostels();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* SIDEBAR */}
      <aside className="w-64 fixed left-0 top-0 h-full bg-[#0F172A] text-white shadow-lg z-50">
        <Sidebar />
      </aside>

      {/* MAIN */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">

        <Navbar />

        <main className="flex-1 px-10 pt-24 pb-10 max-w-7xl mx-auto w-full">

          <h1 className="text-3xl font-bold mb-6">Complaints Management</h1>

          {/* FILTERS */}
          <div className="bg-white p-6 rounded-xl shadow mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">

            <select value={type} onChange={(e) => setType(e.target.value)}
              className="border p-2 rounded-lg">
              <option value="">All Types</option>
              <option>Cleanliness</option>
              <option>Electricity</option>
              <option>Internet</option>
              <option>Furniture</option>
              <option>Security</option>
            </select>

            <select value={hostel} onChange={(e) => setHostel(e.target.value)}
              className="border p-2 rounded-lg">
              <option value="">All Hostels</option>
              {hostels.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name}
                </option>
              ))}
            </select>

            <select value={year} onChange={(e) => setYear(e.target.value)}
              className="border p-2 rounded-lg">
              <option value="">All Years</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>

            <input
              type="text"
              placeholder="Search by student name or roll..."
              className="border p-2 rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto bg-white border rounded-xl shadow">

            {loading ? (
              <p className="p-6">Loading complaints...</p>
            ) : (
              <table className="min-w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3">Student</th>
                    <th className="px-6 py-3">Hostel</th>
                    <th className="px-6 py-3">Room</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredComplaints.map((c) => (
                    <tr key={c._id} className="border-b hover:bg-gray-50">

                      <td className="px-6 py-4">
                        <div className="font-semibold">{c.student?.name}</div>
                        <div className="text-sm text-gray-600">
                          {c.student?.collegeId}
                        </div>
                      </td>

                      <td className="px-6 py-4">{c.hostel?.name}</td>
                      <td className="px-6 py-4">
                        {c.room?.formattedRoom || c.room?.roomIndex}
                      </td>
                      <td className="px-6 py-4">{c.type}</td>

                      <td className="px-6 py-4 text-gray-600">
                        {new Date(c.createdAt).toLocaleDateString("en-IN")}
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          c.status === "Resolved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {c.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 flex gap-2 justify-center">
                        <button
                          onClick={() => navigate(`/complaints/${c._id}`)}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          View
                        </button>

                        {c.status === "Pending" && (
                          <button
                            onClick={() => resolveComplaint(c._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded"
                          >
                            Resolve
                          </button>
                        )}

                        <button
                          onClick={() => deleteComplaint(c._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>

                    </tr>
                  ))}

                  {filteredComplaints.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center p-6 text-gray-500">
                        No complaints found
                      </td>
                    </tr>
                  )}
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

export default Complaints;
