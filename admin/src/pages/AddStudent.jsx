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
    fathersName: "",
    fatherPhone: "",
    gender: "",
    city: "",
    state: "",
    age: "",
    dob: "",
    batch: "",
    programme: "",
    department: "",
    currentSem: ""
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
        "http://localhost:3000/student/register",
        {
          ...student,
          phone: Number(student.phone),
          fatherPhone: Number(student.fatherPhone),
          age: Number(student.age),
          batch: Number(student.batch),
          currentSem: Number(student.currentSem)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
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
          fathersName: "",
          fatherPhone: "",
          gender: "",
          city: "",
          state: "",
          age: "",
          dob: "",
          batch: "",
          programme: "",
          department: "",
          currentSem: ""
        });
      } else {
        setMsg(res.data.message);
      }
    } catch (err) {
      console.error(err);
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
            className="bg-white p-8 rounded-xl shadow-md w-full max-w-3xl"
          >
            <div className="grid grid-cols-2 gap-4">

              <Input label="Full Name" name="name" value={student.name} onChange={handleChange} />
              <Input label="College ID" name="collegeId" value={student.collegeId} onChange={handleChange} />
              <Input label="Email" type="email" name="email" value={student.email} onChange={handleChange} />
              <Input label="Password" type="password" name="password" value={student.password} onChange={handleChange} />
              <Input label="Phone" name="phone" value={student.phone} onChange={handleChange} />
              <Input label="Father's Name" name="fathersName" value={student.fathersName} onChange={handleChange} />
              <Input label="Father Phone" name="fatherPhone" value={student.fatherPhone} onChange={handleChange} />

              {/* Gender */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Gender</label>
                <select name="gender" value={student.gender} onChange={handleChange}
                  className="border px-3 py-2 rounded-md">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <Input label="City" name="city" value={student.city} onChange={handleChange} />
              <Input label="State" name="state" value={student.state} onChange={handleChange} />

              <Input label="Age" type="number" name="age" value={student.age} onChange={handleChange} />
              <Input label="Date of Birth" type="date" name="dob" value={student.dob} onChange={handleChange} />
              <Input label="Batch" type="number" name="batch" value={student.batch} onChange={handleChange} />
              <Input label="Current Semester" type="number" name="currentSem" value={student.currentSem} onChange={handleChange} />

              {/* Programme */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Programme</label>
                <select name="programme" value={student.programme} onChange={handleChange}
                  className="border px-3 py-2 rounded-md">
                  <option value="">Select</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="MBA">MBA</option>
                  <option value="PhD">PhD</option>
                  <option value="M.Sc">M.Sc</option>
                </select>
              </div>

              {/* Department */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Department</label>
                <select name="department" value={student.department} onChange={handleChange}
                  className="border px-3 py-2 rounded-md">
                  <option value="">Select</option>
                  <option value="Computer Science and Engineering">Computer Science & Engineering</option>
                  <option value="Electronics and Communication Engineering">Electronics & Communication Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                </select>
              </div>

            </div>

            {msg && <p className="mt-3 text-center text-red-500">{msg}</p>}

            <button
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-md mt-6"
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
