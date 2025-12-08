import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { AllContext } from "../context/AllContext.jsx";

const formatText = (text) => {
  if (!text) return "";
  if (typeof text !== "string") return String(text);
  return text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatDate = (dob) => {
  if (!dob) return "";
  const date = new Date(dob);
  if (isNaN(date)) return dob; // fallback if it's already plain text
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const Home = () => {
  const { student } = useContext(AllContext);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 flex flex-col bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-6 flex flex-col items-center gap-10">

          {/* FRONT SIDE — MNIT STYLE */}
          <div className="w-[650px] bg-white shadow-2xl rounded-md p-6 border border-gray-300">
            {/* Header */}
            <div className="flex gap-4 items-center">
              <img src="/mnit_logo.png" alt="logo" className="w-20 h-20" />
              <div className="leading-tight text-[14px]">
                <p className="font-bold text-blue-900 text-[16px]">
                  मालवीय राष्ट्रीय प्रौद्योगिकी संस्थान जयपुर
                </p>
                <p className="font-bold text-blue-900 text-[16px]">
                  Malaviya National Institute of Technology Jaipur
                </p>
                <p className="text-[12px]">
                  (Institution of National Importance, Established by Govt. of India)
                </p>
                <p className="text-[12px]">
                  J.L.N. MARG, JAIPUR-302017, Rajasthan (INDIA)
                </p>
              </div>
            </div>

            {/* Main Details + Photo */}
            <div className="flex justify-between mt-5">
              {/* Left details */}
              <div className="space-y-2 text-[16px] leading-tight">
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  <span className="font-bold text-red-600">
                    {formatText(student?.name)}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">ID No.:</span> {student?.collegeId}
                </p>
                <p>
                  <span className="font-semibold">Father’s Name:</span>{" "}
                  {formatText(student?.fathersName)}
                </p>
                <p>
                  <span className="font-semibold">Branch:</span>{" "}
                  {formatText(student?.department)}
                </p>
                <p>
                  <span className="font-semibold">Programme:</span>{" "}
                  {formatText(student?.programme)}
                </p>
                <p>
                  <span className="font-semibold">D.O.B:</span>{" "}
                  {formatDate(student?.dob)}
                </p>
                <p>
                  <span className="font-semibold">Valid Upto:</span>{" "}
                  {student?.validUpto || "30-06-2027"}
                </p>
              </div>

              {/* Photo */}
              <img
                src={
                  student?.photoUrl ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="student"
                className="w-36 h-44 border border-gray-500 object-cover"
              />
            </div>

            {/* Signature */}
            <div className="flex justify-end mt-6">
              <div className="text-center">
                <img
                  src="/signature.jpg"
                  alt="sign"
                  className="h-12 mx-auto opacity-90"
                />
                <p className="text-[14px] font-semibold">Dean Students Welfare</p>
              </div>
            </div>
          </div>

          {/* BACK SIDE — LIKE PHOTO, WITH REMAINING FIELDS */}
          {/* BACK SIDE — LIKE MNIT ORIGINAL */}
<div className="w-[650px] bg-gray-50 shadow-2xl rounded-md p-6 border border-gray-300">

  

  {/* DETAILS (VERTICAL LIST) */}
  <div className="text-[15px] text-gray-900 space-y-1">
    <p><span className="font-semibold">E-Mail:</span> {student?.email}</p>
    <p>
      <span className="font-semibold">Permanent Address:</span>{" "}
      {student?.address}
    </p>
    <p><span className="font-semibold">Student Contact No.:</span> {student?.phone}</p>
    {student?.emergency && (
      <p><span className="font-semibold">Emergency No.:</span> {student?.emergency}</p>
    )}
    {student?.bloodGroup && (
      <p><span className="font-semibold">Blood Group:</span> {student?.bloodGroup}</p>
    )}
  </div>

  {/* Center barcode + ID */}
<div className="flex flex-col items-center mb-5">

  {/* WIDE + SHORT BARCODE */}
  <div className="w-[380px] h-[120px] flex justify-between">
    {Array.from({ length: 55 }).map((_, idx) => (
      <div
        key={idx}
        className={`h-full ${
          idx % 7 === 0
            ? "w-[7px] bg-black"
            : idx % 5 === 0
            ? "w-[5px] bg-black"
            : idx % 3 === 0
            ? "w-[4px] bg-black"
            : idx % 2 === 0
            ? "w-[3px] bg-black"
            : "w-[2px] bg-transparent"
        }`}
      />
    ))}
  </div>

  {/* ID under barcode */}
  <p className="mt-3 font-mono text-[16px] tracking-wider font-semibold">
    {student?.collegeId}
  </p>
</div>




  {/* Instructions like real card */}
  <div className="mt-6 text-[13px] text-gray-700">
    <h3 className="font-bold mb-1">Instructions:</h3>
    <ol className="list-decimal list-inside space-y-1">
      <li>The identity card is Non-Transferable.</li>
      <li>
        If lost / found, please return the identity card to Dean Students Welfare Office,
        Prabha Bhawan, MNIT Jaipur - 302017.
      </li>
    </ol>
    <p className="mt-3 text-[11px]">
      Website: mnit.ac.in &nbsp;|&nbsp; E-mail: swoffice@mnit.ac.in
    </p>
  </div>
</div>

        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;
