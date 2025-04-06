import * as React from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Typography,
  Container,
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import "../styles/Register.css";
import { HOST_URL } from "../constant";

export default function Verification() {
  const location = useLocation();
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isVerified, setIsVerified] = React.useState(false);

  const navigate = useNavigate();
  React.useEffect(() => {
    // Check if the user has completed the registration
    const isRegistered = localStorage.getItem("isRegistered");
    if (!isRegistered) {
      // If not, redirect them back to the registration page
      navigate("/register");
    }
  }, [navigate]);
  const { email } = location.state || {};

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    axios
      .post(`${HOST_URL}/verify`, {
        email,
        verificationCode: code,
      })
      .then((response) => {
        if (response.data.success) {
          setIsVerified(true); // Set to true if verification is successful
          setTimeout(() => {
            navigate("/login"); // Navigate to login after a short delay
          }, 2000);
        } else {
          // If the verification fails, show an error message
          setError("Invalid verification code");
          setOpenSnackbar(true);
        }
      })
      .catch((err) => {
        console.error("Error verifying code:", err);
        setError("There was an error verifying your code");
        setOpenSnackbar(true);
      });
    setLoading(false);
  };

  return (
    <div className="container">
      <Container
        className="signUp"
        sx={{
          textAlign: "center",
          py: 5,
          "@media (min-width: 1200px)": {
            maxWidth: "550px",
          },
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Verify Your Email
        </Typography>
        <Box sx={{ mt: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Verification Code"
              InputLabelProps={{ style: { color: "#fff" } }}
              sx={{
                marginBottom: "30px",
                "& .MuiInputBase-input": { color: "#fff" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#fff" },
                  "&:hover fieldset": { borderColor: "#689D6D" },
                  "&.Mui-focused fieldset": { borderColor: "#fff" },
                },
              }}
              variant="outlined"
              fullWidth
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 3 }}
            >
              Verify Code
            </Button>
          </form>
          {isVerified && (
            <div style={{ color: "white", marginTop: "20px" }}>
              Registration successful! Redirecting to login...
            </div>
          )}
        </Box>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
}
