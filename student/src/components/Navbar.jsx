import React, { useContext } from "react";
import { AllContext } from "../context/AllContext.jsx";
import { Bell } from "lucide-react";

const Navbar = () => {
  const { student } = useContext(AllContext);

  return (
    <div className="w-full bg-white shadow-md py-3 px-6 flex justify-between items-center">
      <h2 className="text-2xl font-semibold text-gray-700">Welcome 👋</h2>

      <div className="flex items-center gap-6">
        <Bell size={22} className="text-gray-500 cursor-pointer hover:text-blue-600" />
        <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full font-medium">
          {student?.name || "Student"}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
