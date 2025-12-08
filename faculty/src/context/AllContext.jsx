import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export const AllContext = createContext();

const AllContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [faculty, setFaculty] = useState(null);
  const [facultyToken, setFacultyToken] = useState(
    localStorage.getItem("facultyToken") || ""
  );

  const [departmentStudents, setDepartmentStudents] = useState([]);
  const [coordinatingCourses, setCoordinatingCourses] = useState([]);
  const [instructingCourses, setInstructingCourses] = useState([]);

  const navigate = useNavigate();

  // 🔹 Logout Helper
  const logoutFaculty = () => {
    setFaculty(null);
    setFacultyToken("");
    localStorage.removeItem("facultyToken");
    navigate("/faculty-login");
  };

  // 🔹 Decode token safely
  const decodeFacultyId = () => {
    try {
      if (!facultyToken) return null;
      const decoded = jwtDecode(facultyToken);
      return decoded.id || decoded.facultyId || null;
    } catch {
      toast.error("Session expired. Please login again.");
      logoutFaculty();
      return null;
    }
  };

  const facultyId = decodeFacultyId();

  // 🔹 Fetch faculty details
  const fetchFacultyDetails = async () => {
    try {
      if (!facultyId) return;

      const res = await axios.get(`${backendUrl}/faculty/${facultyId}`, {
        headers: { Authorization: `Bearer ${facultyToken}` },
      });

      if (res.data.success) {
        setFaculty(res.data.faculty);
      } else {
        toast.error(res.data.message);
        logoutFaculty();
      }
    } catch {
      toast.error("Session expired. Please login again.");
      logoutFaculty();
    }
  };

  // 🔹 Fetch students from faculty's department
  const fetchDepartmentStudentDetails = async () => {
    try {
      if (!faculty || !faculty.department) return;

      const res = await axios.post(
        `${backendUrl}/student/filter`,
        { department: faculty.department }
      );

      if (res.data.success) setDepartmentStudents(res.data.students);
      else toast.error(res.data.message);
    } catch {
      toast.error("Unable to fetch students");
    }
  };

  // 🔹 Fetch coordinating courses
  const fetchCoordinatingCoursesDetails = async () => {
    try {
      if (!facultyId) return;

      const res = await axios.post(
        `${backendUrl}/courseoffering/filter`,
        { coordinatorId: facultyId }
      );

      if (res.data.success) setCoordinatingCourses(res.data.offerings);
      else toast.error(res.data.message);
    } catch {
      toast.error("Unable to fetch coordinating courses");
    }
  };

  // 🔹 Fetch instructing courses
  const fetchInstructingCoursesDetails = async () => {
    try {
      if (!facultyId) return;

      const res = await axios.post(
        `${backendUrl}/courseoffering/filter`,
        { instructorId: facultyId }
      );

      if (res.data.success) setInstructingCourses(res.data.offerings);
      else toast.error(res.data.message);
    } catch {
      toast.error("Unable to fetch instructing courses");
    }
  };

  // 🔥 Load faculty when token changes
  useEffect(() => {
    if (!facultyToken) {
      setFaculty(null);
      navigate("/faculty-login");
      return;
    }
    fetchFacultyDetails();
  }, [facultyToken]);

  // 🔥 Once faculty details arrive fetch dependent data
  useEffect(() => {
    if (faculty) {
      fetchDepartmentStudentDetails();
      fetchCoordinatingCoursesDetails();
      fetchInstructingCoursesDetails();
    }
  }, [faculty]);

  // 🔥 Global redirect — No page should open without login
  useEffect(() => {
    if (!facultyToken) {
      navigate("/faculty-login");
    }
  }, [facultyToken, navigate]);

  const value = {
    backendUrl,
    navigate,
    facultyToken,
    setFacultyToken,
    faculty,
    setFaculty,
    logoutFaculty,
    departmentStudents,
    setDepartmentStudents,
    coordinatingCourses,
    setCoordinatingCourses,
    instructingCourses,
    setInstructingCourses,
  };

  return (
    <AllContext.Provider value={value}>{children}</AllContext.Provider>
  );
};

export default AllContextProvider;
