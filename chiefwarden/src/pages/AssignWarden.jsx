import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AssignWarden = () => {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [facultyList, setFacultyList] = useState([]);
  const [wardenFacultyIds, setWardenFacultyIds] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [currentWarden, setCurrentWarden] = useState(null); // NEW
  const [error, setError] = useState("");
  const [hostel, setHostel] = useState(null);

  // Load Hostel + Faculty + Warden info
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Hostel
        const hostelRes = await axios.get(`${backendUrl}/hostel/${hostelId}`);
        if (hostelRes.data.success) setHostel(hostelRes.data.hostel);

        // 2. All Faculty
        const facultyRes = await axios.get(`${backendUrl}/faculty/`);
        if (facultyRes.data.success) {
          setFacultyList(facultyRes.data.allFaculty || []);
        }

        // 3. All Wardens
        const wardenRes = await axios.get(`${backendUrl}/warden/all`);
        if (wardenRes.data.success) {
          const ids = wardenRes.data.wardens.map(w => w.faculty._id);
          setWardenFacultyIds(ids);
        }

        // 4. Current hostel warden
        const current = await axios.get(`${backendUrl}/warden/hostel/${hostelId}`);
        if (current.data.success) {
          setCurrentWarden(current.data.warden || null);
        }

      } catch (error) {
        console.log(error);
      }
    };

    loadData();
  }, [hostelId]);

  // Assign new warden
  const handleAssign = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedFaculty) {
      setError("Please select a faculty.");
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/warden/add`, {
        hostel: hostelId,
        faculty: selectedFaculty,
      });

      if (res.data.success) {
        alert("Warden assigned successfully!");
        navigate("/wardens");
      } else {
        setError(res.data.message);
      }

    } catch (error) {
      console.log(error);
      setError("Something went wrong.");
    }
  };

  // Remove current warden
  const handleRemove = async () => {
    if (!currentWarden) return;

    if (!confirm("Are you sure you want to remove this warden?")) return;

    try {
      const res = await axios.delete(
        `${backendUrl}/warden/remove/${currentWarden._id}`
      );

      if (res.data.success) {
        alert("Warden removed successfully.");
        navigate(0); // reload page
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Error removing warden.");
    }
  };

  // Update warden
  const handleUpdate = async () => {
    if (!selectedFaculty) {
      setError("Please select a faculty to update.");
      return;
    }

    try {
      const res = await axios.put(
        `${backendUrl}/warden/update/${currentWarden._id}`,
        { faculty: selectedFaculty }
      );

      if (res.data.success) {
        alert("Warden updated successfully!");
        navigate(0);
      } else {
        setError(res.data.message);
      }

    } catch (error) {
      console.log(error);
      alert("Error updating warden.");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">

      <aside className="w-64 fixed left-0 top-0 h-full bg-[#0F172A] text-white z-50">
        <Sidebar />
      </aside>

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 px-10 pt-24 pb-10 max-w-xl mx-auto w-full">

          <h1 className="text-3xl font-bold mb-6">Assign / Update Warden</h1>

          {hostel && (
            <p className="text-gray-700 mb-6">
              <strong>Hostel:</strong> {hostel.name}
            </p>
          )}

          {/* Current Warden Section */}
          {currentWarden ? (
            <div className="mb-6 bg-white p-5 border rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-2">Current Warden</h2>

              <p><strong>Name:</strong> {currentWarden.faculty.name}</p>
              <p><strong>Email:</strong> {currentWarden.faculty.email}</p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleRemove}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Remove Warden
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 mb-4">No warden assigned yet.</p>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          {/* Dropdown Form */}
          <div className="bg-white p-8 rounded-xl shadow-md border space-y-6">
            <label className="block font-medium mb-2">Select Faculty</label>

            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg"
            >
              <option value="">-- Select Faculty --</option>

              {facultyList.map((f) => {
                const isWarden = wardenFacultyIds.includes(f._id);

                return (
                  <option
                    key={f._id}
                    value={f._id}
                    disabled={isWarden && (!currentWarden || currentWarden.faculty._id !== f._id)}
                  >
                    {f.name} ({f.email})
                    {isWarden && (!currentWarden || currentWarden.faculty._id !== f._id)
                      ? " — Already a Warden"
                      : ""}
                  </option>
                );
              })}
            </select>

            {/* Assign / Update Buttons */}
            {!currentWarden ? (
              <button
                onClick={handleAssign}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
              >
                Assign Warden
              </button>
            ) : (
              <button
                onClick={handleUpdate}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
              >
                Update Warden
              </button>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AssignWarden;
