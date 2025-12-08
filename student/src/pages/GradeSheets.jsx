import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { AllContext } from "../context/AllContext.jsx";
import GradeCard from "../components/GradeCard";

const GradeSheets = () => {
  const { student } = useContext(AllContext);
  const [selectedSem, setSelectedSem] = useState("");

  const gradeSheets = student?.gradeSheets || [];

  // unique semester list from gradeSheets
  const semesterList = gradeSheets.map((g) => g.semester).sort((a, b) => a - b);

  const selectedSheet = gradeSheets.find((g) => g.semester == selectedSem);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 flex flex-col bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-8 flex flex-col items-center gap-6">

          <div className="bg-white shadow-xl border rounded-md p-6 w-[750px]">
            <h1 className="text-2xl font-bold text-center text-blue-900 mb-6">
              Grade Sheet Portal
            </h1>

            {/* Select Semester Dropdown */}
            <div className="flex flex-col items-center gap-3 mb-6">
              <label className="font-semibold text-lg">Select Semester</label>
              <select
                className="border px-4 py-2 rounded-md w-60 bg-gray-50"
                value={selectedSem}
                onChange={(e) => setSelectedSem(e.target.value)}
              >
                <option value="">-- Select --</option>
                {semesterList.map((sem, index) => (
                  <option key={index} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* Display Grade Card */}
            {selectedSem && selectedSheet && <GradeCard sheet={selectedSheet} />}

            {/* If no record */}
            {selectedSem && !selectedSheet && (
              <p className="text-center text-red-600 font-semibold">
                No grade data found for semester {selectedSem}
              </p>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default GradeSheets;
