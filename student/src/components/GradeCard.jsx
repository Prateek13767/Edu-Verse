import React from "react";

const GradeCard = ({ sheet, index }) => {
  return (
    <div className="bg-white p-5 border rounded-md shadow-md w-full">
      <h2 className="font-bold text-xl text-blue-800 text-center mb-4">
        Semester {sheet.semester}
      </h2>

      <div className="flex justify-around mb-4 text-[15px] font-medium">
        <p>SGPA: <span className="font-semibold text-green-700">{sheet.sgpa}</span></p>
        <p>CGPA: <span className="font-semibold text-blue-700">{sheet.cgpa}</span></p>
        <p>Credits Earned: <span className="font-semibold text-purple-700">{sheet.creditsEarned}</span></p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-400 text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="border py-2">#</th>
              <th className="border py-2">Course</th>
              <th className="border py-2">Grade</th>
            </tr>
          </thead>
          <tbody>
            {sheet.courses.map((c, i) => (
              <tr key={i}>
                <td className="border py-2">{i + 1}</td>
                <td className="border py-2">{c.enrollment?.courseName || "Course"}</td>
                <td className="border py-2 font-semibold">{c.grade?.letter || c.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-right text-xs italic text-gray-500">
        Generated on: {new Date(sheet.generatedAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default GradeCard;
