import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

/* FULL BRANCH NAMES */
const branchList = [
  "Computer Science and Engineering",
  "Electronics and Communication Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering"
];

const AddCourseOffering = () => {
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);
  const [recentOffering, setRecentOffering] = useState(null);

  const [form, setForm] = useState({
    course: "",
    semester: "",
    year: "",
    branches: [],
    coordinator: "",
    instructors: [],
  });

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchCourses();
    fetchFaculty();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:3000/course", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.allcourses || []);
    } catch {
      setCourses([]);
    }
  };

  const fetchFaculty = async () => {
    try {
      const res = await axios.get("http://localhost:3000/faculty", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaculty(res.data.allFaculty || []);
    } catch {
      setFaculty([]);
    }
  };

  /* Generic input handler */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // When coordinator changes → auto-add to instructors
    if (name === "coordinator") {
      setForm((prev) => {
        const updated = new Set(prev.instructors);
        if (value) updated.add(value);
        return { ...prev, coordinator: value, instructors: [...updated] };
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    // Show course details when selected
    if (name === "course") {
      const selected = courses.find((c) => c._id === value);
      setSelectedCourseDetails(selected || null);
    }
  };

  /* Toggle branch checkbox */
  const handleBranchToggle = (branch) => {
    setForm((prev) => {
      const updated = new Set(prev.branches);
      updated.has(branch) ? updated.delete(branch) : updated.add(branch);
      return { ...prev, branches: [...updated] };
    });
  };

  /* Toggle instructor checkbox */
  const handleInstructorToggle = (facultyId) => {
    if (facultyId === form.coordinator) return; // cannot deselect coordinator

    setForm((prev) => {
      const updated = new Set(prev.instructors);
      updated.has(facultyId) ? updated.delete(facultyId) : updated.add(facultyId);
      return { ...prev, instructors: [...updated] };
    });
  };

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/courseoffering/add",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setRecentOffering(res.data.courseAdded);
        setTimeout(() => setRecentOffering(null), 3000);

        setForm({
          course: "",
          semester: "",
          year: "",
          branches: [],
          coordinator: "",
          instructors: [],
        });
        setSelectedCourseDetails(null);
      }
    } catch {
      alert("Error adding course offering");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-10 bg-gray-100 min-h-screen">
          <h1 className="text-3xl font-bold mb-6 text-indigo-700">Add Course Offering</h1>

          {/* SUCCESS POPUP */}
          {recentOffering && (
            <div className="bg-green-100 border border-green-600 text-green-700 p-4 rounded mb-6">
              <strong>Course Offering Added:</strong>{" "}
              {recentOffering.course?.code} - {recentOffering.course?.name} (Sem{" "}
              {recentOffering.semester}, {recentOffering.year})
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md">
            {/* Course */}
            <label className="block mb-2 font-semibold">Course</label>
            <select
              name="course"
              value={form.course}
              onChange={handleChange}
              className="w-full p-3 border rounded mb-4"
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>

            {/* Show course details */}
            {selectedCourseDetails && (
              <div className="border p-4 rounded-xl bg-gray-50 mb-6">
                <h2 className="text-xl font-semibold mb-2">Course Details</h2>
                <p><strong>ID:</strong> {selectedCourseDetails.code}</p>
                <p><strong>Name:</strong> {selectedCourseDetails.name}</p>
                <p><strong>Credits:</strong> {selectedCourseDetails.credits}</p>
                <p><strong>Category:</strong> {selectedCourseDetails.courseType}</p>
                <p><strong>Description:</strong> {selectedCourseDetails.syllabus}</p>
              </div>
            )}

            {/* Semester + Year */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 font-semibold">Semester</label>
                <input
                  type="number"
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  className="w-full p-3 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Year</label>
                <input
                  type="number"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  className="w-full p-3 border rounded"
                />
              </div>
            </div>

            {/* Branch checkboxes */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Branches (tick all that apply)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {branchList.map((branch) => (
                  <label key={branch} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.branches.includes(branch)}
                      onChange={() => handleBranchToggle(branch)}
                      className="h-4 w-4"
                    />
                    <span>{branch}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Coordinator */}
            <label className="block mb-2 font-semibold">Coordinator</label>
            <select
              name="coordinator"
              value={form.coordinator}
              onChange={handleChange}
              className="w-full p-3 border rounded mb-4"
            >
              <option value="">Select Coordinator</option>
              {faculty.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name} — {f.designation} ({f.department})
                </option>
              ))}
            </select>

            {/* Instructors */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold">Instructors (multiple allowed)</label>
              <div className="max-h-64 overflow-y-auto border rounded p-3">
                {faculty.map((f) => {
                  const isCoordinator = f._id === form.coordinator;
                  const checked = form.instructors.includes(f._id);

                  return (
                    <label key={f._id} className="flex items-center gap-2 mb-1">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={isCoordinator}
                        onChange={() => handleInstructorToggle(f._id)}
                        className="h-4 w-4"
                      />
                      <span>
                        {f.name} — {f.designation} ({f.department})
                        {isCoordinator && (
                          <span className="ml-2 text-xs text-blue-600 font-semibold">
                            (Coordinator)
                          </span>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer"
            >
              ➕ Add Course Offering
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AddCourseOffering;
