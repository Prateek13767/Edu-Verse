import React from "react";
import { useNavigate } from "react-router-dom";

const CoordinatingCourses = ({ courses = [] }) => {
  const navigate = useNavigate();

  const handleViewDetails = (offeringId) => {
    navigate(`/courses/coordinator/${offeringId}`);
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-indigo-600 border-b-2 border-indigo-300 pb-2">
        Coordinating Courses
      </h2>

      {courses.length === 0 ? (
        <p className="text-gray-500 italic">No coordinating courses found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((offering) => (
            <div
              key={offering._id}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-bold mb-2">
                {offering.course?.name || "Unknown Course"}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Course Code:</strong> {offering.course?.code || "-"}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Credits:</strong> {offering.course?.credits ?? "-"}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Semester:</strong> {offering.semester || "-"}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Year:</strong> {offering.year || "-"}
              </p>

              <button
                onClick={() => handleViewDetails(offering._id)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CoordinatingCourses;
