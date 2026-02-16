import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export const AllContext = createContext({
  backendUrl: "",
  warden: null,
  hostelId: null,
  wardenToken: "",
  loginWarden: () => {},
  logoutWarden: () => {},
});

const AllContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [warden, setWarden] = useState(null);
  const [hostelId, setHostelId] = useState(null);

  const [wardenToken, setWardenToken] = useState(
    localStorage.getItem("wardenToken") || ""
  );

  const navigate = useNavigate();

  // ---------- LOGIN ----------
  const loginWarden = async (email, password) => {
    try {
      const { data } = await axios.post(`${backendUrl}/warden/login`, {
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("wardenToken", data.token);
        setWardenToken(data.token);
        toast.success("Login successful");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Login failed");
    }
  };

  // ---------- GET WARDEN PROFILE ----------
  const getWardenProfile = async () => {
    if (!wardenToken) return;

    try {
      const decoded = jwtDecode(wardenToken);

      // ✅ SOURCE OF TRUTH
      setHostelId(decoded.hostelId);

      const wardenId = decoded.wardenId;

      const { data } = await axios.get(
        `${backendUrl}/warden/${wardenId}`,
        {
          headers: { Authorization: `Bearer ${wardenToken}` },
        }
      );

      if (data.success) {
        setWarden(data.warden);
      } else {
        logoutWarden();
      }
    } catch (error) {
      console.error("getWardenProfile error:", error);
      logoutWarden();
    }
  };

  // ---------- AUTO LOAD ----------
  useEffect(() => {
    if (!wardenToken) {
      setWarden(null);
      setHostelId(null);
      navigate("/login");
      return;
    }
    getWardenProfile();
  }, [wardenToken]);

  // ---------- LOGOUT ----------
  const logoutWarden = () => {
    setWarden(null);
    setHostelId(null);
    setWardenToken("");
    localStorage.removeItem("wardenToken");
    navigate("/login");
  };

  const value = {
    navigate,
    backendUrl,
    warden,
    hostelId,       // ✅ EXPOSED
    wardenToken,
    loginWarden,
    logoutWarden,
  };

  return (
    <AllContext.Provider value={value}>
      {children}
    </AllContext.Provider>
  );
};

export default AllContextProvider;
