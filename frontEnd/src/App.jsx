import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";

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


  return (
    <>
      <Header isLogin={isLogin} handleLogout={handleLogout} />
      <Navigation isLogin={isLogin} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
