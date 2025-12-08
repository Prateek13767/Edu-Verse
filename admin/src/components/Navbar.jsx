import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <button className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
