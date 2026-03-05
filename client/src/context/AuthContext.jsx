import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      setUser({ id: decoded.id });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwt_decode(token);
    setUser({ id: decoded.id });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};