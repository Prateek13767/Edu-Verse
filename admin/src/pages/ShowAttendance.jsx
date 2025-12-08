import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const ShowAttendance = () => {
  const [offerings, setOfferings] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [branches, setBranches] = useState([]);
  const [faculties, setFaculties] = useState([]);

  const [filters, setFilters] = useState({
    branch: "",
    semester: "",
    year: "",
    search: "",
    coordinator: "",
    instructor: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchOfferings();
    fetchFaculties();
  }, []);

  const fetchOfferings = async () => {
    try {
      const res = await axios.get("http://localhost:3000/courseoffering/");
      setOfferings(res.data.allOfferings || []);
      setFiltered(res.data.allOfferings || []);

      const allBranches = new Set();
      res.data.allOfferings.forEach((o) => {
        o.branches.forEach((b) => allBranches.add(b));
      });
      setBranches([...allBranches]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFaculties = async () => {
    try {
      const res = await axios.get("http://localhost:3000/faculty/");
      setFaculties(res.data.allFaculty || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let data = offerings;

    if (filters.branch) {
      data = data.filter((o) => o.branches.includes(filters.branch));
    }
    if (filters.semester) {
      data = data.filter((o) => o.semester == filters.semester);
    }
    if (filters.year) {
      data = data.filter((o) => o.year == filters.year);
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      data = data.filter(
        (o) =>
          o.course?.code?.toLowerCase().includes(s) ||
          o.course?.name?.toLowerCase().includes(s)
      );
    }
    if (filters.coordinator) {
      data = data.filter((o) => o.coordinator?._id === filters.coordinator);
    }
    if (filters.instructor) {
      data = data.filter((o) =>
        o.instructors?.some((i) => i?._id === filters.instructor)
      );
    }

    setFiltered(data);
  }, [filters, offerings]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 p-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6">
            View Course Offerings
          </h2>

          {/* FILTERS */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6 p-4 bg-white shadow-lg rounded-lg">
            <input
              type="text"
              placeholder="Search course code or name"
              className="border p-2 rounded"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />

            <select
              className="border p-2 rounded"
              value={filters.branch}
              onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
            >
              <option value="">Branch</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              className="border p-2 rounded"
              value={filters.semester}
              onChange={(e) =>
                setFilters({ ...filters, semester: e.target.value })
              }
            >
              <option value="">Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              className="border p-2 rounded"
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            >
              <option value="">Year</option>
              {[2021, 2022, 2023, 2024, 2025].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <select
              className="border p-2 rounded"
              value={filters.coordinator}
              onChange={(e) =>
                setFilters({ ...filters, coordinator: e.target.value })
              }
            >
              <option value="">Coordinator</option>
              {faculties.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name}
                </option>
              ))}
            </select>

            <select
              className="border p-2 rounded"
              value={filters.instructor}
              onChange={(e) =>
                setFilters({ ...filters, instructor: e.target.value })
              }
            >
              <option value="">Instructor</option>
              {faculties.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* TABLE WITHOUT SCHEDULE */}
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-indigo-100 text-indigo-700">
                <tr>
                  <th className="px-4 py-2">Course</th>
                  <th className="px-4 py-2">Semester</th>
                  <th className="px-4 py-2">Year</th>
                  <th className="px-4 py-2">Branches</th>
                  <th className="px-4 py-2">Coordinator</th>
                  <th className="px-4 py-2">Instructors</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((o) => (
                  <tr
                    key={o._id}
                    className="border-b hover:bg-indigo-50 cursor-pointer"
                    onClick={() => navigate(`/admin/attendance/${o._id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold">{o.course?.code}</div>
                      <div className="text-sm text-gray-600">
                        {o.course?.name}
                      </div>
                    </td>

                    <td className="px-4 py-3">{o.semester}</td>
                    <td className="px-4 py-3">{o.year}</td>
                    <td className="px-4 py-3">{o.branches.join(", ")}</td>
                    <td className="px-4 py-3">{o.coordinator?.name}</td>

                    <td className="px-4 py-3">
                      {o.instructors?.map((i) => i?.name).join(", ") || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ShowAttendance;
