import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const CourseOfferingDetails = () => {
  const { offeringId } = useParams();

  const [offering, setOffering] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // ---------------------- Fetch Offering + Enrollment -------------------------
  useEffect(() => {
    const loadDetails = async () => {
      try {
        const res1 = await axios.get(`http://localhost:3000/courseOffering/${offeringId}`);
        setOffering(res1.data.offeringDetails);
        {
          console.log(res1.data.offeringDetails);
          
        }
        const res2 = await axios.get(`http://localhost:3000/enrollment/offering/${offeringId}`);
        setEnrollments(res2.data.enrollments);
        setFiltered(res2.data.enrollments);
      } catch (err) {
        console.log(err);
      }
    };

    loadDetails();
  }, [offeringId]);

  // ---------------------------- Apply Filters -------------------------------
  useEffect(() => {
    let temp = enrollments;

    // search by name or collegeId
    if (search.trim() !== "")
      temp = temp.filter(
        (e) =>
          e.student.name.toLowerCase().includes(search.toLowerCase()) ||
          e.student.collegeId.toLowerCase().includes(search.toLowerCase())
      );

    if (statusFilter !== "") temp = temp.filter((e) => e.status === statusFilter);

    setFiltered(temp);
  }, [search, statusFilter, enrollments]);

  if (!offering)
    return (
      <div className="p-6 text-center text-lg font-semibold">
        Loading offering details...
      </div>
    );

  // ---------------------------- UI ------------------------------------------
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-10">
          {/* ---------- Page Title ---------- */}
          <h1 className="text-3xl font-bold mb-8 text-indigo-700">
            Course Offering Details
          </h1>

          {/* ---------- Offering Info Card ---------- */}
          <div className="bg-white rounded-xl shadow-lg border p-8 mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Information</h2>

            <div className="grid grid-cols-2 gap-6">
              <p><strong>Course:</strong> {offering.course?.name}</p>
              <p><strong>Code:</strong> {offering.course?.code}</p>
              <p><strong>Credits:</strong>{offering.course?.credits}</p>
              <p><strong>Coordinator:</strong>{offering.coordinator.name}</p>
              <p>
                <strong>Instructors:</strong>{" "}
                {offering.instructors?.length > 0
                  ? offering.instructors.map((i) => i.name).join(", ")
                  : "No instructors assigned"}
              </p>
              <p><strong>Semester:</strong> {offering.semester}</p>
              <p><strong>Year:</strong> {offering.year}</p>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-2 text-indigo-600">Offering Schedule:</h3>
            <div className="space-y-1">
              {offering.schedule?.map((s, i) => (
                <div key={i} className="text-sm text-gray-700">
                  • {s.day}: {s.startTime} - {s.endTime} (Room {s.room})
                </div>
              ))}
            </div>
          </div>

          {/* ---------- Filters ---------- */}
          <div className="bg-white rounded-xl shadow-md border p-6 mb-10">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Search Students</h2>

            <div className="grid grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Search by name or college ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Status</option>
                <option value="selected">Selected</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="dropped">Dropped</option>
                <option value="Attendance Failure">Attendance Failure</option>
                <option value="Supplementary">Supplementary</option>
              </select>
            </div>
          </div>

          {/* ---------- Enrollment Table ---------- */}
          <div className="bg-white rounded-xl shadow-lg border p-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Enrolled Students ({filtered.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full rounded-lg overflow-hidden">
                <thead className="bg-indigo-100">
                  <tr>
                    <th className="px-5 py-3 text-left">Name</th>
                    <th className="px-5 py-3 text-left">College ID</th>
                    <th className="px-5 py-3 text-left">Faculty</th>
                    <th className="px-5 py-3 text-left">Schedule</th>
                    <th className="px-5 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((e) => (
                    <tr key={e._id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">{e.student.name}</td>
                      <td className="px-5 py-3">{e.student.collegeId}</td>
                      <td className="px-5 py-3">
                        {e.faculty?.name || (
                          <span className="text-red-600 font-medium">Not Assigned</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-sm">
                        {e.schedule?.length > 0 ? (
                          <ul className="list-disc pl-4 space-y-1">
                            {e.schedule.map((s, idx) => (
                              <li key={idx}>
                                <b>{s.day}</b>, {s.startTime}–{s.endTime} (Room {s.room})
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-red-600">No Schedule</span>
                        )}
                      </td>
                      <td className="px-5 py-3">{e.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <p className="text-center text-gray-600 mt-4">
                No students match the filters.
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseOfferingDetails;
