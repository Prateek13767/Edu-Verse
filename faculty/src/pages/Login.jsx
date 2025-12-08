import React, { useState, useContext, useEffect } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import { AllContext } from "../context/AllContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { backendUrl, facultyToken, setFacultyToken, navigate } = useContext(AllContext);

  // 🔹 If faculty is already logged in, redirect immediately
  useEffect(() => {
    if (facultyToken || localStorage.getItem("facultyToken")) {
      navigate("/");
    }
  }, [facultyToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/faculty/login`, {
        email,
        password,
      });

      if (response.data.success) {
        setFacultyToken(response.data.token);
        localStorage.setItem("facultyToken", response.data.token);
        toast.success("Login successful!");
        navigate("/"); // Redirect immediately after login
      } else {
        toast.error(response.data.message || "Invalid credentials!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Faculty Login</h1>
          <p className="text-gray-500 text-sm">
            Sign in to manage your courses, students, and academic data.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                placeholder="faculty@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200"
          >
            <LogIn className="mr-2" size={18} />
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
