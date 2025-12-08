import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AllContext } from "../context/AllContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logoutFaculty } = useContext(AllContext);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Students", path: "/students" },
    { name: "My Courses", path: "/courses" },
  ];

  // 🔹 Logout
  const handleLogout = () => {
    logoutFaculty(); // ⬅ central logout handling + redirect to /faculty-login
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-blue-600 cursor-pointer tracking-tight"
        >
          Faculty Portal
        </h1>

        <div className="flex items-center space-x-6">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative text-sm font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              {item.name}
              {location.pathname === item.path && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full"></span>
              )}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="ml-4 bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-all shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
