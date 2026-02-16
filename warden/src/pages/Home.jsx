import React from "react";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";

const Home = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 fixed left-0 top-0 h-full z-50">
        <Sidebar />
      </aside>

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">

        {/* NAVBAR */}
        <Navbar />

        {/* MAIN CONTENT */}
        <main className="flex-1 px-10 pt-24 pb-10 max-w-7xl mx-auto w-full">

          <h1 className="text-3xl font-bold mb-2">Warden Dashboard</h1>

          <p className="text-gray-600 mb-8">
            Welcome, Warden. Here is the overview of your assigned hostel management tasks.
          </p>

          {/* DASHBOARD CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

            <div className="bg-white shadow-md rounded-xl p-6">
              <p className="text-gray-600 text-sm">Total Students</p>
              <h2 className="text-4xl font-bold text-blue-600 mt-2">420</h2>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6">
              <p className="text-gray-600 text-sm">Pending Complaints</p>
              <h2 className="text-4xl font-bold text-red-600 mt-2">18</h2>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6">
              <p className="text-gray-600 text-sm">Vacant Rooms</p>
              <h2 className="text-4xl font-bold text-green-600 mt-2">32</h2>
            </div>

          </div>

          {/* QUICK ACTIONS */}
          <h2 className="text-2xl font-semibold mb-5">Quick Actions</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="bg-blue-500 text-white p-6 rounded-xl shadow hover:bg-blue-600 cursor-pointer">
              <h3 className="text-lg font-semibold">View Students</h3>
              <p className="text-sm mt-1 opacity-90">Check hostel students</p>
            </div>

            <div className="bg-green-500 text-white p-6 rounded-xl shadow hover:bg-green-600 cursor-pointer">
              <h3 className="text-lg font-semibold">Manage Rooms</h3>
              <p className="text-sm mt-1 opacity-90">Add or update rooms</p>
            </div>

            <div className="bg-yellow-500 text-white p-6 rounded-xl shadow hover:bg-yellow-600 cursor-pointer">
              <h3 className="text-lg font-semibold">Address Complaints</h3>
              <p className="text-sm mt-1 opacity-90">Resolve student complaints</p>
            </div>

            <div className="bg-purple-500 text-white p-6 rounded-xl shadow hover:bg-purple-600 cursor-pointer">
              <h3 className="text-lg font-semibold">View Reports</h3>
              <p className="text-sm mt-1 opacity-90">Check hostel analytics</p>
            </div>

          </div>

        </main>

        {/* FOOTER */}
        <Footer />

      </div>
    </div>
  );
};

export default Home;
