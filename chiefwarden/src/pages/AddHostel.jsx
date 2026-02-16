import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";

const AddHostel = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "",
    totalRooms: "",
    totalCapacity: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${backendUrl}/hostel/create`, formData);

      if (data.success) {
        alert("Hostel added successfully!");

        setFormData({
          name: "",
          code: "",
          type: "",
          totalRooms: "",
          totalCapacity: "",
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Error adding hostel");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      
      {/* SIDEBAR */}
      <aside className="w-64 fixed left-0 top-0 h-full bg-[#0F172A] text-white shadow-lg z-50">
        <Sidebar />
      </aside>

      {/* RIGHT SIDE CONTENT */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">

        {/* NAVBAR */}
        <Navbar />

        {/* MAIN CONTENT */}
        <main className="flex-1 px-10 pt-24 pb-10 max-w-5xl mx-auto w-full">

          <h1 className="text-3xl font-bold mb-10 tracking-tight">Add New Hostel</h1>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 w-full">
            
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Hostel Name */}
              <div>
                <label className="block mb-1 font-medium text-gray-700">Hostel Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Example: Aryabhatta Hostel"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* Hostel Code */}
              <div>
                <label className="block mb-1 font-medium text-gray-700">Hostel Code</label>
                <input
                  type="text"
                  name="code"
                  placeholder="Example: H1, GH2"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* Hostel Type */}
              <div>
                <label className="block mb-1 font-medium text-gray-700">Hostel Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Select Type</option>
                  <option value="boys">Boys Hostel</option>
                  <option value="girls">Girls Hostel</option>
                </select>
              </div>

              {/* Total Rooms */}
              <div>
                <label className="block mb-1 font-medium text-gray-700">Total Rooms</label>
                <input
                  type="number"
                  name="totalRooms"
                  placeholder="Example: 120"
                  value={formData.totalRooms}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* Total Capacity */}
              <div>
                <label className="block mb-1 font-medium text-gray-700">Total Capacity</label>
                <input
                  type="number"
                  name="totalCapacity"
                  placeholder="Example: 360"
                  value={formData.totalCapacity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Add Hostel
              </button>

            </form>

          </div>

        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AddHostel;
