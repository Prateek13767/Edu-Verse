import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import Input from "../components/Input";
import axios from "axios";

const AddFaculty = () => {
  const [faculty, setFaculty] = useState({
    name: "",
    email: "",
    password: "",
    employeeId: "",
    designation: "",
    department: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFaculty({ ...faculty, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.post(
        "http://localhost:3000/admin/add-faculty",
        faculty,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setMsg("Faculty added successfully!");

        setFaculty({
          name: "",
          email: "",
          password: "",
          employeeId: "",
          designation: "",
          department: "",
          phone: "",
          address: "",
        });
      } else {
        setMsg(res.data.message);
      }
    } catch (err) {
      console.log(err);
      setMsg("Failed to add faculty.");
    }

    setLoading(false);
  };

  return (
    <div>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-10 bg-gray-100 min-h-screen">
          <h1 className="text-3xl font-bold mb-6">Add Faculty</h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl"
          >
            <Input
              label="Full Name"
              name="name"
              value={faculty.name}
              onChange={handleChange}
              placeholder="Enter full name"
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={faculty.email}
              onChange={handleChange}
              placeholder="Enter email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={faculty.password}
              onChange={handleChange}
              placeholder="Enter password"
            />

            <Input
              label="Employee ID"
              name="employeeId"
              value={faculty.employeeId}
              onChange={handleChange}
              placeholder="Enter employee ID"
            />

            <div className="flex flex-col gap-1 mb-4">
              <label className="text-sm font-semibold text-gray-700">Designation</label>
              <select
                name="designation"
                value={faculty.designation}
                onChange={handleChange}
                className="border px-3 py-2 rounded-md focus:ring-2 outline-none focus:ring-indigo-500"
              >
                <option value="">Select designation</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
              </select>
            </div>

            <Input
              label="Department"
              name="department"
              value={faculty.department}
              onChange={handleChange}
              placeholder="e.g. CSE, ECE, ME"
            />

            <Input
              label="Phone"
              name="phone"
              value={faculty.phone}
              onChange={handleChange}
              placeholder="Enter phone"
            />

            <Input
              label="Address"
              name="address"
              value={faculty.address}
              onChange={handleChange}
              placeholder="Enter address"
            />

            {msg && (
              <p className="mt-3 text-center text-red-500 font-semibold">
                {msg}
              </p>
            )}

            <button
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-lg mt-5 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Faculty"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AddFaculty;
