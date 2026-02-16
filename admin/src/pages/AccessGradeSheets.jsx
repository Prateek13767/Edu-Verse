import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const AccessGradeSheets = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [semFilter, setSemFilter] = useState("All");

  const navigate = useNavigate();

  const branches = [
    "All",
    "Computer Science & Engineering",
    "Electronics & Communication Engineering",
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

  const semesters = ["All", 1, 2, 3, 4, 5, 6, 7, 8];

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("http://localhost:3000/student/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setStudents(res.data.students);
      }
    } catch (err) {
      console.error("Fetch students error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.collegeId.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase());

    const matchesBranch =
      branchFilter === "All" || s.department === branchFilter;

    const matchesSem =
      semFilter === "All" || s.currentSem === Number(semFilter);

    return matchesSearch && matchesBranch && matchesSem;
  });

  return (
    <div>
      <Navbar />

      <div className="flex">
        <Sidebar active="students" />

        <div className="flex-1 p-10 bg-gray-100 min-h-screen">
          <h1 className="text-3xl font-bold mb-6">View Students</h1>

          {/* 🔍 Search + Filters */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by name, email, ID, branch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border rounded-md w-full"
            />

            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="px-4 py-2 border rounded-md"
            >
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              value={semFilter}
              onChange={(e) => setSemFilter(e.target.value)}
              className="px-4 py-2 border rounded-md"
            >
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>

          {/* 📋 Table */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-indigo-100 text-indigo-800">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">College ID</th>
                  <th className="px-4 py-3 text-left">Branch</th>
                  <th className="px-4 py-3 text-left">Current Sem</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6">
                      Loading...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr
                      key={s._id}
                      title="Click to view grade sheets"
                      className="border-b hover:bg-indigo-50 cursor-pointer transition"
                      onClick={() =>
                        navigate(`/admin/gradesheets/${s._id}`)
                      }
                    >
                      <td className="px-4 py-3">{s.name}</td>
                      <td className="px-4 py-3">{s.email}</td>
                      <td className="px-4 py-3">{s.collegeId}</td>
                      <td className="px-4 py-3">{s.department}</td>
                      <td className="px-4 py-3">{s.currentSem}</td>
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

export default AccessGradeSheets;
