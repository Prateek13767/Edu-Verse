import React, { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { AllContext } from "../context/AllContext";

const Complaints = () => {
  const { backendUrl, hostelId,navigate } = useContext(AllContext);

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH COMPLAINTS =================
  const fetchComplaints = async () => {
    if (!hostelId) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `${backendUrl}/complaint/filter`,
        { hostel: hostelId }
      );

      setComplaints(res.data.complaintDetails || []);
    } catch (error) {
      console.error("Fetch complaints error:", error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= EFFECT =================
  useEffect(() => {
    if (hostelId) {
      fetchComplaints();
    }
  }, [hostelId]);

  // ================= LOADING HOSTEL =================
  if (!hostelId) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <aside className="w-64 fixed left-0 top-0 h-full z-50">
          <Sidebar />
        </aside>

        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-lg text-gray-600">
              Loading hostel details...
            </p>
          </main>
        </div>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 fixed left-0 top-0 h-full z-50">
        <Sidebar />
      </aside>

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 px-14 pt-28 pb-14 max-w-7xl mx-auto w-full">
          <h1 className="text-4xl font-bold mb-3">Complaints</h1>
          <p className="text-gray-600 mb-10 text-lg">
            Manage and resolve hostel complaints submitted by students.
          </p>

          <div className="bg-white rounded-2xl shadow-lg p-10 overflow-x-auto">
            {loading ? (
              <p className="text-center py-10 text-gray-500">
                Fetching complaints...
              </p>
            ) : (
              <table className="min-w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Hostel</th>
                    <th className="px-6 py-4">Room</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {complaints.map((c) => {
                    const roomDisplay =
                      c.room && typeof c.room === "object"
                        ? c.room.formattedRoom
                        : c.room || "—";

                    return (
                      <tr onClick={()=> {navigate(`/complaints/${c._id}`)}} key={c._id} className="bg-gray-50 hover:bg-gray-100">
                        <td className="px-6 py-4">
                          <div className="font-semibold">
                            {c.student?.name || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {c.student?.collegeId || ""}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {c.hostel?.name || "—"}
                        </td>

                        <td className="px-6 py-4">
                          {roomDisplay}
                        </td>

                        <td className="px-6 py-4">
                          {c.type}
                        </td>

                        <td className="px-6 py-4">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              c.status === "resolved"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {complaints.length === 0 && !loading && (
                    <tr>
                      <td colSpan="6" className="text-center py-10 text-gray-500">
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
