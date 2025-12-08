import React, { useContext } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { AllContext } from "../context/AllContext";

const FacultyCard = () => {
  const { faculty } = useContext(AllContext);

  // 🔹 Show loader until faculty data available
  if (!faculty) {
    return (
      <div className="flex justify-center items-center mt-20">
        <p className="text-gray-600 text-lg">Loading faculty details...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center mt-16 mb-12">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg rounded-2xl p-8 w-full max-w-md transition-all hover:shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Faculty"
            className="w-24 h-24 rounded-full shadow-md border-2 border-indigo-300 mb-4"
          />

          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            {faculty.name}
          </h2>
          <p className="text-indigo-600 font-medium mb-4">
            {faculty.designation}, {faculty.department}
          </p>

          <div className="text-sm text-gray-600 space-y-2">
            <p className="flex items-center justify-center gap-2">
              <Mail size={16} /> {faculty.email}
            </p>
            <p className="flex items-center justify-center gap-2">
              <Phone size={16} /> {faculty.phone}
            </p>
            <p className="flex items-center justify-center gap-2">
              <MapPin size={16} /> {faculty.address}
            </p>
            <p className="text-gray-700 font-medium mt-2">
              Employee ID: {faculty.employeeId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyCard;
