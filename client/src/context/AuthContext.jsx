import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api.get("/users/profile")
        .then(res => {
          const userData = res.data.user || res.data;
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (token) => {
    localStorage.setItem("token", token);

    const res = await api.get("/users/profile");

    const userData = res.data.user || res.data;
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};