// import React from 'react'

import { Box } from "@mui/material";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import DoctorDashboard from "./DoctorDashboard";

export default function Dashboard() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }} className="container">
      <Header />
      <Navigation />
      <DoctorDashboard />
      <Footer />
    </Box>
  );
}
