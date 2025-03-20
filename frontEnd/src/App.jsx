import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verification from "./pages/Verification";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import PswReset from "./pages/PswReset";
import { ToastContainer } from "react-toastify";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear("userInfo");
    navigate("/");
  };
  const userInfo = localStorage.getItem("userInfo");
  useEffect(() => {
    if (userInfo) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [userInfo]);
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
  useEffect(()=>{

  })
  return (
    <>
    <ToastContainer/>
      <Header isLogin={isLogin} handleLogout={handleLogout} />
      <Navigation isLogin={isLogin} />
      <Routes>
        {ROUTES.map(({path,element})=> <Route key={path} path={path} element={element} />)}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
