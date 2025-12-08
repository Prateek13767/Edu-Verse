import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AllContext } from "../context/AllContext";

const AssignGrade = () => {
  const { offeringId } = useParams();
  const { backendUrl, faculty } = useContext(AllContext); // 👈 faculty added

  const gradeFields = ["assignments", "midsem", "endsem", "quiz", "project"];
  const [enrollments, setEnrollments] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState("");
  const [bulkMarks, setBulkMarks] = useState("");

  // Fetch enrollments + grades only for this faculty
  useEffect(() => {
    if (!offeringId || !faculty?._id) return;

    const fetchEnrollmentsAndGrades = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/enrollment/offering/${offeringId}`);
        const fetchedEnrollments = res.data.enrollments || [];

        // 🔥 FILTER ONLY ENROLLMENTS ASSIGNED TO THIS FACULTY
        const filtered = fetchedEnrollments.filter(
          (e) => e.faculty && e.faculty._id === faculty._id
        );
        setEnrollments(filtered);

        // Load grades for filtered enrollments
        const gradesData = {};
        for (const enr of filtered) {
          try {
            const gradeRes = await axios.get(`${backendUrl}/grade/enrollment/${enr._id}`);
            gradesData[enr._id] = gradeRes.data.gradeDetails || {};
          } catch {
            gradesData[enr._id] = {};
          }
        }
        setGrades(gradesData);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch enrollments or grades.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentsAndGrades();
  }, [offeringId, backendUrl, faculty?._id]);

  const handleGradeChange = (enrollmentId, field, value) => {
    setGrades((prev) => ({
      ...prev,
      [enrollmentId]: { ...prev[enrollmentId], [field]: Number(value) },
    }));
  };

  // 🔥 Bulk Upload of Marks
  const handleBulkUpload = async () => {
    if (!selectedExam) return alert("Select exam type first");

    const marks = bulkMarks.split(/[, ]+/).map(Number).filter((x) => !isNaN(x));
    if (marks.length !== enrollments.length)
      return alert(`Expected ${enrollments.length} marks, received ${marks.length}`);

    const payload = enrollments.map((enr, i) => ({
      enrollmentId: enr._id,
      marks: marks[i],
    }));

    try {
      await axios.post(`${backendUrl}/grade/upload-bulk`, {
        offeringId,
        type: selectedExam,
        data: payload,
      });

      alert("Bulk marks uploaded successfully!");
      setBulkMarks("");

      // Refresh grades
      const updated = {};
      for (const enr of enrollments) {
        const g = await axios.get(`${backendUrl}/grade/enrollment/${enr._id}`);
        updated[enr._id] = g.data.gradeDetails || {};
      }
      setGrades(updated);
    } catch (err) {
      console.error(err);
      alert("Failed to upload marks");
    }
  };

  const handleAssignGrades = async () => {
    try {
      await axios.post(`${backendUrl}/grade/assign-bulk`, { offeringId });

      const updated = {};
      for (const enr of enrollments) {
        const g = await axios.get(`${backendUrl}/grade/enrollment/${enr._id}`);
        updated[enr._id] = g.data.gradeDetails || {};
      }
      setGrades(updated);

      alert("Relative grades assigned successfully!");
    } catch {
      alert("Failed to assign grades");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 text-gray-800 px-6 py-10">
        <h1 className="text-3xl font-bold text-center mb-10 text-indigo-700">
          Assign Grades
        </h1>

        <div className="mb-6 text-center flex justify-center items-center gap-4">
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="">-- Select Exam --</option>
            {gradeFields.map((f) => (
              <option key={f} value={f}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </option>
            ))}
          </select>

          <button
            onClick={handleAssignGrades}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Assign Final Grades
          </button>
        </div>

        {selectedExam && (
          <div className="bg-blue-50 p-4 rounded-md shadow max-w-2xl mx-auto mb-6">
            <p className="font-semibold mb-2">
              Enter {enrollments.length} marks comma/space separated:
            </p>
            <textarea
              rows={3}
              className="w-full border p-2 rounded"
              placeholder="Example: 27, 26, 25, 24, 20 ..."
              value={bulkMarks}
              onChange={(e) => setBulkMarks(e.target.value)}
            />
            <button
              onClick={handleBulkUpload}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded mt-3 font-semibold"
            >
              Upload All Marks in One Click
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Student ID</th>
                <th className="border px-4 py-2">Name</th>
                {selectedExam ? (
                  <th className="border px-4 py-2">
                    {selectedExam.charAt(0).toUpperCase() + selectedExam.slice(1)}
                  </th>
                ) : (
                  <>
                    <th className="border px-4 py-2">Total</th>
                    <th className="border px-4 py-2">Grade</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {enrollments.map((enr) => (
                <tr key={enr._id}>
                  <td className="border px-4 py-2">{enr.student.collegeId}</td>
                  <td className="border px-4 py-2">{enr.student.name}</td>

                  {selectedExam ? (
                    <td className="border px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={grades[enr._id]?.[selectedExam] ?? ""}
                        onChange={(e) =>
                          handleGradeChange(enr._id, selectedExam, e.target.value)
                        }
                        className="border px-2 py-1 rounded w-20"
                      />
                    </td>
                  ) : (
                    <>
                      <td className="border px-4 py-2">{grades[enr._id]?.total ?? "-"}</td>
                      <td className="border px-4 py-2">{grades[enr._id]?.letterGrade ?? "-"}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AssignGrade;
