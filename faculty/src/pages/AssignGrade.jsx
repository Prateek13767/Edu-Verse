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

  const [summary, setSummary] = useState(null);

  const calculateSummary = (gradesObj) => {
  const gradeList = Object.values(gradesObj).filter(
    (g) => g?.letterGrade && typeof g.total === "number"
  );

  if (gradeList.length === 0) return null;

  const totals = gradeList.map((g) => g.total);
  const n = totals.length;

  const mean = totals.reduce((a, b) => a + b, 0) / n;

  const variance =
    totals.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / n;

  const stdDev = Math.sqrt(variance);

  const gradeCounts = {
    AA: 0,
    AB: 0,
    BB: 0,
    BC: 0,
    CC: 0,
    CD: 0,
    DD: 0,
    F: 0,
  };

  gradeList.forEach((g) => {
    if (gradeCounts[g.letterGrade] !== undefined) {
      gradeCounts[g.letterGrade]++;
    }
  });

  return {
    totalStudents: n,
    mean: mean.toFixed(2),
    stdDev: stdDev.toFixed(2),
    gradeCounts,
    passed: n - gradeCounts.F,
    failed: gradeCounts.F,
  };
};


  // ==================================================
  // FETCH ENROLLMENTS + GRADES (FACULTY-SPECIFIC)
  // ==================================================
  useEffect(() => {
    if (!offeringId || !faculty?._id) return;

    const fetchEnrollmentsAndGrades = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${backendUrl}/enrollment/offering/${offeringId}`
        );
        
        
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
            const gradeRes = await axios.get(
              `${backendUrl}/grade/enrollment/${enr._id}`
            );
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

  // ==================================================
  // LOCAL GRADE CHANGE
  // ==================================================
  const handleGradeChange = (enrollmentId, field, value) => {
    setGrades((prev) => ({
      ...prev,
      [enrollmentId]: {
        ...prev[enrollmentId],
        [field]: Number(value),
      },
    }));
  };

  // ==================================================
  // BULK UPLOAD
  // ==================================================
  const handleBulkUpload = async () => {
    if (!selectedExam) return alert("Select exam type first");

    const marks = bulkMarks
      .split(/[, ]+/)
      .map(Number)
      .filter((x) => !isNaN(x));

    if (marks.length !== enrollments.length) {
      return alert(
        `Expected ${enrollments.length} marks, received ${marks.length}`
      );
    }

    const payload = enrollments.map((enr, i) => ({
      enrollmentId: enr._id,
      marks: marks[i],
    }));

    try {
      const res=await axios.post(`${backendUrl}/grade/upload-bulk`, {
        offeringId,
        type: selectedExam,
        data: payload,
      });

      alert("Bulk marks uploaded successfully!");
      setBulkMarks("");

      // Refresh grades safely
      const updated = {};
      for (const enr of enrollments) {
        try {
          const g = await axios.get(
            `${backendUrl}/grade/enrollment/${enr._id}`
          );
          updated[enr._id] = g.data.gradeDetails || {};
        } catch {
          updated[enr._id] = {};
        }
      }

      setGrades(updated);
    } catch (err) {
      console.error(err);
      alert("Failed to upload marks");
    }
  };

  // ==================================================
  // ASSIGN FINAL GRADES
  // ==================================================
  const handleAssignGrades = async () => {
    try {
      await axios.post(`${backendUrl}/grade/assign-bulk`, { offeringId });

      const updated = {};
      for (const enr of enrollments) {
        try {
          const g = await axios.get(
            `${backendUrl}/grade/enrollment/${enr._id}`
          );
          updated[enr._id] = g.data.gradeDetails || {};
        } catch {
          updated[enr._id] = {};
        }
      }

      setGrades(updated);
      alert("Relative grades assigned successfully!");
    } catch {
      alert("Failed to assign grades");
    }
  };

  useEffect(() => {
  const s = calculateSummary(grades);
  setSummary(s);
}, [grades]);

  // ==================================================
  // UI
  // ==================================================
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 text-gray-800 px-6 py-10">
        <h1 className="text-3xl font-bold text-center mb-10 text-indigo-700">
          Assign Grades
        </h1>

        {/* CONTROLS */}
        <div className="mb-6 flex justify-center gap-4">
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
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
          >
            Assign Final Grades
          </button>
        </div>

        {/* SUMMARY SECTION (VISIBLE ONLY AFTER GRADES ARE ASSIGNED) */}
{summary && (
  <div className="max-w-5xl mx-auto mb-8 bg-white shadow rounded-lg p-6 border">
    <h2 className="text-xl font-bold mb-4 text-indigo-700">
      Grade Summary
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div>
        <p className="text-sm text-gray-500">Total Students</p>
        <p className="text-lg font-semibold">{summary.totalStudents}</p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Mean</p>
        <p className="text-lg font-semibold">{summary.mean}</p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Std Deviation</p>
        <p className="text-lg font-semibold">{summary.stdDev}</p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Pass / Fail</p>
        <p className="text-lg font-semibold">
          {summary.passed} / {summary.failed}
        </p>
      </div>
    </div>

    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
      {Object.entries(summary.gradeCounts).map(([grade, count]) => (
        <div
          key={grade}
          className="bg-gray-100 rounded p-3 font-semibold"
        >
          <p className="text-sm text-gray-500">{grade}</p>
          <p className="text-lg">{count}</p>
        </div>
      ))}
    </div>
  </div>
)}


        {/* BULK UPLOAD */}
        {selectedExam && (
          <div className="bg-blue-50 p-4 rounded-md shadow max-w-2xl mx-auto mb-6">
            <p className="font-semibold mb-2">
              Enter {enrollments.length} marks (comma/space separated):
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded mt-3 font-semibold cursor-pointer"
            >
              Upload All Marks 
            </button>
          </div>
        )}

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Student ID</th>
                <th className="border px-4 py-2">Name</th>
                {selectedExam ? (
                  <th className="border px-4 py-2">
                    {selectedExam.charAt(0).toUpperCase() +
                      selectedExam.slice(1)}
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
                  <td className="border px-4 py-2">
                    {enr.student?.collegeId}
                  </td>
                  <td className="border px-4 py-2">
                    {enr.student?.name}
                  </td>

                  {selectedExam ? (
                    <td className="border px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={grades[enr._id]?.[selectedExam] ?? ""}
                        onChange={(e) =>
                          handleGradeChange(
                            enr._id,
                            selectedExam,
                            e.target.value
                          )
                        }
                        className="border px-2 py-1 rounded w-20"
                      />
                    </td>
                  ) : (
                    <>
                      <td className="border px-4 py-2">
                        {grades[enr._id]?.total ?? "-"}
                      </td>
                      <td className="border px-4 py-2">
                        {grades[enr._id]?.letterGrade ?? "-"}
                      </td>
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
