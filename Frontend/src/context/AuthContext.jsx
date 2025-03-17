import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (userData, token) => {
    if (!userData || !userData._id) {
      // console.error("Missing user ID in login data:", userData);
      alert("Login failed. Please try again.");
      return;
    }

    // console.log("Storing user and token in localStorage.");
    localStorage.setItem(
      "user",
      JSON.stringify({ ...userData, id: userData._id })
    );
    localStorage.setItem("token", token);
    setUser({ ...userData, id: userData._id });
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
