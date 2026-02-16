import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const Reports = () => {
  const [summary, setSummary] = useState({
    totalHostels: 10,
    totalRooms: 900,
    occupiedRooms: 720,
    pendingComplaints: 27,
    resolvedComplaints: 320,
    yearlyAllocations: 1800,
  });

  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* SIDEBAR */}
      <aside className="w-64 fixed left-0 top-0 h-full bg-[#0F172A] text-white shadow-lg z-50">
        <Sidebar />
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">

        {/* NAVBAR */}
        <Navbar />

        {/* PAGE CONTENT */}
        <main className="flex-1 px-10 pt-24 pb-10 max-w-7xl mx-auto w-full">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>

            <div className="flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow">
                Export PDF
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg shadow">
                Export Excel
              </button>
            </div>
          </div>

          <p className="text-gray-600 mb-8">
            View hostel occupancy, complaints, and annual allocation statistics.
          </p>

          {/* REPORT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Total Hostels */}
            <div className="bg-white shadow-md rounded-xl p-6 border">
              <p className="text-gray-600 text-sm">Total Hostels</p>
              <h2 className="text-4xl font-bold text-blue-600 mt-2">
                {summary.totalHostels}
              </h2>
            </div>

            {/* Occupancy */}
            <div className="bg-white shadow-md rounded-xl p-6 border">
              <p className="text-gray-600 text-sm">Room Occupancy</p>
              <h2 className="text-3xl font-bold text-indigo-600 mt-2">
                {summary.occupiedRooms}/{summary.totalRooms}
              </h2>
            </div>

            {/* Complaints Pending */}
            <div className="bg-white shadow-md rounded-xl p-6 border">
              <p className="text-gray-600 text-sm">Pending Complaints</p>
              <h2 className="text-4xl font-bold text-red-600 mt-2">
                {summary.pendingComplaints}
              </h2>
            </div>

            {/* Complaints Resolved */}
            <div className="bg-white shadow-md rounded-xl p-6 border">
              <p className="text-gray-600 text-sm">Resolved Complaints</p>
              <h2 className="text-3xl font-bold text-green-600 mt-2">
                {summary.resolvedComplaints}
              </h2>
            </div>

            {/* Yearly Allocations */}
            <div className="bg-white shadow-md rounded-xl p-6 border">
              <p className="text-gray-600 text-sm">This Year's Allocations</p>
              <h2 className="text-3xl font-bold text-purple-600 mt-2">
                {summary.yearlyAllocations}
              </h2>
            </div>

          </div>

          {/* TABLE: Yearly Allocation Summary */}
          <h2 className="text-2xl font-semibold mt-12 mb-5">Yearly Allocation Summary</h2>

          <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-md">
            <table className="min-w-full text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 font-semibold">Year</th>
                  <th className="px-6 py-3 font-semibold">Applicants</th>
                  <th className="px-6 py-3 font-semibold">Allocated</th>
                  <th className="px-6 py-3 font-semibold">Vacated</th>
                </tr>
              </thead>
              <tbody>
                {[2025, 2024, 2023].map((year) => (
                  <tr key={year} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4">{year}</td>
                    <td className="px-6 py-4">800</td>
                    <td className="px-6 py-4">760</td>
                    <td className="px-6 py-4">120</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </main>

        {/* FOOTER */}
        <Footer />

      </div>
    </div>
  );
};

export default Reports;
