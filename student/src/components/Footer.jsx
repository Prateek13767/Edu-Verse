import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t text-center py-3 text-gray-600 text-sm">
      © {new Date().getFullYear()} Student Portal — All Rights Reserved.
    </footer>
  );
};

export default Footer;
