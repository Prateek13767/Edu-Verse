import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const StudentsGradeSheets = () => {
  const { studentId } = useParams();

  const [student, setStudent] = useState(null);
  const [selectedSem, setSelectedSem] = useState("");
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStudent = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/student/${studentId}`
      );
      console.log(res);
      
      if (res.data.success) {
        setStudent(res.data.student);
      }
    } catch (err) {
      console.error("Fetch student error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [studentId]);

  const handleSemesterSelect = (sem) => {
    setSelectedSem(sem);
    const sheet = student?.gradeSheets?.find(
      (g) => g.semester === Number(sem)
    );
    setSelectedSheet(sheet || null);
  };

  const handleDownload = () => {
    if (!student || !selectedSheet) return;

    window.open(
      `http://localhost:3000/student/download/${student._id}/${selectedSheet.semester}`,
      "_blank"
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar active="gradeSheet" />

        <main className="flex-1 p-8">
          <h2 className="text-2xl font-bold mb-6">
            📄 Student Grade Sheets
          </h2>

          {/* Loading */}
          {loading && <p className="text-gray-600">Loading...</p>}

          {/* Student Details */}
          {student && (
            <div className="bg-white p-6 shadow rounded mb-6 space-y-1">
              <p><b>Name:</b> {student.name}</p>
              <p><b>Roll No:</b> {student.collegeId}</p>
              <p><b>Branch:</b> {student.department}</p>
              <p><b>Current Semester:</b> {student.currentSem}</p>
              <p><b>CGPA:</b> {student.cgpa}</p>
            </div>
          )}

          {/* Semester Dropdown */}
          {student && student.gradeSheets?.length > 0 && (
            <div className="mb-6">
              <label className="font-semibold text-lg mr-3">
                Select Semester:
              </label>
              <select
                value={selectedSem}
                onChange={(e) => handleSemesterSelect(e.target.value)}
                className="border p-2 rounded bg-white"
              >
                <option value="">-- Select Semester --</option>
                {student.gradeSheets
                  .sort((a, b) => a.semester - b.semester)
                  .map((gs) => (
                    <option key={gs.semester} value={gs.semester}>
                      Semester {gs.semester}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Grade Sheet Display */}
          {selectedSheet && (
            <div className="bg-white p-6 shadow rounded">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  📌 Semester {selectedSheet.semester} Grade Sheet
                </h3>

                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded cursor-pointer"
                >
                  ⬇ Download PDF
                </button>
              </div>

              <table className="w-full border border-gray-300 mb-4">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="py-2 border">Course</th>
                    <th className="py-2 border">Grade</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedSheet.courses.map((c, idx) => (
                    <tr key={idx} className="text-center">
                      <td className="border py-2">
                        {c.enrollment?.offering?.course?.name || "N/A"}
                      </td>
                      <td className="border py-2 font-semibold">
                        {c.grade?.letterGrade || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="space-y-1">
                <p><b>Credits Offered:</b> {selectedSheet.creditsOffered}</p>
                <p><b>Credits Earned:</b> {selectedSheet.creditsEarned}</p>
                <p><b>SGPA:</b> {selectedSheet.sgpa}</p>
                <p><b>CGPA after this sem:</b> {selectedSheet.cgpa}</p>
              </div>

              <p className="text-gray-600 text-sm mt-2">
                Generated on:{" "}
                {new Date(selectedSheet.generatedAt).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* No grade sheet case */}
          {selectedSem && !selectedSheet && (
            <p className="text-red-600 font-semibold">
              ⚠️ Grade sheet not generated for Semester {selectedSem}.
            </p>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default StudentsGradeSheets;
