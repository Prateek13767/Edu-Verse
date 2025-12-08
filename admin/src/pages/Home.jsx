import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import DashboardCard from "../components/DashboardCard";

const Home = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />

        {/* Page Content */}
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Add Faculty"
            description="Register new faculty into the system."
          />
          <DashboardCard
            title="Add Student"
            description="Register students with their batch & department."
          />
          <DashboardCard
            title="View Faculty"
            description="List and manage all faculty members."
          />
          <DashboardCard
            title="View Students"
            description="View, search & manage student records."
          />
          <DashboardCard
            title="Add Course Offering"
            description="Offer a new course for the semester."
          />
          <DashboardCard
            title="View Course Offerings"
            description="See all current course offerings."
          />
          <DashboardCard
            title="Assign Faculty / Coordinator"
            description="Assign instructor(s) and coordinator to a course."
          />
          <DashboardCard
            title="Access Attendance"
            description="View attendance sheets for any offering."
          />
          <DashboardCard
            title="Access Grade Sheets"
            description="View grade sheets of students."
          />
          <DashboardCard
            title="Change Semesters"
            description="Promote students based on completed credits."
          />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;
