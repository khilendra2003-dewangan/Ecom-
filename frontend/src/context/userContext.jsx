import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/api";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/profile"); // protected route
        setUser(res.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  const Register = async (form) => {
    const res = await API.post("/register", form);
    setUser(res.data.user || res.data);
  };

  const Login = async (form) => {
    const res = await API.post("/login", form, {
      withCredentials: true,
    });
    setUser(res.data.user || res.data);
  };

  const Logout = async () => {
    await API.post("/logout", {}, { withCredentials: true });
    setUser(null);
  };

  const updateProfile = async (form) => {
    const res = await API.put("/updateprofile", form);
    setUser(res.data.user || res.data);
    return res.data;
  };

  return (
    <UserContext.Provider value={{ user, loading, Login, Register, Logout, setUser, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
