import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export const AllContext = createContext();

const AllContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [student, setStudent] = useState(null);
  const [studentToken, setStudentToken] = useState(
    localStorage.getItem("studentToken") || ""
  );
  const [settings, setSettings] = useState(null);

  const navigate = useNavigate();

  // ---------- LOGIN ----------
  const loginStudent = async (email, password) => {
    try {
      const { data } = await axios.post(`${backendUrl}/student/login`, {
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("studentToken", data.token);
        setStudentToken(data.token);
        toast.success("Login successful");
        navigate("/");
      } else toast.error(data.message);
    } catch {
      toast.error("Login failed");
    }
  };

  // ---------- GET STUDENT ----------
  const getStudentProfile = async () => {
    if (!studentToken) return;

    try {
      const decoded = jwtDecode(studentToken);
      const studentId = decoded.id;

      const { data } = await axios.get(`${backendUrl}/student/${studentId}`, {
        headers: { Authorization: `Bearer ${studentToken}` },
      });

      if (data.success) {
        setStudent(data.student);
      } else {
        toast.error(data.message);
        logoutStudent();
      }
    } catch {
      toast.error("Session expired. Please login again.");
      logoutStudent();
    }
  };

  // ---------- GET SETTINGS ----------
  const getSettings = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/settings/get`);
      if (data.success) setSettings(data.settings);
      else toast.error(data.message);
    } catch {
      toast.error("Unable to fetch global settings");
    }
  };

  // ---------- AUTO CALL ----------
  useEffect(() => {
    getSettings(); // on first load
  }, []);

  // 🔥 If studentToken missing → redirect to /login
  useEffect(() => {
    if (!studentToken) {
      setStudent(null);
      navigate("/login");
      return;
    }
    getStudentProfile();
  }, [studentToken]);

  // ---------- LOGOUT ----------
  const logoutStudent = () => {
    setStudent(null);
    setStudentToken("");
    localStorage.removeItem("studentToken");
    navigate("/login");
  };

  const value = {
    student,
    studentToken,
    settings,
    loginStudent,
    logoutStudent,
    getStudentProfile,
    getSettings,
  };

  return (
    <AllContext.Provider value={value}>{children}</AllContext.Provider>
  );
};

export default AllContextProvider;
