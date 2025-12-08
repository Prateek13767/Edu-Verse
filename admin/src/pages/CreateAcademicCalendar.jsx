import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const CreateAcademicCalendar = () => {
  const [formData, setFormData] = useState({
    semester: "odd",
    year: "",
    resultReleaseDate: "",
    courseRegStart: "",
    courseRegEnd: "",
    classesStart: "",
    classesEnd: "",
    midSemesterStart: "",
    midSemesterEnd: "",
    semesterStart: "",
    semesterEnd: "",
    endSemesterStart: "",
    endSemesterExamEnd: "",
    holidays: [],
  });

  const [holiday, setHoliday] = useState({ name: "", startDate: "", endDate: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const addHoliday = () => {
    if (!holiday.name || !holiday.startDate || !holiday.endDate) return;
    setFormData({ ...formData, holidays: [...formData.holidays, holiday] });
    setHoliday({ name: "", startDate: "", endDate: "" });
  };

  const removeHoliday = (index) =>
    setFormData({
      ...formData,
      holidays: formData.holidays.filter((_, i) => i !== index),
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/academiccalendar/create", formData);
      alert("Academic Calendar Created Successfully");

      setFormData({
        semester: "odd",
        year: "",
        resultReleaseDate: "",
        courseRegStart: "",
        courseRegEnd: "",
        classesStart: "",
        classesEnd: "",
        midSemesterStart: "",
        midSemesterEnd: "",
        semesterStart: "",
        semesterEnd: "",
        endSemesterStart: "",
        endSemesterExamEnd: "",
        holidays: [],
      });
    } catch (error) {
      console.log(error);
      alert("Error creating calendar");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar active="academic-calendar" />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">📅 Create Academic Calendar</h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-md space-y-6"
          >
            {/* Year & Semester */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-semibold">Academic Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="font-semibold">Semester</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                >
                  <option value="odd">Odd</option>
                  <option value="even">Even</option>
                </select>
              </div>
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ["courseRegStart", "Course Registration Start"],
                ["courseRegEnd", "Course Registration End"],
                ["classesStart", "Classes Start"],
                ["classesEnd", "Classes End"],
                ["midSemesterStart", "Mid-Semester Exam Start"],
                ["midSemesterEnd", "Mid-Semester Exam End"],
                ["semesterStart", "Semester Start"],
                ["semesterEnd", "Semester End"],
                ["endSemesterStart", "End-Semester Exam Start"],
                ["endSemesterExamEnd", "End-Semester Exam End"],
                ["resultReleaseDate", "Result Release Date"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className="font-semibold">{label}</label>
                  <input
                    type="date"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2 mt-1"
                  />
                </div>
              ))}
            </div>

            {/* Holidays */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-3">🏖 Holidays</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <input
                  type="text"
                  placeholder="Holiday Name"
                  value={holiday.name}
                  onChange={(e) => setHoliday({ ...holiday, name: e.target.value })}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="date"
                  value={holiday.startDate}
                  onChange={(e) => setHoliday({ ...holiday, startDate: e.target.value })}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="date"
                  value={holiday.endDate}
                  onChange={(e) => setHoliday({ ...holiday, endDate: e.target.value })}
                  className="border rounded px-3 py-2"
                />
              </div>

              <button
                type="button"
                onClick={addHoliday}
                className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
              >
                ➕ Add Holiday
              </button>

              <ul className="mt-4 space-y-2">
                {formData.holidays.map((h, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
                  >
                    <span>
                      {h.name} — {h.startDate} to {h.endDate}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeHoliday(idx)}
                      className="text-red-500 font-semibold"
                    >
                      ✖
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-lg"
            >
              {loading ? "Saving..." : "Create Calendar"}
            </button>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CreateAcademicCalendar;
