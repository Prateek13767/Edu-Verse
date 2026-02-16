import React, { useContext, useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { AllContext } from "../context/AllContext.jsx";

const TimeTable = () => {
  const { student } = useContext(AllContext);
  const [enrollments, setEnrollments] = useState([]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    "08:00-09:00",
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "12:00-13:00",
    "13:00-14:00",
    "14:00-15:00",
    "15:00-16:00",
    "16:00-17:00",
    "17:00-18:00",
  ];

  useEffect(() => {
    if (!student?._id) return;

    const fetchEnrollments = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/enrollment/student/${student._id}`);
        const data = res.data.enrollments || [];

        // show only approved + schedule assigned
        const filtered = data.filter(
          (e) =>
            e.status?.toLowerCase() === "approved" &&
            e.faculty !== null &&
            Array.isArray(e.schedule) &&
            e.schedule.length > 0
        );

        setEnrollments(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEnrollments();
  }, [student]);

  const timetable = useMemo(() => {
    const grid = {};
    days.forEach((d) => {
      grid[d] = {};
      timeSlots.forEach((t) => (grid[d][t] = null));
    });

    const format = (time) => time.slice(0, 5); // convert "09:00:00" to "09:00"

    enrollments.forEach((en) => {
      en.schedule?.forEach((s) => {
        const startHour = parseInt(format(s.startTime).split(":")[0]);
        const endHour = parseInt(format(s.endTime).split(":")[0]);
        const duration = endHour - startHour; // theory = 1, lab = 2

        for (let h = startHour; h < endHour; h++) {
          const slotKey = `${String(h).padStart(2, "0")}:00-${String(h + 1)
            .padStart(2, "0")}:00`;

          if (grid[s.day] && grid[s.day][slotKey] !== undefined) {
            grid[s.day][slotKey] = {
              code: en.offering.course.code,
              name: en.offering.course.name,
              faculty: en.faculty?.name,
              room: s.room,
              duration,
            };
          }
        }
      });
    });

    // 🍱 LUNCH: prefer 13–14 else 12–13
    days.forEach((day) => {
      if (!grid[day]["13:00-14:00"]) grid[day]["13:00-14:00"] = { lunch: true };
      else if (!grid[day]["12:00-13:00"]) grid[day]["12:00-13:00"] = { lunch: true };
    });

    return grid;
  }, [enrollments]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-gray-100">
        <Navbar />

        <div className="p-8 flex flex-col items-center gap-8">
          <div className="bg-white w-[1200px] rounded-md border shadow-xl p-6">
            <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
              Weekly Time-Table
            </h1>

            <div className="overflow-auto">
              <table className="w-full text-center border border-gray-400">
                <thead>
                  <tr className="bg-blue-100 font-bold text-lg">
                    <th className="border py-4 px-6">Day</th>
                    {timeSlots.map((slot) => (
                      <th key={slot} className="border py-4 px-6">
                        {slot}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {days.map((day) => (
                    <tr key={day} className="border">
                      <td className="border py-4 px-6 font-semibold bg-gray-50">
                        {day}
                      </td>

                      {timeSlots.map((slot) => {
                        const entry = timetable[day][slot];

                        return (
                          <td
                            key={slot}
                            className="border py-4 px-3 text-xs align-top h-[90px]"
                          >
                            {entry ? (
                              entry.lunch ? (
                                <div className="w-full h-full bg-yellow-300 flex items-center justify-center font-bold text-sm text-yellow-900">
                                  🍱 LUNCH BREAK
                                </div>
                              ) : (
                                <div className="font-semibold text-blue-700 leading-tight space-y-1">
                                  <div className="text-[13px]">{entry.code}</div>
                                  <div className="text-gray-800 text-[11px] italic">
                                    {entry.name}
                                  </div>
                                  <div className="text-gray-600 text-[10px]">
                                    Room {entry.room}
                                  </div>
                                  <div className="text-gray-500 text-[10px]">
                                    {entry.faculty}
                                  </div>
                                </div>
                              )
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-center mt-5 text-gray-600 text-sm">
              Shows only classes with assigned Faculty & Schedule.
              <br />
              🍱 Lunch break inserted daily (Priority 1–2 PM, else 12–1 PM)
              <br />
              LAB classes occupy 2 consecutive hours automatically.
              <br />
              Saturday & Sunday are OFF (No classes)
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default TimeTable;
