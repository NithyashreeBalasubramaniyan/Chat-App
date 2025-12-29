import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export const Authcontext = createContext();

export const Authprovider = ({ children }) => {
  axios.defaults.baseURL = backend_url;

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);

  // 🔹 Check auth on refresh
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // 🔹 Login
  const login = async (state, credential) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credential);

      if (data.success) {
        setAuthUser(data.user);
        axios.defaults.headers.common["token"] = data.token;
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged out successfully");
  };

  // 🔹 On app load
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      axios.defaults.headers.common["token"] = savedToken;
      checkAuth();
    }
  }, []);

  const value = {
    axios,
    authUser,
    token,
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
