import { Navigate, Route, Routes } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verification from "./pages/Verification";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import { useContext } from "react";
import Footer from "./components/Footer";
import PswReset from "./pages/PswReset";
import { ToastContainer } from "react-toastify";
import { UserContext } from "../context";
import { Box } from "@mui/material";
function App() {

  const {  loading } = useContext(UserContext);

  const ROUTES = [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/password_reset",
      element: <PswReset />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/verification",
      element: <Verification />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/about",
      element: <About />,
    },
    {
      path: "/contact",
      element: <Contact />,
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ];
  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress disableShrink />
      </Box>
    );

  return (
    <>
      <ToastContainer />
      <Header/>
      <Navigation  />
      <Routes>
        {ROUTES.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
