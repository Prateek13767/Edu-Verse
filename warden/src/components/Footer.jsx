import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#0F172A] text-gray-300 py-4 text-center border-t border-gray-700 mt-auto">
      <p className="text-sm">
        © {new Date().getFullYear()} Hostel Management System • Warden Panel
      </p>
      <p className="text-xs mt-1 opacity-70">
        Developed by EduVerse | MNIT Jaipur
      </p>
    </footer>
  );
};

export default Footer;
