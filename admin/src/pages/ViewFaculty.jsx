import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";

const ViewFaculty = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Branches");
  const [designationFilter, setDesignationFilter] = useState("All Branches");

  // 🔹 FIXED FULL DEPARTMENTS LIST
  const allDepartments = [
    "All Branches",
    "Computer Science and Engineering",
    "Electronics and Communication Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Metallurgical & Materials Engineering",
    "Architecture & Planning",
    "Management Studies",
    "Physics",
    "Chemistry",
    "Mathematics",
    "Humanities & Social Sciences",
  ];

  // 🔹 FIXED FULL DESIGNATIONS LIST
  const allDesignations = [
    "All Designations",
    "Assistant Professor",
    "Associate Professor",
    "Professor",
  ];

  const fetchFaculty = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get("http://localhost:3000/faculty/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setFacultyList(res.data.allFaculty);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  // 🔹 Final Filter
  const filteredFaculty = facultyList.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase()) ||
      f.department.toLowerCase().includes(search.toLowerCase()) ||
      f.employeeId.toLowerCase().includes(search.toLowerCase());

    const matchesDept = deptFilter === "All Branches" || f.department === deptFilter;
    const matchesDesignation =
      designationFilter === "All Branches" || f.designation === designationFilter;

    return matchesSearch && matchesDept && matchesDesignation;
  });

  return (
    <div>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-10 bg-gray-100 min-h-screen">
          <h1 className="text-3xl font-bold mb-6">View Faculty</h1>

          {/* 🔍 Search + Dropdown Filters */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search by name, email, department, or ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border rounded-md w-full focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            {/* Department Dropdown */}
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {allDepartments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Designation Dropdown */}
            <select
              value={designationFilter}
              onChange={(e) => setDesignationFilter(e.target.value)}
              className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {allDesignations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* 📄 Table */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-indigo-100 text-indigo-800">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Employee ID</th>
                  <th className="px-4 py-3 text-left">Department</th>
                  <th className="px-4 py-3 text-left">Designation</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6">
                      Loading...
                    </td>
                  </tr>
                ) : filteredFaculty.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6">
                      No faculty found.
                    </td>
                  </tr>
                ) : (
                  filteredFaculty.map((f) => (
                    <tr key={f._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{f.name}</td>
                      <td className="px-4 py-3">{f.email}</td>
                      <td className="px-4 py-3">{f.employeeId}</td>
                      <td className="px-4 py-3">{f.department}</td>
                      <td className="px-4 py-3">{f.designation}</td>

                      <td className="px-4 py-3 text-center">
                        <button className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-sm">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ViewFaculty;
