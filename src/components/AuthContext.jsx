import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("retailertoken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
        setIsAuthenticated(true);
        console.log("Token is valid, user authenticated");
      } catch (error) {
        console.error("Token decode error:", error);
        localStorage.removeItem("retailertoken"); // Clear the token if it's invalid
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      console.log("No token found, user not authenticated");
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem("retailertoken", token);
    const decodedToken = jwtDecode(token);
    setUser(decodedToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("retailertoken");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
