import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AllContext } from "../context/AllContext";
import { jwtDecode } from "jwt-decode";

const InstructorCourseOfferingDetails = () => {
  const { offeringId } = useParams();
  const { backendUrl, facultyToken } = useContext(AllContext);
  const navigate = useNavigate();

  const [offering, setOffering] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 decode faculty ID from token
  const facultyId = facultyToken ? jwtDecode(facultyToken)?.id : null;

  // Fetch course offering details
  const fetchOfferingDetails = async () => {
    try {
      const res = await axios.get(`${backendUrl}/courseoffering/${offeringId}`, {
        headers: { Authorization: `Bearer ${facultyToken}` },
      });
      if (res.data.success) setOffering(res.data.offeringDetails);
      else toast.error(res.data.message || "Failed to fetch offering details");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching course offering details");
    }
  };

  // Fetch approved students **assigned to this logged-in faculty**
  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${backendUrl}/enrollment/offering/${offeringId}`, {
        headers: { Authorization: `Bearer ${facultyToken}` },
      });
      {
        console.log(res);
        
      }

      if (res.data.success) {
        const approvedForThisFaculty = res.data.enrollments.filter(
          (e) => e.status === "approved" && e.faculty?._id === facultyId
        );

        setStudents(approvedForThisFaculty);
      } else {
        toast.error(res.data.message || "Failed to fetch students");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (facultyToken) {
      fetchOfferingDetails();
      fetchStudents();
    }
  }, [facultyToken]);

  if (loading) return <p>Loading...</p>;
  if (!offering) return <p>No course offering found.</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">
        {offering.course.name} ({offering.course.code})
      </h1>

      <div className="mb-6 flex gap-4">
        <button
          onClick={() => navigate(`/courses/instructor/${offeringId}/attendance`)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Mark Attendance (Bulk)
        </button>
        <button
          onClick={() => navigate(`/courses/instructor/${offeringId}/grades`)}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Assign Grades (Bulk)
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-4">
        Approved Students (Assigned to You)
      </h2>

      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Student Name</th>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">CGPA</th>
            <th className="py-2 px-4 border-b">Attendance</th>
            <th className="py-2 px-4 border-b">Grade</th>
            <th className="py-2 px-4 border-b">Details</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((s) => (
              <tr key={s._id}>
                <td className="py-2 px-4 border-b">{s.student.name}</td>
                <td className="py-2 px-4 border-b">{s.student.collegeId}</td>
                <td className="py-2 px-4 border-b">{s.student.email}</td>
                <td className="py-2 px-4 border-b">{s.student.cgpa ?? "-"}</td>
                <td className="py-2 px-4 border-b">{s.attendance ?? 0}</td>
                <td className="py-2 px-4 border-b">{s.grade || "-"}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => navigate(`/courses/instructor/enrollment/${s._id}`)}
                    className="px-2 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No students found assigned to you.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InstructorCourseOfferingDetails;
