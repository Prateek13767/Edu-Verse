import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const menu = [
    { label: "Add Faculty", path: "/admin/add-faculty" },
    { label: "Add Student", path: "/admin/add-student" },
    { label: "View Faculty", path: "/admin/view-faculty" },
    { label: "View Students", path: "/admin/view-students" },
    { label: "Add Course Offering", path: "/admin/add-offering" },
    { label: "View Offerings", path: "/admin/view-offerings" },
    { label: "Assign Faculty / Coordinator", path: "/admin/assign-faculty" },
    { label: "Access Attendance", path: "/admin/attendance" },
    { label: "Access Grade Sheets", path: "/admin/gradesheets" },
    { label: "Change Settings ", path: "/admin/settings" },
    // { label: "Create Academic Calendar", path:"/admin/create-academic-calendar"},
    // { label: "Show Calenders", path:"/admin/show-academic-calendar"}
  ];

  return (
    <div className="w-64 bg-gray-100 h-screen px-5 py-6 border-r shadow-md">
      <h2 className="text-xl font-bold mb-6">Options</h2>

      <ul className="space-y-4">
        {menu.map((item, idx) => (
          <li key={idx}>
            <Link
              to={item.path}
              className="block p-2 rounded hover:bg-indigo-200 hover:text-indigo-900"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
