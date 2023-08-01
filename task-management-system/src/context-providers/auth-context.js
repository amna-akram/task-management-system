import React, { createContext, useContext, useState } from "react";
import { getUser } from "../utils/db";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (userData) => {
    try {
      const response = await getUser(userData);

      if (response.length === 1) {
        const { id, username, groupId } = response[0];

        localStorage.setItem("username", username);
        localStorage.setItem("group", groupId);
        setUser({ id, username, groupId });
      } else {
        console.error("Invalid username or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
