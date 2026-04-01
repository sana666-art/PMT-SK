import { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../api/userApi.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await getProfile();
      setUser(res.data.data);
      if (res.data.data.name) {
        localStorage.setItem("userName", res.data.data.name);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const login = async (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    // fetchProfile will trigger via useEffect
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, setUser, login, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};


