import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const Students = () => {
  const [students, setStudents] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔥 FETCH STUDENTS FROM BACKEND
  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${backendUrl}/student`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (res.data.success) {
        setStudents(res.data.students);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-64 fixed left-0 top-0 h-full bg-[#0F172A] text-white z-50">
        <Sidebar />
      </aside>

      {/* CONTENT */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 px-10 pt-24 pb-10 max-w-7xl mx-auto w-full">
          <h1 className="text-3xl font-bold mb-4">Students</h1>

          <p className="text-gray-600 mb-8">
            Click on a student to view complete details.
          </p>

          {/* LOADING STATE */}
          {loading ? (
            <div className="text-center py-20 text-gray-500">
              Loading students...
            </div>
          ) : (
            <div className="overflow-x-auto bg-white shadow-lg rounded-xl border">
              <table className="min-w-full text-left text-gray-700">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Name</th>
                    <th className="px-6 py-3 font-semibold">Roll No</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((s) => (
                    <tr
                      key={s._id}
                      onClick={() =>
                        navigate(`/students/${s._id}`, { state: s })
                      }
                      className="border-b cursor-pointer hover:bg-blue-50 transition"
                    >
                      <td className="px-6 py-4 font-medium">{s.name}</td>
                      <td className="px-6 py-4">{s.collegeId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {students.length === 0 && (
                <p className="text-center py-10 text-gray-500">
                  No students found
                </p>
              )}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Students;
