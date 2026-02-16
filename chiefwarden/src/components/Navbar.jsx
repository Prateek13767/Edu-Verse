import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 fixed top-0 right-0 ml-64 bg-white shadow-md z-20 w-[calc(100%-16rem)]">
      {/* Page Title */}
      <h1 className="text-xl font-semibold text-gray-800">
        Chief Warden Dashboard
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Profile */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-semibold">
            CW
          </div>
          <span className="text-gray-700 text-sm font-medium">Chief Warden</span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
