import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const ComplaintDetails = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState("");
  const [resolving, setResolving] = useState(false);

  // ================= FETCH COMPLAINT =================
  const fetchComplaint = async () => {
    try {
      const res = await axios.get(`${backendUrl}/complaint/${complaintId}`);
      const data = res.data.complaintDetails;

      setComplaint(data);
      setRemarks(data?.remarks || ""); // ✅ FIXED HERE

    } catch (error) {
      console.error("Fetch complaint error", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= RESOLVE COMPLAINT =================
  const resolveComplaint = async () => {
    if (!remarks.trim()) {
      alert("Please enter remarks before resolving the complaint");
      return;
    }

    try {
      setResolving(true);

      await axios.put(`${backendUrl}/complaint/status/update`, {
        complaint: complaintId,
        status: "Resolved",
        remarks: remarks // ✅ FIXED HERE
      });

      fetchComplaint(); // refresh details

    } catch (error) {
      console.error("Resolve complaint error", error);
    } finally {
      setResolving(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [complaintId]);

  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* SIDEBAR */}
      <aside className="w-64 fixed left-0 top-0 h-full bg-[#0F172A] text-white shadow-lg z-50">
        <Sidebar />
      </aside>

      {/* MAIN */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">

        <Navbar />

        <main className="flex-1 px-10 pt-24 pb-10 max-w-4xl mx-auto w-full">

          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-blue-600 hover:underline"
          >
            ← Back to Complaints
          </button>

          {loading ? (
            <p>Loading complaint...</p>
          ) : !complaint ? (
            <p className="text-red-600">Complaint not found</p>
          ) : (
            <div className="bg-white rounded-xl shadow p-8">

              <h1 className="text-2xl font-bold mb-6">
                Complaint Details
              </h1>

              {/* BASIC DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <p className="text-gray-500">Student</p>
                  <p className="font-semibold">{complaint.student?.name}</p>
                  <p className="text-sm text-gray-600">
                    {complaint.student?.collegeId}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    complaint.status === "Resolved"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {complaint.status}
                  </span>
                </div>

                <div>
                  <p className="text-gray-500">Hostel</p>
                  <p className="font-semibold">{complaint.hostel?.name}</p>
                </div>

                <div>
                  <p className="text-gray-500">Room</p>
                  <p className="font-semibold">
                    {complaint.room?.formattedRoom || complaint.room?.roomIndex}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Type</p>
                  <p className="font-semibold">{complaint.type}</p>
                </div>

                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-semibold">
                    {new Date(complaint.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="mt-6">
                <p className="text-gray-500 mb-2">Description</p>
                <div className="bg-gray-100 p-4 rounded">
                  {complaint.description}
                </div>
              </div>

              {/* REMARKS (ALWAYS VISIBLE) */}
              <div className="mt-6">
                <p className="text-gray-500 mb-2">
                  {complaint.status === "Resolved"
                    ? "Resolution Remarks"
                    : "Enter Resolution Remarks"}
                </p>

                <textarea
                  rows="4"
                  className={`w-full border rounded-lg p-3 ${
                    complaint.status === "Resolved"
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  readOnly={complaint.status === "Resolved"}
                />
              </div>

              {/* RESOLVE BUTTON */}
              {complaint.status === "Pending" && (
                <div className="mt-6">
                  <button
                    onClick={resolveComplaint}
                    disabled={resolving}
                    className={`px-6 py-2 rounded text-white ${
                      resolving
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {resolving ? "Resolving..." : "Resolve Complaint"}
                  </button>
                </div>
              )}

            </div>
          )}

        </main>

        <Footer />
      </div>
    </div>
  );
};

export default ComplaintDetails;
