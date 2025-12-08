import React from "react";
import Navbar from "../components/Navbar";
import FacultyCard from "../components/FacultyCard";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="grow flex items-center justify-center pt-20">
        <FacultyCard />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
