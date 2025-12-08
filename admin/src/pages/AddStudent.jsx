import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import Input from "../components/Input";
import axios from "axios";

const AddStudent = () => {
  const [student, setStudent] = useState({
    name: "",
    collegeId: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    fathersName: "",
    address: "",
    currentSem: "",
    dob: "",
    batch: "",
    programme: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.post(
        "http://localhost:3000/admin/add-student",
        student,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setMsg("Student added successfully!");

        setStudent({
          name: "",
          collegeId: "",
          email: "",
          password: "",
          phone: "",
          age: "",
          fathersName: "",
          address: "",
          currentSem: "",
          dob: "",
          batch: "",
          programme: "",
          department: "",
        });
      } else {
        setMsg(res.data.message);
      }
    } catch (err) {
      console.log(err);
      setMsg("Failed to add student.");
    }

    setLoading(false);
  };

  return (
    <div>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-10 bg-gray-100 min-h-screen">
          <h1 className="text-3xl font-bold mb-6">Add Student</h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl"
          >
            <div className="grid grid-cols-2 gap-4">

              <Input
                label="Full Name"
                name="name"
                value={student.name}
                onChange={handleChange}
                placeholder="Enter full name"
              />

              <Input
                label="College ID"
                name="collegeId"
                value={student.collegeId}
                onChange={handleChange}
                placeholder="2023UCPxxxx"
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={student.email}
                onChange={handleChange}
                placeholder="Enter email"
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={student.password}
                onChange={handleChange}
                placeholder="Enter password"
              />

              <Input
                label="Phone"
                name="phone"
                value={student.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />

              <Input
                label="Age"
                name="age"
                type="number"
                value={student.age}
                onChange={handleChange}
                placeholder="Enter age"
              />

              <Input
                label="Father's Name"
                name="fathersName"
                value={student.fathersName}
                onChange={handleChange}
                placeholder="Enter father's name"
              />

              <Input
                label="Address"
                name="address"
                value={student.address}
                onChange={handleChange}
                placeholder="Enter address"
              />

              <Input
                label="Current Semester"
                name="currentSem"
                type="number"
                value={student.currentSem}
                onChange={handleChange}
                placeholder="1–8"
              />

              <Input
                label="Date of Birth"
                name="dob"
                type="date"
                value={student.dob}
                onChange={handleChange}
              />

              <Input
                label="Batch Year"
                name="batch"
                type="number"
                value={student.batch}
                onChange={handleChange}
                placeholder="e.g. 2022"
              />

              {/* Programme dropdown */}
              <div className="flex flex-col gap-1 mb-4">
                <label className="text-sm font-semibold text-gray-700">Programme</label>
                <select
                  name="programme"
                  value={student.programme}
                  onChange={handleChange}
                  className="border px-3 py-2 rounded-md focus:ring-2 outline-none focus:ring-indigo-500"
                >
                  <option value="">Select programme</option>
                  <option value="B.tech">B.Tech</option>
                  <option value="M.tech">M.Tech</option>
                  <option value="MBA">MBA</option>
                  <option value="PhD">PhD</option>
                  <option value="M.Sc">M.Sc</option>
                </select>
              </div>

              {/* Department dropdown */}
                <div className="flex flex-col gap-1 mb-4">
                <label className="text-sm font-semibold text-gray-700">Department</label>
                <select
                    name="department"
                    value={student.department}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded-md focus:ring-2 outline-none focus:ring-indigo-500"
                >
                    <option value="">Select Department</option>

                    {/* Engineering Departments */}
                    <option value="Computer Science and Engineering">Computer Science and Engineering (CSE)</option>
                    <option value="Electronics and Communication Engineering">Electronics and Communication Engineering (ECE)</option>
                    <option value="Electrical Engineering">Electrical Engineering (EE)</option>
                    <option value="Mechanical Engineering">Mechanical Engineering (ME)</option>
                    <option value="Civil Engineering">Civil Engineering (CE)</option>
                    <option value="Chemical Engineering">Chemical Engineering (CHE)</option>
                    <option value="Metallurgical and Materials Engineering">Metallurgical & Materials Engineering (MME)</option>
                    <option value="Architecture and Planning">Architecture & Planning</option>
                    <option value="Information Technology">Information Technology (IT)</option>
                    <option value="Artificial Intelligence and Data Science">AI & Data Science</option>

                    {/* Science Departments */}
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>

                    {/* Management & Humanities */}
                    <option value="Management Studies">Management Studies (MBA)</option>
                    <option value="Humanities and Social Sciences">Humanities & Social Sciences</option>
                </select>
                </div>


            </div>

            {msg && (
              <p className="mt-3 text-center text-red-500 font-semibold">{msg}</p>
            )}

            <button
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-lg mt-5 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Student"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AddStudent;
