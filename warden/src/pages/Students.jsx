import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const Students = () => {
  const [students, setStudents] = useState([]);

  // TEMP — Replace with API call later
  useEffect(() => {
    setStudents([
      {
        id: 1,
        name: "Prateek Soni",
        collegeId: "2023UCP1593",
        room: "H1-102",
        phone: "9876543210",
      },
      {
        id: 2,
        name: "Aayush Meena",
        collegeId: "2023UCP1620",
        room: "H1-203",
        phone: "9123456780",
      },
    ]);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 fixed left-0 top-0 h-full z-50">
        <Sidebar />
      </aside>

      {/* RIGHT SIDE CONTENT */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">

        {/* NAVBAR */}
        <Navbar />

        {/* MAIN CONTENT */}
        <main className="flex-1 px-14 pt-28 pb-14 max-w-7xl mx-auto w-full">

          {/* Page Header */}
          <h1 className="text-4xl font-bold mb-3">Hostel Students</h1>
          <p className="text-gray-600 mb-10 text-lg">
            A complete list of students assigned to your hostel.
          </p>

          {/* White Card Wrapper */}
          <div className="bg-white rounded-2xl shadow-lg p-10 overflow-x-auto">

            {/* Table */}
            <table className="min-w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-gray-100 rounded-xl">
                  <th className="px-6 py-4 font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">College ID</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Room</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Phone</th>
                  <th className="px-6 py-4 font-semibold text-center text-gray-700">Actions</th>
                </tr>
              </thead>

              <tbody>
                {students.map((s) => (
                  <tr
                    key={s.id}
                    className="bg-gray-50 hover:bg-gray-100 transition rounded-xl"
                  >
                    <td className="px-6 py-4 text-gray-900">{s.name}</td>
                    <td className="px-6 py-4">{s.collegeId}</td>
                    <td className="px-6 py-4">{s.room}</td>
                    <td className="px-6 py-4">{s.phone}</td>

                    <td className="px-6 py-4 flex gap-4 justify-center">

                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm transition">
                        View
                      </button>

                      <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg text-sm transition">
                        Room Info
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
};

export default Students;
