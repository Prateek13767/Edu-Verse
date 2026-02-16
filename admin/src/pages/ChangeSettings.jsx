import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const ChangeSettings = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [settings, setSettings] = useState(null);

  const [newAcademicYear, setNewAcademicYear] = useState("");
  const [newSem, setNewSem] = useState("");

  const token = localStorage.getItem("adminToken");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // 🔥 Fetch current settings
  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${backendUrl}/settings/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSettings(res.data.settings);
      setNewAcademicYear(res.data.settings.academicYear);
      setNewSem(res.data.settings.currentSem);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // 1️⃣ GENERATE RESULTS
  const handleGenerateResults = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post(
        `${backendUrl}/admin/generate-result`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(
        `✅ Results generated successfully for ${res.data.processedStudents} students`
      );
    } catch {
      setMessage("❌ Failed to generate results");
    }
    setLoading(false);
  };

  // 2️⃣ TOGGLE REGISTRATION
  const handleToggleRegistration = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/settings/update`,
        {
          key: "isRegistrationOpen",
          value: !settings.isRegistrationOpen,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      fetchSettings();
    } catch {
      setMessage("❌ Something went wrong!");
    }
    setLoading(false);
  };

  // 3️⃣ TOGGLE GRADE SHEETS
  const handleToggleGradeSheets = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/settings/update`,
        {
          key: "areGradeSheetsVisible",
          value: !settings.areGradeSheetsVisible,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      fetchSettings();
    } catch {
      setMessage("❌ Something went wrong!");
    }
    setLoading(false);
  };

  // 4️⃣ UPDATE ACADEMIC YEAR
  const handleUpdateAcademicYear = async () => {
    if (!newAcademicYear) return;

    if (settings.isRegistrationOpen) {
      return setMessage("❌ Close registration before changing academic year");
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/settings/update`,
        {
          key: "academicYear",
          value: newAcademicYear,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message);
      fetchSettings();
    } catch {
      setMessage("❌ Failed to update academic year");
    }
    setLoading(false);
  };

  // 5️⃣ UPDATE CURRENT SEMESTER
  const handleUpdateSem = async () => {
    if (settings.isRegistrationOpen) {
      return setMessage("❌ Close registration before changing semester");
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/settings/update`,
        {
          key: "currentSem",
          value: newSem,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message);
      fetchSettings();
    } catch {
      setMessage("❌ Failed to update current semester");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar active="settings" />

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-10">⚙ Admin Controls</h1>

          {/* 🔹 CURRENT STATUS */}
          {settings && (
            <div className="mb-10 space-y-3">
              <p className="text-lg font-semibold">
                🔓 Registration:
                <span
                  className={`ml-2 ${
                    settings.isRegistrationOpen
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {settings.isRegistrationOpen ? "OPEN" : "CLOSED"}
                </span>
              </p>

              <p className="text-lg font-semibold">
                📄 Grade Sheets:
                <span
                  className={`ml-2 ${
                    settings.areGradeSheetsVisible
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {settings.areGradeSheetsVisible ? "VISIBLE" : "HIDDEN"}
                </span>
              </p>

              <p className="text-lg font-semibold">
                📅 Academic Year:
                <span className="ml-2 text-blue-700">
                  {settings.academicYear}
                </span>
              </p>

              <p className="text-lg font-semibold">
                🎓 Current Semester:
                <span className="ml-2 text-purple-700">
                  {settings.currentSem}
                </span>
              </p>
            </div>
          )}

          {/* 🔥 ACTION BUTTONS */}
          <button
            onClick={handleGenerateResults}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold mb-6"
          >
            {loading ? "Generating Results..." : "Generate Results"}
          </button>
          <br />

          <button
            onClick={handleToggleRegistration}
            disabled={loading}
            className={`px-6 py-3 rounded font-semibold text-white mb-6 ${
              settings?.isRegistrationOpen
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {settings?.isRegistrationOpen
              ? "Close Course Registration"
              : "Open Course Registration"}
          </button>
          <br />

          <button
            onClick={handleToggleGradeSheets}
            disabled={loading}
            className={`px-6 py-3 rounded font-semibold text-white mb-10 ${
              settings?.areGradeSheetsVisible
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {settings?.areGradeSheetsVisible
              ? "Hide Grade Sheets"
              : "Make Grade Sheets Visible"}
          </button>

          {/* 🔄 CHANGE ACADEMIC YEAR */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-3">📅 Change Academic Year</h2>
            <input
              type="text"
              value={newAcademicYear}
              onChange={(e) => setNewAcademicYear(e.target.value)}
              className="border px-4 py-2 rounded w-64 mr-4"
              placeholder="e.g. 2023-2024"
            />
            <button
              onClick={handleUpdateAcademicYear}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
            >
              Update Academic Year
            </button>
          </div>

          {/* 🔄 CHANGE SEMESTER */}
          <div>
            <h2 className="text-xl font-bold mb-3">🎓 Change Current Semester</h2>
            <select
              value={newSem}
              onChange={(e) => setNewSem(e.target.value)}
              className="border px-4 py-2 rounded w-64 mr-4"
            >
              <option value="Odd">Odd</option>
              <option value="Even">Even</option>
            </select>
            <button
              onClick={handleUpdateSem}
              disabled={loading}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold"
            >
              Update Semester
            </button>
          </div>

          {/* 🔔 MESSAGE */}
          {message && (
            <p
              className={`mt-6 text-lg font-semibold ${
                message.includes("❌") ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ChangeSettings;
