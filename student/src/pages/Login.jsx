import React, { useState, useContext } from "react";
import { AllContext } from "../context/AllContext.jsx";
import { toast } from "react-toastify";
import { Mail, Lock, LogIn } from "lucide-react";

const Login = () => {
  const { loginStudent } = useContext(AllContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    await loginStudent(email, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex justify-center items-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md border border-white/30"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600 tracking-wide">
          Student Portal
        </h2>

        {/* Email */}
        <div className="mb-5">
          <label className="block font-medium mb-1">Email</label>
          <div className="flex items-center border border-gray-300 bg-white rounded-md px-3">
            <Mail size={20} className="text-gray-500 mr-2" />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full py-2 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-7">
          <label className="block font-medium mb-1">Password</label>
          <div className="flex items-center border border-gray-300 bg-white rounded-md px-3">
            <Lock size={20} className="text-gray-500 mr-2" />
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full py-2 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md text-lg font-semibold shadow-md transition ${
            loading && "opacity-60 cursor-not-allowed"
          }`}
        >
          <LogIn size={20} />
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
