// import React from 'react'

import { Box } from "@mui/material";
import DoctorDashboard from "./DoctorDashboard";
import { ROLE_MAP } from "../constant";
import PatientDashboard from "./PatientDashboard";
import ShipperDashboard from "./ShipperDashboard";
import PharmacyDashboard from "./PharmacyDashboard";

export default function Dashboard() {
  const userInfo=localStorage.getItem("userInfo");
  const {accountType}=JSON.parse(userInfo)||{};

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }} className="container">
     {accountType===ROLE_MAP.doctor&&<DoctorDashboard />} 
     {accountType===ROLE_MAP.patient&&<PatientDashboard />} 
     {accountType===ROLE_MAP.shipper&&<ShipperDashboard />} 
     {accountType===ROLE_MAP.pharmacy&&<PharmacyDashboard />} 
    </Box>
  );
}
