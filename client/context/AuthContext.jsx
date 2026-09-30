
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export const Authcontext = createContext();

export const Authprovider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ---------- Axios Configuration ----------
  axios.defaults.baseURL = backend_url;

  // ---------- Check Authentication ----------
  const checkAuth = async (savedToken = token) => {
    if (!savedToken) {
      setAuthUser(null);
      setAuthLoading(false);
      return;
    }

    try {
      axios.defaults.headers.common["token"] = savedToken;

      const { data } = await axios.get("/api/auth/check");

      if (data.success) {
        setAuthUser(data.user);
      } else {
        setAuthUser(null);
      }
    } catch (error) {
      console.error(
        "Auth check error:",
        error.response?.data || error.message
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["token"];
        setToken(null);
        setAuthUser(null);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // ---------- Login / Register ----------
  const login = async (state, credential) => {
    try {
      const { data } = await axios.post(
        `/api/auth/${state}`,
        credential
      );

      if (data.success) {
        setAuthUser(data.user);

        if (data.token) {
          axios.defaults.headers.common["token"] =
            data.token;

          localStorage.setItem("token", data.token);
          setToken(data.token);
        }

        toast.success(data.message || "Success");
      } else {
        toast.error(data.message || "Authentication failed");
      }
    } catch (error) {
      console.error(
        "Login/Register error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Something went wrong"
      );
    }
  };

  // ---------- Logout ----------
  const logout = () => {
    localStorage.removeItem("token");

    delete axios.defaults.headers.common["token"];

    setToken(null);
    setAuthUser(null);

    toast.success("Logged out successfully");
  };

  // ---------- Restore Session on Refresh ----------
  useEffect(() => {
    if (!backend_url) {
      console.error("VITE_BACKEND_URL is missing!");
      setAuthLoading(false);
      return;
    }

    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);
      checkAuth(savedToken);
    } else {
      setAuthLoading(false);
    }
  }, []);

  const value = {
    axios,
    authUser,
    token,
    authLoading,
    login,
    logout,
    checkAuth,
  };

  return (
    <Authcontext.Provider value={value}>
      {children}
    </Authcontext.Provider>
  );
};