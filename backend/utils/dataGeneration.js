/*************************************************
 * Attendance / Absentee Data Generator
 * -----------------------------------------------
 * - Total students: configurable
 * - Total days: configurable
 * - Minimum attendance enforced (75%)
 * - Random, realistic absentee distribution
 * - Comma-separated output
 *************************************************/

// ====== CONFIGURATION ======
const TOTAL_STUDENTS = 100;   // change to 110 if needed
const TOTAL_DAYS = 7;
const MIN_ATTENDANCE_PERCENT = 75;

// Optional: minimum absentees per day (for realism)
const MIN_ABSENTEES = 14;

// ============================

function generateAbsentees(
  totalStudents,
  totalDays,
  minAttendancePercent,
  minAbsentees
) {
  const maxAbsentees = Math.floor(
    totalStudents * (1 - minAttendancePercent / 100)
  );

  const result = {};

  for (let day = 1; day <= totalDays; day++) {
    const absenteesCount =
      Math.floor(Math.random() * (maxAbsentees - minAbsentees + 1)) +
      minAbsentees;

    const absentees = new Set();

    while (absentees.size < absenteesCount) {
      const roll = Math.floor(Math.random() * totalStudents) + 1;
      absentees.add(roll);
    }

    result[`Day ${day}`] = Array.from(absentees).sort((a, b) => a - b);
  }

  return result;
}

// ====== GENERATE DATA ======
const attendanceData = generateAbsentees(
  TOTAL_STUDENTS,
  TOTAL_DAYS,
  MIN_ATTENDANCE_PERCENT,
  MIN_ABSENTEES
);

// ====== PRINT OUTPUT ======
console.log(`\nAttendance Absentee List`);
console.log(`Students: ${TOTAL_STUDENTS}`);
console.log(`Days: ${TOTAL_DAYS}`);
console.log(`Minimum Attendance: ${MIN_ATTENDANCE_PERCENT}%\n`);

for (const day in attendanceData) {
  console.log(
    `${day}: ${attendanceData[day].join(", ")}`
  );
}
