import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { AllContext } from "../context/AllContext";
import axios from "axios";
import { toast } from "react-toastify";

const Reports = () => {
  const { hostelId, backendUrl } = useContext(AllContext);

  const [roomStats, setRoomStats] = useState({
    totalCapacity: 0,
    totalOccupied: 0,
    totalVacant: 0,
  });

  const [complaintSummary, setComplaintSummary] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    byCategory: {}, // { Electricity: { total, pending, resolved } }
  });

  const [loading, setLoading] = useState(true);

  // ================= PROCESS ROOM DATA =================
  const processRoomResponse = (data) => {
    if (data?.summary) {
      const { totalCapacity, totalOccupied, totalVacant } = data.summary;
      return {
        totalCapacity: totalCapacity || 0,
        totalOccupied: totalOccupied || 0,
        totalVacant:
          totalVacant ??
          (totalCapacity || 0) - (totalOccupied || 0),
      };
    }

    const rooms = Array.isArray(data?.rooms) ? data.rooms : [];

    let totalCapacity = 0;
    let totalOccupied = 0;

    rooms.forEach((room) => {
      totalCapacity += room.capacity || 0;

      const occupied =
        typeof room.occupied === "number"
          ? room.occupied
          : room.occupants?.length || 0;

      totalOccupied += occupied;
    });

    return {
      totalCapacity,
      totalOccupied,
      totalVacant: totalCapacity - totalOccupied,
    };
  };

  // ================= FETCH ROOM REPORT =================
  const fetchRoomReport = async () => {
    if (!hostelId) return;

    try {
      const res = await axios.get(
        `${backendUrl}/room/hostel/${hostelId}`
      );

      if (!res.data?.success) {
        toast.error("Failed to fetch room report");
        return;
      }

      setRoomStats(processRoomResponse(res.data));
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ================= FETCH COMPLAINT REPORT =================
  const fetchComplaintReport = async () => {
    if (!hostelId) return;

    try {
      const res = await axios.post(
        `${backendUrl}/complaint/filter`,
        { hostel: hostelId }
      );

      if (!res.data?.success) {
        toast.error("Failed to fetch complaint report");
        return;
      }

      const complaints = Array.isArray(res.data.complaintDetails)
        ? res.data.complaintDetails
        : [];

      const summary = {
        total: complaints.length,
        pending: 0,
        resolved: 0,
        byCategory: {},
      };

      complaints.forEach((c) => {
        const category = c.type; // Electricity, Water, etc.
        const status = c.status; // ONLY Pending or Resolved

        if (!summary.byCategory[category]) {
          summary.byCategory[category] = {
            total: 0,
            pending: 0,
            resolved: 0,
          };
        }

        summary.byCategory[category].total += 1;

        if (status === "Resolved") {
          summary.resolved += 1;
          summary.byCategory[category].resolved += 1;
        } else {
          summary.pending += 1;
          summary.byCategory[category].pending += 1;
        }
      });

      setComplaintSummary(summary);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ================= LOAD DATA =================
  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      await Promise.all([
        fetchRoomReport(),
        fetchComplaintReport(),
      ]);
      setLoading(false);
    };

    loadReports();
  }, [hostelId]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <aside className="w-64 fixed left-0 top-0 h-full">
          <Sidebar />
        </aside>
        <div className="flex-1 ml-64 flex items-center justify-center">
          <p className="text-lg text-gray-600">
            Loading reports...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 fixed left-0 top-0 h-full z-50">
        <Sidebar />
      </aside>

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 px-14 pt-28 pb-14 max-w-7xl mx-auto w-full">
          <h1 className="text-4xl font-bold mb-3">
            Hostel Reports
          </h1>
          <p className="text-gray-600 mb-10 text-lg">
            Occupancy & complaint analytics for your hostel
          </p>

          {/* ROOM STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-14">
            <StatCard label="Total Capacity" value={roomStats.totalCapacity} color="purple" />
            <StatCard label="Occupied" value={roomStats.totalOccupied} color="blue" />
            <StatCard label="Vacant" value={roomStats.totalVacant} color="green" />
          </div>

          {/* COMPLAINT OVERALL */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
            <StatCard label="Total Complaints" value={complaintSummary.total} />
            <StatCard label="Pending" value={complaintSummary.pending} color="yellow" />
            <StatCard label="Resolved" value={complaintSummary.resolved} color="green" />
          </div>

          {/* CATEGORY WISE */}
          <div className="bg-white shadow-lg rounded-2xl p-10">
            <h2 className="text-2xl font-semibold mb-6">
              Complaints by Category
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {Object.keys(complaintSummary.byCategory).length === 0 ? (
                <p className="text-gray-500">No complaints found</p>
              ) : (
                Object.entries(complaintSummary.byCategory).map(
                  ([category, data]) => (
                    <div
                      key={category}
                      className="p-6 bg-gray-50 rounded-xl shadow-sm"
                    >
                      <h3 className="text-lg font-semibold mb-2">
                        {category}
                      </h3>
                      <p>Total: {data.total}</p>
                      <p className="text-yellow-600">
                        Pending: {data.pending}
                      </p>
                      <p className="text-green-600">
                        Resolved: {data.resolved}
                      </p>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

// ================= REUSABLE STAT CARD =================
const StatCard = ({ label, value, color }) => (
  <div className="bg-white shadow-lg rounded-2xl p-8 text-center">
    <p className="text-gray-500 text-sm">{label}</p>
    <h2
      className={`text-4xl font-bold mt-2 ${
        color ? `text-${color}-600` : ""
      }`}
    >
      {value}
    </h2>
  </div>
);

export default Reports;
