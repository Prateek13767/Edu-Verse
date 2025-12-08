import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const AssignFacultyOnOffering = () => {
  const { offeringId } = useParams();
  const [offering, setOffering] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedEnrollments, setSelectedEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [schedules, setSchedules] = useState([]);

  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");

  const fetchOffering = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/courseoffering/${offeringId}`);
      const res2 = await axios.get(`http://localhost:3000/enrollment/offering/${offeringId}`);

      setOffering(res.data.offeringDetails);
      setEnrollments(res2.data.enrollments || []);
      setSelectedEnrollments([]);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffering();
  }, []);

  useEffect(() => {
    if (offering?.course?.credits) {
      setSchedules(
        Array(offering.course.credits)
          .fill()
          .map(() => ({
            day: "",
            startTime: "",
            endTime: "",
            room: "",
          }))
      );
    }
  }, [offering]);

  const handleSelectStudent = (enrollmentId) => {
    setSelectedEnrollments((prev) =>
      prev.includes(enrollmentId)
        ? prev.filter((id) => id !== enrollmentId)
        : [...prev, enrollmentId]
    );
  };

  const handleRangeSelection = () => {
    if (!rangeStart || !rangeEnd) return alert("Enter both start & end numbers");

    const start = parseInt(rangeStart);
    const end = parseInt(rangeEnd);

    if (start < 1 || end < 1 || start > enrollments.length || end > enrollments.length || start > end) {
      return alert("Invalid range");
    }

    const selectedIds = enrollments.slice(start - 1, end).map((e) => e._id);
    setSelectedEnrollments(selectedIds);
  };

  const updateSchedule = (idx, field, value) => {
    setSchedules((prev) => {
      const updated = [...prev];
      updated[idx][field] = value;
      return updated;
    });
  };

  const handleAssign = async () => {
    if (!selectedFaculty) return alert("Select a faculty first");
    if (selectedEnrollments.length === 0) return alert("Select students first");

    for (const s of schedules) {
      if (!s.day || !s.startTime || !s.endTime || !s.room)
        return alert("Fill all schedule rows completely!");
    }

    try {
      const res = await axios({
        method: "PUT",
        url: "http://localhost:3000/enrollment/assign-faculty-schedule",
        headers: { "Content-Type": "application/json" },
        data: {
          enrollmentIds: selectedEnrollments,
          facultyId: selectedFaculty,
          schedules,
        },
      });

      if (!res.data.success) return alert(res.data.message || "Operation failed");
      alert("Faculty & schedule assigned successfully 🎉");
      fetchOffering();
      setSelectedFaculty("");
    } catch (err) {
      console.error(err);
      alert("Error while assigning. Check console.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return <span className="text-red-600">Pending</span>;
      case "selected": return <span className="text-blue-600">Selected</span>;
      case "approved": return <span className="text-green-600">Approved</span>;
      case "rejected": return <span className="text-orange-600">Rejected</span>;
      case "completed": return <span className="text-purple-600">Completed</span>;
      default: return <span className="text-gray-600">Unknown</span>;
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="p-6">
          {loading && <p className="text-center text-gray-700 py-10">Loading...</p>}

          {!loading && offering && (
            <>
              <div className="bg-white shadow-md rounded-xl p-6 mb-8 border">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Offering Details</h2>
                <p><b>Course:</b> {offering.course?.code} — {offering.course?.name}</p>
                <p><b>Semester:</b> {offering.semester} | <b>Year:</b> {offering.year}</p>
                <p><b>Branches:</b> {offering.branches?.join(", ")}</p>
                <p><b>Coordinator:</b> {offering.coordinator?.name}</p>
                <p><b>Instructors:</b> {offering.instructors?.map(i => i.name).join(", ")}</p>
                <p><b>Credits:</b> {offering.course?.credits}</p>
              </div>

              <div className="flex items-center gap-4 mb-4 bg-white p-4 rounded shadow border">
                <input
                  type="number"
                  placeholder="Start #"
                  className="border rounded p-2 w-24"
                  value={rangeStart}
                  onChange={(e) => setRangeStart(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="End #"
                  className="border rounded p-2 w-24"
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(e.target.value)}
                />
                <button
                  onClick={handleRangeSelection}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
                >
                  Auto Select Range
                </button>
              </div>

              <div className="bg-white shadow-md rounded-xl p-6 mb-8 border overflow-x-auto">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Enrolled Students (Faculty + Schedule Overview)
                </h2>

                <table className="w-full border-collapse">
                  <thead className="bg-indigo-100 text-indigo-800">
                    <tr>
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">Select</th>
                      <th className="px-4 py-3 text-left">Student ID</th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Faculty</th>
                      <th className="px-4 py-3 text-left">Schedule</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((e, index) => {
                      const alreadyAssigned = e.faculty && e.schedule?.length > 0;

                      return (
                        <tr key={e._id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-semibold">{index + 1}</td>

                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedEnrollments.includes(e._id)}
                              onChange={() => handleSelectStudent(e._id)}
                              className="w-4 h-4 cursor-pointer"
                            />
                          </td>

                          <td className="px-4 py-3">{e.student?.collegeId}</td>
                          <td className="px-4 py-3">{e.student?.name}</td>

                          <td className="px-4 py-3 font-medium">
                            {alreadyAssigned ? (
                              <>
                                <span className="text-green-700 font-semibold">{e.faculty?.name}</span>
                                <br />
                                <span className="text-yellow-600 text-xs font-semibold">
                                  (Will update if selected)
                                </span>
                              </>
                            ) : (
                              <span className="text-red-600">Not Assigned</span>
                            )}
                          </td>

                          <td className="px-4 py-3 text-sm">
                            {e.schedule?.length > 0 ? (
                              <ul className="list-disc pl-4 space-y-1">
                                {e.schedule.map((s, idx) => (
                                  <li key={idx}>
                                    <b>{s.day}</b>, {s.startTime}–{s.endTime} — Room <b>{s.room}</b>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-red-600">No schedule</span>
                            )}
                          </td>

                          <td className="px-4 py-3 font-semibold">{getStatusBadge(e.status)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="bg-white shadow-md rounded-xl p-6 mb-8 border">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Faculty</h2>
                <select
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                  className="p-3 border rounded w-full"
                >
                  <option value="">Select Instructor</option>
                  {offering.instructors?.map((i) => (
                    <option key={i._id} value={i._id}>
                      {i.name} — {i.designation} ({i.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white shadow-md rounded-xl p-6 border">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Assign Schedule ({offering.course?.credits} sessions)
                </h2>

                {schedules.map((sch, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-4 mb-4">
                    <select
                      value={sch.day}
                      onChange={(e) => updateSchedule(idx, "day", e.target.value)}
                      className="p-3 border rounded"
                    >
                      <option value="">Day</option>
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                        (d) => (
                          <option key={d} value={d}>{d}</option>
                        )
                      )}
                    </select>

                    <input
                      type="time"
                      className="p-3 border rounded"
                      value={sch.startTime}
                      onChange={(e) => updateSchedule(idx, "startTime", e.target.value)}
                    />

                    <input
                      type="time"
                      className="p-3 border rounded"
                      value={sch.endTime}
                      onChange={(e) => updateSchedule(idx, "endTime", e.target.value)}
                    />

                    <input
                      type="text"
                      placeholder="Room"
                      className="p-3 border rounded"
                      value={sch.room}
                      onChange={(e) => updateSchedule(idx, "room", e.target.value)}
                    />
                  </div>
                ))}

                <button
                  onClick={handleAssign}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg w-full font-semibold mt-4"
                >
                  Assign / Update Faculty + Schedule
                </button>
              </div>
            </>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default AssignFacultyOnOffering;
