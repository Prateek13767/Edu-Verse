import React, { useContext, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { AllContext } from "../context/AllContext";
import axios from "axios";
import { toast } from "react-toastify";

const Courses = () => {
  const { student, studentToken, settings } = useContext(AllContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [availableCourses, setAvailableCourses] = useState([]);
  const [selected, setSelected] = useState([]);
  const [enrollmentStatus, setEnrollmentStatus] = useState({}); // { offeringId : status }

  // 🔹 Fetch available offerings
  const fetchCourses = async () => {
    if (!student?.department || !student?.currentSem) return;
    try {
      const { data } = await axios.post(
        `${backendUrl}/courseoffering/filter`,
        {
          branch: student.department,
          semester: student.currentSem,
          year: new Date().getFullYear(),
        },
        { headers: { Authorization: `Bearer ${studentToken}` } }
      );

      if (data.success) {
        setAvailableCourses(data.offerings || []);
      } else toast.error(data.message);
    } catch {
      toast.error("Unable to load offered courses");
    }
  };

  // 🔹 Fetch enrollments and map offeringId → status
  const fetchEnrollments = async () => {
    if (!student?._id) return;
    try {
      const { data } = await axios.get(
        `${backendUrl}/enrollment/student/${student._id}`,
        { headers: { Authorization: `Bearer ${studentToken}` } }
      );

      if (data.success) {
        const statusMap = {};
        data.enrollments.forEach((e) => {
          if (
            e.offering.semester === student.currentSem &&
            e.offering.year === new Date().getFullYear()
          ) {
            statusMap[e.offering._id] = e.status.toLowerCase(); // pending / approved / rejected / dropped
          }
        });

        setEnrollmentStatus(statusMap);
      }
    } catch {
      console.log("Cannot fetch enrollments");
    }
  };

  // initial loads
  useEffect(() => {
    fetchCourses();
  }, [student]);

  useEffect(() => {
    fetchEnrollments();
  }, [student]);

  if (!settings || !student) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-gray-100 min-h-screen flex flex-col">
          <Navbar />
          <div className="p-10 text-center text-xl font-semibold text-gray-600">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  const registrationOpen = settings?.isRegistrationOpen;

  const totalCredits = selected.reduce((sum, id) => {
    const offering = availableCourses.find((o) => o._id === id);
    return sum + (offering?.course?.credits || 0);
  }, 0);

  const availableCredits = availableCourses.reduce(
    (sum, off) => sum + (off.course?.credits || 0),
    0
  );

  // One-way selection locking
  const handleCheckbox = (offeringId) => {
    // If enrollment exists in database → always locked
    if (enrollmentStatus.hasOwnProperty(offeringId)) return;

    // If already selected manually → cannot unselect
    if (selected.includes(offeringId)) return;

    const offering = availableCourses.find((c) => c._id === offeringId);

    if (
      !selected.includes(offeringId) &&
      totalCredits + offering.course.credits > 30
    ) {
      toast.error("You cannot select more than 30 credits");
      return;
    }

    setSelected((prev) => [...prev, offeringId]); // one-way addition only
  };

  // 🔥 Submit & refresh UI
  const submitEnrollment = async () => {
    if (!registrationOpen) return toast.error("Registration window is closed");
    if (selected.length === 0) return toast.error("Select at least one course");

    try {
      const { data } = await axios.post(
        `${backendUrl}/enrollment/addbulk`,
        {
          student: student._id,
          offerings: selected,
        },
        { headers: { Authorization: `Bearer ${studentToken}` } }
      );

      if (data.success) {
        toast.success("Enrollment submitted successfully!");
        setSelected([]);
        await Promise.all([fetchCourses(), fetchEnrollments()]); // refresh UI automatically
      } else toast.error(data.message);
    } catch {
      toast.error("Something went wrong while submitting enrollment");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen flex flex-col">
        <Navbar />

        <div className="p-6 flex justify-center">
          <div className="bg-white shadow-xl rounded-lg w-[950px] p-8">
            <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">
              Course Registration
            </h1>

            <p
              className={`text-center font-semibold text-lg mb-6 ${
                registrationOpen ? "text-green-600" : "text-red-600"
              }`}
            >
              {registrationOpen
                ? "Registration Window: OPEN"
                : "Registration Window: CLOSED"}
            </p>

            <table className="w-full border border-gray-300 rounded-md overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-center">Select</th>
                  <th className="py-3 px-4 text-left">Course Code</th>
                  <th className="py-3 px-4 text-left">Course Name</th>
                  <th className="py-3 px-4 text-center">Credits</th>
                  <th className="py-3 px-4 text-left">Coordinator</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {availableCourses.length > 0 ? (
                  availableCourses.map((off) => {
                    const status = enrollmentStatus[off._id];
                    const locked = enrollmentStatus.hasOwnProperty(off._id);

                    const statusColor =
                      status === "approved"
                        ? "text-green-600"
                        : status === "pending"
                        ? "text-blue-600"
                        : status === "rejected"
                        ? "text-red-600"
                        : status === "dropped"
                        ? "text-gray-500"
                        : "text-orange-600";

                    return (
                      <tr
                        key={off._id}
                        className="border-b hover:bg-gray-100 transition"
                      >
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            disabled={
                              !registrationOpen ||
                              locked ||
                              selected.includes(off._id)
                            }
                            checked={
                              locked || selected.includes(off._id)
                            }
                            onChange={() => handleCheckbox(off._id)}
                            className={`w-5 h-5 cursor-pointer ${
                              locked || selected.includes(off._id)
                                ? "opacity-40 cursor-not-allowed"
                                : ""
                            }`}
                          />
                        </td>

                        <td className="py-3 px-4 font-semibold text-blue-700">
                          {off.course.code}
                        </td>
                        <td className="py-3 px-4">{off.course.name}</td>
                        <td className="py-3 px-4 text-center font-semibold">
                          {off.course.credits}
                        </td>
                        <td className="py-3 px-4">
                          {off.coordinator?.name || "—"}
                        </td>
                        <td className={`py-3 px-4 font-semibold ${statusColor}`}>
                          {status ? status.toUpperCase() : "AVAILABLE"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-gray-500">
                      No courses offered for your semester and year
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <p className="text-right text-lg font-semibold text-gray-800 mt-6">
              Total Selected Credits: {totalCredits} / {availableCredits} (Max 30 allowed)
            </p>

            <div className="flex justify-center mt-6">
              <button
                onClick={submitEnrollment}
                disabled={!registrationOpen}
                className={`px-8 py-3 rounded-md font-semibold text-lg transition ${
                  registrationOpen
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                Submit Registration
              </button>
            </div>

            {selected.length > 0 && (
              <div className="text-center mt-4 text-gray-700">
                <p className="font-semibold mb-2">Selected Courses:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selected.map((id) => {
                    const off = availableCourses.find((o) => o._id === id);
                    return (
                      off && (
                        <span
                          key={id}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {off.course.name} — {off.course.credits} credits
                        </span>
                      )
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Courses;
