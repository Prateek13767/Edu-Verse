import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AllContext } from "../context/AllContext";

const gradeFields = [
  { key: "assignments", label: "Assignments" },
  { key: "midsem", label: "Mid Sem" },
  { key: "endsem", label: "End Sem" },
  { key: "quiz", label: "Quiz" },
  { key: "project", label: "Project" },
];

const CoordinatorStudentDetails = () => {
  const { enrollmentId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, facultyToken } = useContext(AllContext);

  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState(null); // populated enrollment
  const [grade, setGrade] = useState(null); // grade document (may be null)
  const [localGrades, setLocalGrades] = useState({
    assignments: "",
    midsem: "",
    endsem: "",
    quiz: "",
    project: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!enrollmentId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1) fetch enrollment (expect it to be populated server-side or populate manually)
        const enrRes = await axios.get(`${backendUrl}/enrollment/${enrollmentId}`, {
          headers: { Authorization: `Bearer ${facultyToken}` },
        });
        // backend should return enrollment with populated student & offering
        const fetched = enrRes.data.enrollment || enrRes.data; // guard
        setEnrollment(fetched);

        // 2) fetch grade for this enrollment
        const gradeRes = await axios.get(`${backendUrl}/grade/enrollment/${enrollmentId}`, {
          headers: { Authorization: `Bearer ${facultyToken}` },
        });

        const gradeDetails = gradeRes.data.gradeDetails || null;
        setGrade(gradeDetails);

        if (gradeDetails) {
          setLocalGrades({
            assignments: gradeDetails.assignments ?? "",
            midsem: gradeDetails.midsem ?? "",
            endsem: gradeDetails.endsem ?? "",
            quiz: gradeDetails.quiz ?? "",
            project: gradeDetails.project ?? "",
          });
        }
      } catch (err) {
        console.error("Error fetching enrollment / grade:", err);
        alert("Failed to load enrollment or grade details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [enrollmentId, backendUrl, facultyToken]);

  const handleChange = (field, value) => {
    // allow empty string or number
    const numeric = value === "" ? "" : Number(value);
    setLocalGrades((p) => ({ ...p, [field]: numeric }));
  };

  const handleCreateGrade = async () => {
    if (!enrollmentId) return;
    try {
      setSaving(true);
      const res = await axios.post(
        `${backendUrl}/grade/create`,
        { enrollmentId },
        { headers: { Authorization: `Bearer ${facultyToken}` } }
      );
      if (res.data.success) {
        setGrade(res.data.grade);
        alert("Grade record created. You can now enter marks.");
      } else {
        alert(res.data.message || "Failed to create grade record.");
      }
    } catch (err) {
      console.error("Error creating grade:", err);
      alert("Error creating grade record.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    // If grade doesn't exist, create it first
    try {
      setSaving(true);
      if (!grade) {
        const createRes = await axios.post(
          `${backendUrl}/grade/create`,
          { enrollmentId },
          { headers: { Authorization: `Bearer ${facultyToken}` } }
        );
        if (!createRes.data.success) {
          alert(createRes.data.message || "Failed to create grade record.");
          setSaving(false);
          return;
        }
        setGrade(createRes.data.grade);
      }

      // Now update grade using updateGrade endpoint
      // controller expects: gradeId, newAssignments, newMidSem, newEndSem, newQuiz, newProject
      const payload = {
        gradeId: grade ? grade._id || grade.id : undefined,
        newAssignments: localGrades.assignments === "" ? 0 : Number(localGrades.assignments),
        newMidSem: localGrades.midsem === "" ? 0 : Number(localGrades.midsem),
        newEndSem: localGrades.endsem === "" ? 0 : Number(localGrades.endsem),
        newQuiz: localGrades.quiz === "" ? 0 : Number(localGrades.quiz),
        newProject: localGrades.project === "" ? 0 : Number(localGrades.project),
      };

      const updateRes = await axios.post(
        `${backendUrl}/grade/update`,
        payload,
        { headers: { Authorization: `Bearer ${facultyToken}` } }
      );

      if (updateRes.data.success) {
        setGrade(updateRes.data.updated);
        alert("Grades saved successfully.");
      } else {
        alert(updateRes.data.message || "Failed to save grades.");
      }
    } catch (err) {
      console.error("Error saving grade:", err);
      alert("Error saving grades.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
          <p className="text-gray-600">Loading student details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!enrollment) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
          <p className="text-red-600">Enrollment not found.</p>
        </div>
        <Footer />
      </>
    );
  }

  const student = enrollment.student || {};
  const offering = enrollment.offering || {};
  const course = offering.course || {};

  const computedTotal =
    (Number(localGrades.assignments || grade?.assignments || 0) || 0) +
    (Number(localGrades.quiz || grade?.quiz || 0) || 0) +
    (Number(localGrades.project || grade?.project || 0) || 0) +
    (Number(localGrades.midsem || grade?.midsem || 0) || 0) +
    (Number(localGrades.endsem || grade?.endsem || 0) || 0);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 text-gray-800 px-6 py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-indigo-700">
                Student Details
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Enrollment ID: <span className="font-medium">{enrollment._id}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(-1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Back
              </button>
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                {saving ? "Saving..." : "Save Grades"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Student Info */}
            <div className="space-y-3">
              <h2 className="font-medium text-lg">Student</h2>
              <p><b>Name:</b> {student.name || "-"}</p>
              <p><b>College ID:</b> {student.collegeId || "-"}</p>
              <p><b>Email:</b> {student.email || "-"}</p>
              <p><b>Department:</b> {student.department || "-"}</p>
              <p><b>Batch:</b> {student.batch || "-"}</p>
            </div>

            {/* Right: Offering / Course Info */}
            <div className="space-y-3">
              <h2 className="font-medium text-lg">Course Offering</h2>
              <p><b>Course:</b> {course.name || course.title || "-"}</p>
              <p><b>Course Code:</b> {course.code || "-"}</p>
              <p><b>Semester:</b> {offering.semester ?? "-"}</p>
              <p><b>Year:</b> {offering.year ?? "-"}</p>
              <p><b>Coordinator:</b> {offering.coordinator || "-"}</p>
            </div>
          </div>

          <hr className="my-6" />

          {/* Grades Editor */}
          <div>
            <h2 className="text-lg font-medium mb-3">Grades</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {gradeFields.map(f => (
                <div key={f.key} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">{f.label}</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={
                      // Prefer local edited value; fallback to fetched grade value; else empty
                      localGrades[f.key] !== "" ? localGrades[f.key] : (grade?.[f.key] ?? "")
                    }
                    onChange={(e) => handleChange(f.key, e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              ))}

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Total</label>
                <div className="px-3 py-2 border rounded bg-gray-50">{computedTotal}</div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Letter Grade</label>
                <div className="px-3 py-2 border rounded bg-gray-50">{grade?.letterGrade ?? "-"}</div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Grade Points</label>
                <div className="px-3 py-2 border rounded bg-gray-50">{grade?.gradePoints ?? "-"}</div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              {!grade && (
                <button
                  onClick={handleCreateGrade}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {saving ? "Creating..." : "Create Grade Record"}
                </button>
              )}

              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                {saving ? "Saving..." : "Save / Update Grade"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CoordinatorStudentDetails;
