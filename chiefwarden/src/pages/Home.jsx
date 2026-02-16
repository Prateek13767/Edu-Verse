import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* FIXED SIDEBAR */}
      <aside className="w-64 fixed left-0 top-0 h-full bg-[#0F172A] text-white shadow-lg z-50">
        <Sidebar />
      </aside>

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">

        {/* FIXED NAVBAR */}
        <Navbar />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 px-10 pt-24 pb-10 max-w-7xl mx-auto w-full">
          {/* ↑ pt-24 ensures content starts below fixed navbar */}

          {/* Title */}
          <h1 className="text-3xl font-bold mb-2">Chief Warden Dashboard</h1>
          <p className="text-gray-600 mb-10">
            Welcome, Chief Warden. Here is the overview and management panel.
          </p>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">

            <div className="bg-white shadow-md rounded-xl p-6">
              <p className="text-gray-600 text-sm">Total Hostels</p>
              <h2 className="text-4xl font-bold text-blue-600 mt-2">10</h2>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6">
              <p className="text-gray-600 text-sm">Total Students</p>
              <h2 className="text-4xl font-bold text-green-600 mt-2">5200</h2>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6">
              <p className="text-gray-600 text-sm">Pending Complaints</p>
              <h2 className="text-4xl font-bold text-red-600 mt-2">24</h2>
            </div>

          </div>

          {/* Quick Actions */}
          <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            <div className="bg-blue-500 text-white p-6 rounded-xl shadow hover:bg-blue-600 cursor-pointer">
              <h3 className="text-lg font-semibold">Add Hostel</h3>
              <p className="text-sm mt-1 opacity-90">Create a new hostel block</p>
            </div>

            <div className="bg-green-500 text-white p-6 rounded-xl shadow hover:bg-green-600 cursor-pointer">
              <h3 className="text-lg font-semibold">View Students</h3>
              <p className="text-sm mt-1 opacity-90">Check all registered students</p>
            </div>

            <div className="bg-yellow-500 text-white p-6 rounded-xl shadow hover:bg-yellow-600 cursor-pointer">
              <h3 className="text-lg font-semibold">Manage Rooms</h3>
              <p className="text-sm mt-1 opacity-90">Update room allocations</p>
            </div>

            <div className="bg-red-500 text-white p-6 rounded-xl shadow hover:bg-red-600 cursor-pointer">
              <h3 className="text-lg font-semibold">Complaints</h3>
              <p className="text-sm mt-1 opacity-90">Resolve student complaints</p>
            </div>

          </div>
        </main>

        {/* FOOTER (now stays at bottom always) */}
        <Footer />
      </div>
    </div>
  );
};

export default Home;
