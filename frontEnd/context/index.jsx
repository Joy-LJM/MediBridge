import { createContext, useState, useEffect, useMemo } from "react";
import PropTypes from 'prop-types';
import { API } from "../src/utils";
// React Context to share the userInfo state and auth methods across the app
const UserContext = createContext();

const UserProvider = ({ children }) => {
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
  const contextValue = useMemo(() => ({
    userInfo,
    loginUser,
    logoutUser,
    loading,
    handleLoading
  }), [userInfo, loading]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
UserProvider.propTypes = { children: PropTypes.node }
export { UserContext, UserProvider };
