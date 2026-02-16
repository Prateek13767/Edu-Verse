import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/warden-login");
  };

  return (
    // header spans full width; stays fixed at top
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md">
      {/* inner container is shifted right by sidebar width (ml-64) so content lines up */}
      <div className="ml-64 h-16 flex items-center justify-between px-6">
        {/* Left: title */}
        <h1 className="text-xl font-semibold text-gray-800">Warden Dashboard</h1>

        {/* Right: profile + logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-semibold">
              W
            </div>
            <span className="text-gray-700 text-sm font-medium">Warden</span>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
