import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Home, User, BookOpen, LogOut, GraduationCap, Calendar } from "lucide-react";
import { AllContext } from "../context/AllContext.jsx";

const Sidebar = () => {
  const { logoutStudent } = useContext(AllContext);

  return (
    <div className="h-screen w-64 bg-white shadow-lg p-6 flex flex-col">
      <h1 className="text-2xl font-bold text-blue-600 mb-10 tracking-tight">
        Dashboard
      </h1>

      <nav className="flex flex-col gap-6 text-gray-700 font-medium">

        <Link to="/" className="flex items-center gap-3 hover:text-blue-600">
          <Home size={20} /> Home
        </Link>

        <Link to="/profile" className="flex items-center gap-3 hover:text-blue-600">
          <User size={20} /> Profile
        </Link>

        <Link to="/courses" className="flex items-center gap-3 hover:text-blue-600">
          <BookOpen size={20} /> Courses
        </Link>

        <Link to="/grades" className="flex items-center gap-3 hover:text-blue-600">
          <GraduationCap size={20} /> Grade Sheet
        </Link>

        <Link to="/timetable" className="flex items-center gap-3 hover:text-blue-600">
          <Calendar size={20} /> Time Table
        </Link>

      </nav>

      <button
        onClick={logoutStudent}
        className="mt-auto flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md font-medium transition"
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
