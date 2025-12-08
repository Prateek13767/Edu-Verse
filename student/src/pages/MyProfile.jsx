import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { AllContext } from "../context/AllContext";

const formatDate = (dob) => {
  if (!dob) return "";
  const d = new Date(dob);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const MyProfile = () => {
  const { student } = useContext(AllContext);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen flex flex-col">
        <Navbar />

        <div className="p-6 flex justify-center">
          <div className="bg-white shadow-xl rounded-lg p-8 w-[750px] space-y-6">

            <h1 className="text-3xl font-bold text-blue-700 text-center">
              My Profile
            </h1>

            {/* Photo + Name */}
            <div className="flex flex-col items-center gap-3 mb-2">
              <img
                src={
                  student?.photoUrl ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="profile"
                className="w-40 h-48 rounded border object-cover"
              />
              <p className="text-xl font-semibold text-gray-800">
                {student?.name}
              </p>
            </div>

            {/* Details */}
            <div className="text-gray-800 grid grid-cols-2 gap-y-4 gap-x-10 text-[17px]">

              <p><span className="font-semibold text-gray-600">College ID:</span> {student?.collegeId}</p>
              <p><span className="font-semibold text-gray-600">Programme:</span> {student?.programme}</p>

              <p><span className="font-semibold text-gray-600">Branch:</span> {student?.department}</p>
              <p><span className="font-semibold text-gray-600">Batch:</span> {student?.batch}</p>

              <p><span className="font-semibold text-gray-600">Date of Birth:</span> {formatDate(student?.dob)}</p>
              <p><span className="font-semibold text-gray-600">Father's Name:</span> {student?.fathersName}</p>

              <p><span className="font-semibold text-gray-600">Phone:</span> {student?.phone}</p>
              <p><span className="font-semibold text-gray-600">Email:</span> {student?.email}</p>

              <p className="col-span-2">
                <span className="font-semibold text-gray-600">Address:</span> {student?.address}
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default MyProfile;
