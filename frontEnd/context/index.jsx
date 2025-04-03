import { createContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { API } from "../src/utils";

const UserContext = createContext();

const UseProvider = ({ children }) => {
  const [userInfo, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // verify token and fetch user info on initial load
  useEffect(() => {
    API.get("/session")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
  };
  const handleLoading = (loading) => {
    setLoading(loading);
  };

  const logoutUser = async () => {
    await API.post("/logout");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ userInfo, loginUser, logoutUser, loading,handleLoading }}>
      {children}
    </UserContext.Provider>
  );
};
UseProvider.propTypes = { children: PropTypes.node }
export { UserContext, UseProvider };
