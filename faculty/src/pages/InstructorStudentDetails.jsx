import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AllContext } from "../context/AllContext";

const InstructorStudentDetails = () => {
  const { enrollmentId } = useParams();
  const { backendUrl, facultyToken } = useContext(AllContext);

  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEnrollmentDetails = async () => {
    try {
      const res = await axios.get(`${backendUrl}/enrollment/${enrollmentId}`, {
        headers: { Authorization: `Bearer ${facultyToken}` },
      });
      {console.log(res);
      }
      if (res.data.success) setEnrollment(res.data.enrollment);
      else toast.error(res.data.message || "Failed to fetch enrollment details");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching enrollment details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (facultyToken) fetchEnrollmentDetails();
  }, [facultyToken]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!enrollment) return <p className="text-center mt-10">No enrollment details found.</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <h1 className="text-3xl font-bold mb-2 text-indigo-700 text-center">
        {enrollment.student.name} ({enrollment.student.collegeId})
      </h1>

      {/* Student Information */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300">Student Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Name:</strong> {enrollment.student.name}</p>
          <p><strong>Email:</strong> {enrollment.student.email}</p>
          <p><strong>CGPA:</strong> {enrollment.student.cgpa ?? "-"}</p>
          <p><strong>Status:</strong> <span className={`capitalize font-semibold ${enrollment.status === "approved" ? "text-green-600" : "text-yellow-600"}`}>{enrollment.status}</span></p>
        </div>
      </div>

      {/* Course Details */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300">Course Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Course:</strong> {enrollment.offering.course.name} ({enrollment.offering.course.code})</p>
          <p><strong>Semester:</strong> {enrollment.offering.semester}</p>
          <p><strong>Year:</strong> {enrollment.offering.year}</p>
          <p><strong>Assigned Instructors:</strong> {enrollment.faculty?.length > 0 ? enrollment.faculty.map(f => f.name).join(", ") : "Not Assigned"}</p>
        </div>
      </div>

      {/* Academic Records */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-300">Academic Records</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Attendance:</strong> {enrollment.attendance ?? 0}</p>
          <p><strong>Grade:</strong> {enrollment.grade || "-"}</p>
        </div>

        <h3 className="text-xl font-semibold mt-4 mb-2">Assignments / Marks</h3>
        <ul className="list-disc list-inside space-y-1">
          {enrollment.assignments && enrollment.assignments.length > 0 ? (
            enrollment.assignments.map((a, idx) => (
              <li key={idx} className="bg-gray-100 p-2 rounded">{a.name}: <span className="font-semibold">{a.marks ?? "-"}</span></li>
            ))
          ) : (
            <li className="text-gray-500">No assignments recorded yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default InstructorStudentDetails;
