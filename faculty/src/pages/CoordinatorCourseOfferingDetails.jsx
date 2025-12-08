import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AllContext } from "../context/AllContext";

const CoordinatorCourseOfferingDetails = () => {
  const { offeringId } = useParams();
  const { backendUrl, facultyToken } = useContext(AllContext);
  const navigate = useNavigate();

  const [offering, setOffering] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch course offering details
  const fetchOfferingDetails = async () => {
    if (!offeringId) return toast.error("Invalid course offering ID");
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

  // Fetch enrollments
  const fetchEnrollments = async () => {
    if (!offeringId) return;
    try {
      const res = await axios.get(`${backendUrl}/enrollment/offering/${offeringId}`, {
        headers: { Authorization: `Bearer ${facultyToken}` },
      });

      if (res.data.success) setEnrollments(res.data.enrollments);
      else toast.error(res.data.message || "Failed to fetch enrollments");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching enrollments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (facultyToken && offeringId) {
      fetchOfferingDetails();
      fetchEnrollments();
    } else if (!offeringId) {
      toast.error("No course offering ID provided in URL");
      setLoading(false);
    }
  }, [facultyToken, offeringId]);

 const approveStudent = async (enrollmentId) => {
  if (!enrollmentId) return;

  try {
    // 1️⃣ Update the enrollment status
    const res = await axios.put(
      `${backendUrl}/enrollment/${enrollmentId}/change`,
      { newStatus: "approved" },
      { headers: { Authorization: `Bearer ${facultyToken}` } }
    );

    if (res.data.success) {
      // 2️⃣ After successful approval, create a Grade entry for this enrollment
      try {
        await axios.post(
          `${backendUrl}/grade/create`,
          { enrollmentId}, // empty marks initially
          { headers: { Authorization: `Bearer ${facultyToken}` } }
        );
      } catch (gradeErr) {
        console.error("Error creating grade entry:", gradeErr);
        toast.error("Enrollment approved but failed to create grade entry");
      }

      // 3️⃣ Refresh the enrollments table
      fetchEnrollments();
    } else toast.error(res.data.message || "Failed to approve student");
  } catch (err) {
    console.error(err);
    toast.error("Error approving student");
  }
};

  const viewEnrollmentDetails = (enrollmentId) => {
    if (!enrollmentId) return toast.error("Invalid enrollment ID");
    navigate(`/courses/coordinator/enrollment/${enrollmentId}`);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!offering) return <p className="text-center mt-10">No course offering found.</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">
        {offering.course?.name || "-"} ({offering.course?.code || "-"})
      </h1>

      <h2 className="text-xl font-semibold mt-6 mb-4">Student Enrollments</h2>
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Student Name</th>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">CGPA / Marks</th>
            <th className="py-2 px-4 border-b">Assigned Instructors</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.length > 0 ? (
            enrollments.map((enroll) => (
              <tr key={enroll._id}>
                <td className="py-2 px-4 border-b">{enroll.student?.name || "-"}</td>
                <td className="py-2 px-4 border-b">{enroll.student?.collegeId || "-"}</td>
                <td className="py-2 px-4 border-b">{enroll.student?.email || "-"}</td>
                <td className="py-2 px-4 border-b">{enroll.student?.cgpa ?? "-"}</td>
                <td className="py-2 px-4 border-b">
                  {enroll.faculty?.length > 0
                    ? enroll.faculty.map((f) => f.name).join(", ")
                    : "Not Assigned"}
                </td>
                <td className="py-2 px-4 border-b capitalize">{enroll.status || "-"}</td>
                <td className="py-2 px-4 border-b flex gap-2">
                  {enroll.status === "selected" && (
                    <button
                      onClick={() => approveStudent(enroll._id)}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => viewEnrollmentDetails(enroll._id)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No enrollments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CoordinatorCourseOfferingDetails;
