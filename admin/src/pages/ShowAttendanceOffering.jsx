import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";

const ShowAttendanceOffering = () => {
  const { offeringId } = useParams();
  const [loading, setLoading] = useState(true);
  const [offering, setOffering] = useState(null);
  const [enrollments, setEnrollments] = useState([]);

  const fetchData = async () => {
    try {
      // Fetch offering details
      const res = await axios.get(
        `http://localhost:3000/courseoffering/${offeringId}`
      );

      // Fetch all enrollments for the offering
      const res2 = await axios.get(
        `http://localhost:3000/enrollment/offering/${offeringId}`
      );

      if (res.data.success) setOffering(res.data.offeringDetails);
      if (res2.data.success) {
        const enrollData = res2.data.enrollments;

        // Fetch attendance % for each enrollment
        const enriched = await Promise.all(
          enrollData.map(async (en) => {
            try {
              const a = await axios.get(
                `http://localhost:3000/attendance/attendancepercentage/${en._id}`
              );
              console.log(a);
              
              return {
                ...en,
                attendancePercentage: a.data?.percentage ?? null,
              };
            } catch (err) {
              return { ...en, attendancePercentage: null };
            }
          })
        );

        setEnrollments(enriched);
      }
    } catch (err) {
      console.log("Error fetching offering details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [offeringId]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Offering Attendance Details
          </h1>

          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : !offering ? (
            <p className="text-red-600 font-semibold">
              Offering not found!
            </p>
          ) : (
            <>
              {/* Offering Info */}
              <div className="bg-white p-6 mb-6 rounded-xl shadow-sm border">
                <h2 className="text-xl font-semibold text-gray-800">
                  Offering ID: {offering._id}
                </h2>

                <p className="text-gray-600">
                  Course: {offering.course?.name}
                </p>

                <p className="text-gray-600">
                  Semester: {offering.semester}
                </p>

                <p className="text-gray-600">
                  Coordinator: {offering?.coordinator?.name || "Not Assigned"}
                </p>

                <p className="text-gray-600">
                  Instructors:{" "}
                  {offering?.instructors?.length > 0
                    ? offering.instructors.map(i => i.name).join(", ")
                    : "Not Assigned"}
                </p>
              </div>

              {/* Enrollment Table */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">
                  Enrolled Students ({enrollments.length})
                </h3>

                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-indigo-100">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Student Name
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        College ID
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Batch
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Branch
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Attendance %
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        View Attendance
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {enrollments.map((en) => (
                      <tr key={en._id} className="hover:bg-gray-50">
                        
                        <td className="px-4 py-3">
                          {en.student?.name}
                        </td>

                        <td className="px-4 py-3">
                          {en.student?.collegeId}
                        </td>

                        <td className="px-4 py-3">
                          {en.student?.batch}
                        </td>

                        <td className="px-4 py-3">
                          {en.student?.department}
                        </td>

                        <td className="px-4 py-3 font-semibold">
                          {en.attendancePercentage !== null
                            ? `${en.attendancePercentage}%`
                            : "—"}
                        </td>

                        <td className="px-4 py-3">
                          <a
                            href={`/faculty/attendance/student/${en._id}`}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg"
                          >
                            View
                          </a>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ShowAttendanceOffering;
