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

  const fetchStudent = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/student/${studentId}`);
      if (res.data.success) setStudent(res.data.student);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [studentId]);

  const handleSemesterSelect = (sem) => {
    setSelectedSem(sem);
    const sheet = student.gradeSheets.find((g) => g.semester === Number(sem));
    setSelectedSheet(sheet || null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar active="gradeSheet" />

        <main className="flex-1 p-8">
          <h2 className="text-2xl font-bold mb-6">📄 Student Grade Sheets</h2>

          {/* Student Details */}
          {student && (
            <div className="bg-white p-6 shadow rounded mb-6">
              <p><b>Name:</b> {student.name}</p>
              <p><b>Roll No:</b> {student.collegeId}</p>
              <p><b>Branch:</b> {student.department}</p>
              <p><b>Current Semester:</b> {student.currentSem}</p>
              <p><b>CGPA:</b> {student.cgpa}</p>
            </div>
          )}

          {/* Semester Dropdown */}
          {student && (
            <div className="mb-6">
              <label className="font-semibold text-lg mr-3">Select Semester:</label>
              <select
                value={selectedSem}
                onChange={(e) => handleSemesterSelect(e.target.value)}
                className="border p-2 rounded bg-white"
              >
                <option value="">-- Select Semester --</option>
                {[...Array(student.currentSem).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>
                     {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Grade Sheet Display */}
          {selectedSheet && (
            <div className="bg-white p-6 shadow rounded">
              <h3 className="text-xl font-bold mb-4">
                📌 Semester {selectedSheet.semester} Grade Sheet
              </h3>

              <table className="w-full border border-gray-300 mb-4">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="py-2 border">Course Enrollment ID</th>
                    <th className="py-2 border">Grade ID</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSheet.courses.map((c, idx) => (
                    <tr key={idx} className="text-center">
                      <td className="border py-2">{c.enrollment}</td>
                      <td className="border py-2 font-semibold">{c.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p><b>Credits Offered:</b> {selectedSheet.creditsOffered}</p>
              <p><b>Credits Earned:</b> {selectedSheet.creditsEarned}</p>
              <p><b>SGPA:</b> {selectedSheet.sgpa}</p>
              <p><b>CGPA after this sem:</b> {selectedSheet.cgpa}</p>
              <p className="text-gray-600 text-sm mt-2">
                Generated on: {new Date(selectedSheet.generatedAt).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* When user selects a semester that has no sheet */}
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
