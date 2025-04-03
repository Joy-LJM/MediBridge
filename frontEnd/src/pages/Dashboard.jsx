// import React from 'react'

import { Box } from "@mui/material";
import DoctorDashboard from "./DoctorDashboard";
import { ROLE_MAP } from "../constant";
import PatientDashboard from "./PatientDashboard";
import ShipperDashboard from "./ShipperDashboard";
import PharmacyDashboard from "./PharmacyDashboard";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context";

export default function Dashboard() {
  const navigate = useNavigate();

  const {  userInfo}=useContext(UserContext)
  const { account } = userInfo || {};
  useEffect(()=>{
    if(!userInfo){
      navigate('/')
    }
  },[navigate, userInfo])
  
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "fit-content" }}
      className="container"
    >
      {account === ROLE_MAP.doctor && <DoctorDashboard />}
      {account === ROLE_MAP.patient && <PatientDashboard />}
      {account === ROLE_MAP.shipper && <ShipperDashboard />}
      {account === ROLE_MAP.pharmacy && <PharmacyDashboard />}
    </Box>
  );
}
