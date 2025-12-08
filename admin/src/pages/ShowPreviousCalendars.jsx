import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const ShowPreviousCalendars = () => {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState("All");
  const [semFilter, setSemFilter] = useState("All");

  const fetchCalendars = async () => {
  setLoading(true);

  try {
    const bodyData = {
      year: 2026,
      semester: "even",
    };

    const res = await axios.post(
      "http://localhost:3000/academiccalendar/get-by-year-sem",
      bodyData
    );
    console.log(res);    

    console.log("Fetched Calendars:", res.data.calendars);
    setCalendars(res.data.calendars || []);
  } catch (error) {
    console.log("Error fetching calendars:", error.response?.data || error);
  }

  setLoading(false);
};


  // refetch data whenever filter changes
  useEffect(() => {
    fetchCalendars();
  }, [yearFilter, semFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this calendar?")) return;

    try {
      await axios.delete(`http://localhost:3000/academiccalendar/${id}`);
      alert("Calendar deleted");
      fetchCalendars();
    } catch (error) {
      console.error(error);
      alert("Error deleting calendar");
    }
  };

  const years = ["All", ...Array.from(new Set(calendars.map((c) => c.year)))];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar active="calendar-history" />

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">📜 Previous Academic Calendars</h1>

          {/* Filters */}
          <div className="flex gap-4 mb-6 flex-wrap">
            {/* Year Filter */}
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="border px-4 py-2 rounded"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            {/* Semester Filter */}
            <select
              value={semFilter}
              onChange={(e) => setSemFilter(e.target.value)}
              className="border px-4 py-2 rounded"
            >
              <option value="All">All</option>
              <option value="odd">Odd</option>
              <option value="even">Even</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded shadow-md overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-indigo-100 text-indigo-800">
                <tr>
                  <th className="px-4 py-3 text-left">Year</th>
                  <th className="px-4 py-3 text-left">Semester</th>
                  <th className="px-4 py-3 text-left">Semester Dates</th>
                  <th className="px-4 py-3 text-left">Exam Dates</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6">
                      Loading...
                    </td>
                  </tr>
                ) : calendars.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6">
                      No calendars found.
                    </td>
                  </tr>
                ) : (
                  calendars.map((c) => (
                    <tr key={c._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{c.year}</td>
                      <td className="px-4 py-3">{c.semester}</td>
                      <td className="px-4 py-3">
                        {new Date(c.semesterStart).toDateString()} → <br />
                        {new Date(c.semesterEnd).toDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(c.semesterExamStart).toDateString()} → <br />
                        {new Date(c.semesterExamEnd).toDateString()}
                      </td>
                      <td className="px-4 py-3 text-center space-x-2">
                        <button
                          onClick={() =>
                            (window.location.href = `/calendar/details/${c._id}`)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                        >
                          View
                        </button>

                        <button
                          onClick={() => handleDelete(c._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ShowPreviousCalendars;
