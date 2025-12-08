import React from "react";

const Footer = () => {
  return (
    <footer className="mt-16 bg-white border-t border-gray-200 py-6">
      <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
        <p>
          © {new Date().getFullYear()} <span className="text-blue-600 font-semibold">MNIT Faculty Portal</span>. 
          All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
