import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";    // ⬅️ imported

const Login = () => {
  const backendUrl=import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${backendUrl}/chiefwarden/login`, { email, password });

      if (!data.success) {
        alert(data.message);
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.studentId || data.facultyId || "");

      // TEMP: redirect to chief warden after login
      navigate("/");

    } catch (error) {
      console.log(error);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* PAGE BODY */}
      <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
        <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-[#0F172A] mb-6">
            Hostel Management System
          </h1>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md mb-4 bg-gray-50 focus:bg-white focus:border-[#0F172A] outline-none"
            />

            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md mb-6 bg-gray-50 focus:bg-white focus:border-[#0F172A] outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F172A] hover:bg-[#172554] text-white py-2 rounded-md font-medium transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      {/* FOOTER FROM COMPONENTS */}
      <Footer />
    </>
  );
};

export default Login;
