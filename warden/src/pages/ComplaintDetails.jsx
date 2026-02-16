import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { AllContext } from "../context/AllContext";

const ComplaintDetails = () => {
  const { complaintId } = useParams();
  const { backendUrl, navigate } = useContext(AllContext);

  const [complaint, setComplaint] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ================= FETCH COMPLAINT =================
  const fetchComplaint = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/complaint/${complaintId}`
      );

      const data = res.data.complaintDetails;
      setComplaint(data);
      setRemarks(data?.remarks || "");
    } catch (error) {
      console.error("Fetch complaint error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [complaintId]);

  // ================= UPDATE STATUS =================
  const handleCloseComplaint = async () => {
    if (!remarks.trim()) {
      alert("Please enter remarks before closing the complaint");
      return;
    }

    try {
      setUpdating(true);

      const res = await axios.put(
        `${backendUrl}/complaint/status/update`,
        {
          complaint: complaint._id,
          status: "Resolved",
          remarks: remarks,
        }
      );

      if (res.data.success) {
        // refresh complaint data
        setComplaint(res.data.complaintDetails);
      } else {
        alert(res.data.message || "Failed to update complaint");
      }
    } catch (error) {
      console.error("Update complaint error:", error);
      alert("Something went wrong while updating");
    } finally {
      setUpdating(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <aside className="w-64 fixed left-0 top-0 h-full z-50">
          <Sidebar />
        </aside>

        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-lg text-gray-600">
              Loading complaint details...
            </p>
          </main>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <aside className="w-64 fixed left-0 top-0 h-full z-50">
          <Sidebar />
        </aside>

        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-lg text-gray-600">
              Complaint not found
            </p>
          </main>
        </div>
      </div>
    );
  }

  const roomDisplay =
    complaint.room && typeof complaint.room === "object"
      ? complaint.room.formattedRoom
      : complaint.room || "—";

  // ================= UI =================
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 fixed left-0 top-0 h-full z-50">
        <Sidebar />
      </aside>

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 px-14 pt-28 pb-14 max-w-5xl mx-auto w-full">
          <button
            onClick={() => navigate("/complaints")}
            className="text-sm text-blue-600 mb-6 hover:underline"
          >
            ← Back to Complaints
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-10">
            <h1 className="text-3xl font-bold mb-8">
              Complaint Details
            </h1>

            <div className="grid grid-cols-2 gap-6 text-gray-700 mb-10">
              <div>
                <p className="font-semibold">Student</p>
                <p>{complaint.student?.name || "—"}</p>
                <p className="text-sm text-gray-500">
                  {complaint.student?.collegeId}
                </p>
              </div>

              <div>
                <p className="font-semibold">Hostel</p>
                <p>{complaint.hostel?.name || "—"}</p>
              </div>

              <div>
                <p className="font-semibold">Room</p>
                <p>{roomDisplay}</p>
              </div>

              <div>
                <p className="font-semibold">Category</p>
                <p>{complaint.type}</p>
              </div>

              <div>
                <p className="font-semibold">Date</p>
                <p>
                  {new Date(complaint.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="font-semibold">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ${
                    complaint.status === "Resolved"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {complaint.status}
                </span>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <p className="font-semibold mb-2">
                Complaint Description
              </p>
              <p className="bg-gray-50 p-4 rounded-lg">
                {complaint.description || "—"}
              </p>
            </div>

            {/* REMARKS INPUT */}
            {complaint.status === "Pending" && !complaint.remarks && (
              <div className="mt-10">
                <p className="font-semibold mb-2">
                  Resolution Remarks
                </p>

                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={4}
                  className="w-full border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter remarks to resolve this complaint..."
                />

                <button
                  onClick={handleCloseComplaint}
                  disabled={updating}
                  className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 cursor-pointer"
                >
                  {updating ? "Closing..." : "Close Complaint"}
                </button>
              </div>
            )}

            {/* REMARKS DISPLAY */}
            {complaint.status === "Resolved" && complaint.remarks && (
              <div className="mt-8">
                <p className="font-semibold mb-2">
                  Resolution Remarks
                </p>
                <p className="bg-green-50 p-4 rounded-lg text-green-800">
                  {complaint.remarks}
                </p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default ComplaintDetails;
