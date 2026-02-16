import React, { useState, useContext } from "react";
import Footer from "../components/Footer";
import { AllContext } from "../context/AllContext";

const Login = () => {
  const { loginWarden } = useContext(AllContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginWarden(form.email, form.password);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">

          <h2 className="text-2xl font-bold text-center mb-6">
            Warden Login
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="px-4 py-2 border rounded"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="px-4 py-2 border rounded"
            />

            <button
              type="submit"
              className="py-2 rounded text-white bg-black hover:bg-gray-900"
            >
              Login
            </button>

          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
