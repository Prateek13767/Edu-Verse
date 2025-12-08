import React from "react";
const DashboardCard = ({ title, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer border">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default DashboardCard;
