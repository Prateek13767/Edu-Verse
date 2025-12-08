import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CoordinatingCourses from "../components/CoordinatingCourses";
import InstructingCourses from "../components/InstructingCourses";
import { AllContext } from "../context/AllContext";

const MyCourses = () => {

  const {coordinatingCourses,instructingCourses}=useContext(AllContext);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 text-gray-800 px-6 py-10">
        <h1 className="text-3xl font-bold text-center mb-10 text-indigo-700">
          My Courses
        </h1>

        {/* Coordinating Courses */}
        <CoordinatingCourses courses={coordinatingCourses} />

        {/* Instructing Courses */}
        <InstructingCourses courses={instructingCourses} />
      </div>

      <Footer />
    </>
  );
};

export default MyCourses;
