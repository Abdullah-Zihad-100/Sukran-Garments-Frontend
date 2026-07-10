import { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  // Lazy initial state: Eiti shudhu matro prothom mount e run hobe, protitabh render e noy
  const [token, setToken] = useState(() => localStorage.getItem("adminToken"));

  const login = (t) => {
    setToken(t);
    localStorage.setItem("adminToken", t);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("adminToken");
  };

  // Browser er onno kono tab e logout korle jate automatic ekhaneu state update hoy tar jonno listen kora
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("adminToken"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AdminContext.Provider value={{ token, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
