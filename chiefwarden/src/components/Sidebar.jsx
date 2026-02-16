import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menu = [
    { title: "Dashboard", path: "/" },
    { title: "Hostels", path: "/hostels" },
    { title: "Wardens", path: "/wardens" },
    { title: "Students", path: "/students" },
    { title: "Room Allocation", path: "/room-allocation" },
    { title: "Complaints", path: "/complaints" },
    { title: "Reports", path: "/reports" },
  ];

  return (
    <div className="h-screen w-64 bg-[#0F172A] text-white flex flex-col shadow-lg fixed left-0 top-0">
      {/* Header */}
      <div className="p-6 text-xl font-bold border-b border-gray-700">
        Chief Warden
      </div>

      {/* Menu Items */}
      <nav className="flex-1 mt-4">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-6 py-3 my-1 rounded-l-full transition-all ${
              location.pathname === item.path
                ? "bg-white text-[#0F172A] font-semibold"
                : "hover:bg-gray-700"
            }`}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
