import React, { useContext, useState } from "react";
import { Search, Mail, User, GraduationCap } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AllContext } from "../context/AllContext";

const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Correctly extract from context
  const { departmentStudents } = useContext(AllContext);

  // ✅ Handle case when data not loaded yet
  const filteredStudents = (departmentStudents || []).filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.collegeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-gray-800">Student Records</h1>
          <p className="text-gray-600 mt-2">
            View and manage details of all your enrolled students
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center bg-white shadow-md rounded-xl px-4 py-2 w-full max-w-lg border border-indigo-100">
            <Search className="text-indigo-500 mr-2" size={20} />
            <input
              type="text"
              placeholder="Search student by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Students Table */}
        <div className="flex justify-center px-4">
          <div className="w-full max-w-6xl overflow-x-auto rounded-2xl shadow-md border border-gray-200 bg-white">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-indigo-100 text-indigo-800">
                <tr>
                  <th className="px-6 py-3 font-semibold">College ID</th>
                  <th className="px-6 py-3 font-semibold">Current Sem</th>
                  <th className="px-6 py-3 font-semibold">Name</th>
                  <th className="px-6 py-3 font-semibold">Email</th>
                  <th className="px-6 py-3 font-semibold">CGPA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr
                      key={student._id}
                      className="hover:bg-indigo-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-3 font-medium text-gray-800">
                        {student.collegeId}
                      </td>
                      <td className="px-6 py-3 text-gray-700">
                        {student.currentSem}
                      </td>
                      <td className="px-6 py-3 text-gray-700">
                        <div className="flex items-center gap-2">
                          <User className="text-indigo-500" size={16} />
                          <span>{student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="text-gray-500" size={16} />
                          <span>{student.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-gray-700">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="text-indigo-500" size={16} />
                          <span>{student.cgpa?.toFixed(2) || "0.00"}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-6 text-center text-gray-500 italic"
                    >
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Students;
