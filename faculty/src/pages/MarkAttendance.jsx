import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AllContext } from "../context/AllContext";

const MarkAttendance = () => {
  const { offeringId } = useParams();
  const { backendUrl, facultyToken, faculty } = useContext(AllContext); // 👈 faculty added

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [absentRange, setAbsentRange] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${backendUrl}/enrollment/offering/${offeringId}`, {
        headers: { Authorization: `Bearer ${facultyToken}` },
      });

      if (res.data.success) {
        // 🎯 ONLY STUDENTS ASSIGNED TO THIS FACULTY SHOULD BE SHOWN
        const approved = res.data.enrollments.filter(
          (e) => e.status === "approved" && e.faculty && e.faculty._id === faculty._id
        );
        setStudents(approved);

        const sel = {};
        const attData = {};
        approved.forEach((s) => {
          sel[s._id] = false;
          attData[s._id] = null;
        });
        setSelected(sel);
        setAttendanceData(attData);

        fetchAttendanceForDate(approved, date);
      } else toast.error(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching enrolled students");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceForDate = async (studentsList, selectedDate) => {
    try {
      const res = await axios.post(
        `${backendUrl}/attendance/offering/${offeringId}`,
        { date: selectedDate },
        { headers: { Authorization: `Bearer ${facultyToken}` } }
      );

      if (res.data.success) {
        const attData = {};
        studentsList.forEach((s) => {
          const record = res.data.attendance.find((a) => a.enrollment === s._id);
          attData[s._id] = record ? record.status : null;
        });
        setAttendanceData(attData);

        const sel = {};
        studentsList.forEach((s) => {
          sel[s._id] = attData[s._id] === "present";
        });
        setSelected(sel);
      } else {
        const attData = {};
        studentsList.forEach((s) => (attData[s._id] = null));
        setAttendanceData(attData);

        const sel = {};
        studentsList.forEach((s) => (sel[s._id] = false));
        setSelected(sel);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching attendance for selected date");
    }
  };

  useEffect(() => {
    if (facultyToken && faculty?._id) fetchStudents();
  }, [facultyToken, faculty?._id]);

  const handleToggle = (id) => {
    if (attendanceData[id]) return;
    setSelected({ ...selected, [id]: !selected[id] });
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    fetchAttendanceForDate(students, newDate);
  };

  const handleAbsenteeInput = () => {
    if (!absentRange) return toast.error("Enter student numbers first");
    if (Object.values(attendanceData).some((s) => s))
      return toast.error("Attendance already marked — cannot modify");

    const nums = absentRange.split(/[\s,]+/).map(Number).filter((n) => !isNaN(n));
    const newSel = {};

    students.forEach((s, index) => {
      const srNo = index + 1;
      newSel[s._id] = !nums.includes(srNo);
    });

    setSelected(newSel);
    toast.success("Absentees selected successfully");
  };

  const markAttendance = async () => {
    try {
      if (!students || students.length === 0) return toast.error("No students found");
      if (Object.values(attendanceData).some((status) => status))
        return toast.error("Attendance already marked for this date");

      const data = students.map((s) => ({
        enrollment: s._id,
        date,
        status: selected[s._id] ? "present" : "absent",
      }));

      await axios.post(
        `${backendUrl}/attendance/mark-all`,
        { data },
        { headers: { Authorization: `Bearer ${facultyToken}` } }
      );

      toast.success("Attendance marked successfully!");
      fetchAttendanceForDate(students, date);
    } catch (err) {
      console.error(err);
      toast.error("Error marking attendance");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Mark Attendance</h1>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Date:</label>
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          className="border px-2 py-1 rounded"
        />
      </div>

      {/* Absentee Input shown only if attendance not marked already */}
      {Object.values(attendanceData).every((s) => !s) && (
        <div className="mb-4 flex gap-3 items-center">
          <input
            type="text"
            placeholder="Enter absentees: 1,3,7"
            className="border px-2 py-1 rounded"
            value={absentRange}
            onChange={(e) => setAbsentRange(e.target.value)}
          />
          <button
            onClick={handleAbsenteeInput}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
          >
            Mark Absentees
          </button>
        </div>
      )}

      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th>#</th>
            <th></th>
            <th>Name</th>
            <th>ID</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, index) => (
            <tr key={s._id}>
              <td className="py-2 px-4 border-b font-semibold">{index + 1}</td>
              <td className="py-2 px-4 border-b">
                <input
                  type="checkbox"
                  checked={selected[s._id]}
                  onChange={() => handleToggle(s._id)}
                  disabled={attendanceData[s._id] !== null}
                />
              </td>
              <td className="py-2 px-4 border-b">{s.student.name}</td>
              <td className="py-2 px-4 border-b">{s.student.collegeId}</td>
              <td className="py-2 px-4 border-b">{s.student.email}</td>
              <td className="py-2 px-4 border-b">
                {attendanceData[s._id] ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={markAttendance}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
      >
        Mark Attendance
      </button>
    </div>
  );
};

export default MarkAttendance;
