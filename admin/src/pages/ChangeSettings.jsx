import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const ChangeSettings = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [settings, setSettings] = useState(null);

  const token = localStorage.getItem("adminToken");

  // 🔥 Fetch current settings on page load
  const fetchSettings = async () => {
    try {
      const res = await axios.get("http://localhost:3000/settings/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings(res.data.settings);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // 1️⃣ Promote Students & Generate Results
  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        "http://localhost:3000/result/upgrade-semester",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
    } catch {
      setMessage("❌ Something went wrong!");
    }
    setLoading(false);
  };

  // 2️⃣ Toggle Course Registration
  const handleToggleRegistration = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/settings/update",
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

  // 3️⃣ Toggle Grade Sheets Visibility
  const handleToggleGradeSheets = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/settings/update",
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar active="promote" />

        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-10">⚙ Admin Controls</h1>

          {/* 🔹 Current Status */}
          {settings && (
            <div className="mb-10 space-y-2">
              <p className="text-lg font-semibold">
                🔓 Registration:
                <span
                  className={
                    settings.isRegistrationOpen
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {settings.isRegistrationOpen ? " OPEN" : " CLOSED"}
                </span>
              </p>

              <p className="text-lg font-semibold">
                📄 Grade Sheets:
                <span
                  className={
                    settings.areGradeSheetsVisible
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {settings.areGradeSheetsVisible ? " VISIBLE" : " HIDDEN"}
                </span>
              </p>
            </div>
          )}

          {/* 🔥 Promote Students */}
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold mb-8"
          >
            Promote Students & Generate Results
          </button>
          <br />

          {/* 🔥 Toggle Registration */}
          <button
            onClick={handleToggleRegistration}
            disabled={loading}
            className={`px-6 py-3 rounded font-semibold text-white mb-8 ${
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

          {/* 🔥 Toggle Grade Sheets */}
          <button
            onClick={handleToggleGradeSheets}
            disabled={loading}
            className={`px-6 py-3 rounded font-semibold text-white ${
              settings?.areGradeSheetsVisible
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {settings?.areGradeSheetsVisible
              ? "Hide Grade Sheets"
              : "Make Grade Sheets Visible"}
          </button>

          {/* 🔔 Message */}
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
