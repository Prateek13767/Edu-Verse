import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";

const StudentDetails = () => {
  const { studentId } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [student, setStudent] = useState(null);
  const [willingnessList, setWillingnessList] = useState([]);
  const [allotment, setAllotment] = useState(null);

  const [hostel, setHostel] = useState("");
  const [room, setRoom] = useState("");

  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ================= FETCH ALL DATA =================
  const fetchAllDetails = async () => {
    try {
      const [studentRes, willingnessRes, allotmentRes] = await Promise.all([
        axios.get(`${backendUrl}/student/${studentId}`),
        axios.get(`${backendUrl}/willingness/student/${studentId}`),
        axios.get(`${backendUrl}/roomallotment/student/${studentId}`),
      ]);

      // STUDENT
      if (studentRes.data.success) {
        setStudent(studentRes.data.student);
        setHostel(studentRes.data.student.hostel?._id || "");
        setRoom(studentRes.data.student.room?.roomIndex || "");
      }

      // WILLINGNESS (ARRAY)
      if (willingnessRes.data.success) {
        setWillingnessList(
          Array.isArray(willingnessRes.data.data)
            ? willingnessRes.data.data
            : []
        );
      }

      // ROOM ALLOTMENT
      if (allotmentRes.data.success) {
        setAllotment(allotmentRes.data.allotment);
      }
    } catch (err) {
      console.error("Error fetching student details:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH HOSTELS =================
  const fetchHostels = async () => {
    try {
      const res = await axios.get(`${backendUrl}/hostel/`);
      if (res.data.success) {
        setHostels(res.data.hostels);
      }
    } catch (err) {
      console.error("Error fetching hostels", err);
    }
  };

  // ================= FETCH ROOMS BY HOSTEL =================
  const fetchRoomsByHostel = async (hostelId) => {
    try {
      const res = await axios.get(`${backendUrl}/room/hostel/${hostelId}`);
      if (res.data.success) {
        setRooms(res.data.rooms);
      }
    } catch (err) {
      console.error("Error fetching rooms", err);
    }
  };

  useEffect(() => {
    fetchAllDetails();
    fetchHostels();
  }, [studentId]);

  useEffect(() => {
    if (hostel) fetchRoomsByHostel(hostel);
    else setRooms([]);
  }, [hostel]);

  // ================= UPDATE HOSTEL =================
  const handleUpdateHostel = async () => {
    setUpdating(true);
    try {
      await axios.put(
        `${backendUrl}/student/update-hostel/${studentId}`,
        { hostel, room }
      );

      alert("Hostel updated successfully");
      fetchAllDetails();
    } catch (error) {
      console.error(error);
      alert("Failed to update hostel");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="p-10">Loading student details...</p>;
  if (!student) return <p className="p-10">Student not found</p>;

  return (
    <div className="flex bg-gray-100 min-h-screen">

      <aside className="w-64 fixed left-0 top-0 h-full bg-[#0F172A] text-white z-50">
        <Sidebar />
      </aside>

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 px-10 pt-24 pb-10 max-w-4xl mx-auto w-full">
          <h1 className="text-3xl font-bold mb-8">Student Details</h1>

          <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">

            {/* BASIC DETAILS */}
            <Section title="Basic Information">
              <Detail label="Name" value={student.name} />
              <Detail label="Roll Number" value={student.collegeId} />
              <Detail label="Department" value={student.department} />
              <Detail label="Email" value={student.email} />
              <Detail label="Phone" value={student.phone} />
              <Detail label="Programme" value={student.programme} />
              <Detail label="Semester" value={student.currentSem} />
            </Section>

            {/* WILLINGNESS TABLE */}
            <Section title="Hostel Willingness">
              {willingnessList.length === 0 ? (
                <p className="text-gray-500">No willingness submitted</p>
              ) : (
                <div className="overflow-x-auto border rounded-lg">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold">
                          Academic Year
                        </th>
                        <th className="px-6 py-3 text-center font-semibold">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {willingnessList
                        .sort((a, b) => b.year - a.year)
                        .map((w) => (
                          <tr
                            key={w._id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="px-6 py-3">
                              {w.year}
                            </td>

                            <td className="px-6 py-3 text-center">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  w.status === "Approved"
                                    ? "bg-green-100 text-green-700"
                                    : w.status === "Rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {w.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Section>

            {/* ROOM ALLOTMENT */}
            <Section title="Room Allotment">
              {allotment ? (
                <>
                  <Detail label="Allotted Hostel" value={allotment.hostel?.name} />
                  <Detail label="Room Number" value={allotment.room?.roomIndex} />
                  <Detail label="Allotted On" value={new Date(allotment.createdAt).toLocaleDateString()} />
                </>
              ) : (
                <p className="text-red-500">Not allotted yet</p>
              )}
            </Section>

            {/* UPDATE HOSTEL */}
            <Section title="Update Hostel">
              <div className="flex flex-col gap-4">

                <select
                  value={hostel}
                  onChange={(e) => setHostel(e.target.value)}
                  className="border rounded-lg px-4 py-2"
                >
                  <option value="">Select Hostel</option>
                  {hostels.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.name}
                    </option>
                  ))}
                </select>

                <select
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="border rounded-lg px-4 py-2"
                  disabled={!hostel}
                >
                  <option value="">Select Room</option>
                  {rooms
                    .filter((r) => r.occupied < r.capacity)
                    .map((r) => (
                      <option key={r._id} value={r.roomIndex}>
                        {r.formattedRoom} ({r.occupied}/{r.capacity})
                      </option>
                    ))}
                </select>

                <button
                  onClick={handleUpdateHostel}
                  disabled={updating}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg w-fit"
                >
                  {updating ? "Updating..." : "Update Hostel"}
                </button>
              </div>
            </Section>

          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="border-t pt-6">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <div className="space-y-2">{children}</div>
  </div>
);

const Detail = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="font-medium text-gray-600">{label}</span>
    <span className="text-gray-900">{value || "—"}</span>
  </div>
);

export default StudentDetails;
