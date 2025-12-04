import { createContext, useContext, useState, useEffect } from "react";
import { userAPI } from "../api/modules/auth.api";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("auth_token") || "");

  // Load user automatically if token exists
  useEffect(() => {
    if (token) fetchLoggedInUser();
  }, []);

  const fetchLoggedInUser = async () => {
    try {
      const res = await userAPI();
      const userData = res?.data?.data?.user;

      if (userData) {
        setUser(userData);
      }
    } catch (err) {
      console.error("Auth load failed", err);
      logout();
    }
  };

  const login = (tokenValue, userData) => {
    setToken(tokenValue);
    setUser(userData);
    localStorage.setItem("auth_token", tokenValue);
    toast.success("Login Successful", { duration: 3000 });
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuth: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
