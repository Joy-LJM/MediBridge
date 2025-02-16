import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/header.css";
import { Button, Stack } from "@mui/material";
// import PropTypes from 'prop-types';

export default function Header({ children }) {
  return (
    <header>
      <div className="left">
        <img src={logo} alt="Logo" />
        <div className="brandName">
          <h2>MediBridge </h2>
          <p> Connecting convenient care for everyone</p>
        </div>
        <Stack spacing={2} direction="row">
          <Button
            className="btn"
            variant="outlined"
            color="inherit"
            sx={{ mx: 1 }}
            component={Link}
            to="/register"
          >
            Sign Up
          </Button>
          <Button
            className="btn"
            variant="contained"
            sx={{ bgcolor: "#fff", color: "#456b3c" }}
            component={Link}
            to="/login"
          >
            Sign In
          </Button>
        </Stack>
      </div>
      {children}
    </header>
  );
}

Header.propTypes = {
  children: React.Children,
};
