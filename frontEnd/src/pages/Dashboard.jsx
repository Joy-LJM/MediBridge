// import React from 'react'

import { Box } from "@mui/material";
import DoctorDashboard from "./DoctorDashboard";
import { ROLE_MAP } from "../constant";
import PatientDashboard from "./PatientDashboard";
import ShipperDashboard from "./ShipperDashboard";
import PharmacyDashboard from "./PharmacyDashboard";

export default function Dashboard() {
  const userInfo=localStorage.getItem("userInfo");
  const {account}=JSON.parse(userInfo)||{};

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "fit-content" }} className="container">
     {account===ROLE_MAP.doctor&&<DoctorDashboard />} 
     {account===ROLE_MAP.patient&&<PatientDashboard />} 
     {account===ROLE_MAP.shipper&&<ShipperDashboard />} 
     {account===ROLE_MAP.pharmacy&&<PharmacyDashboard />} 
    </Box>
  );
}
