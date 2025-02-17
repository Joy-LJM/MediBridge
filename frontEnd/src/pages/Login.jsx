import * as React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import {
  Typography,
  Container,
  Box,
  TextField,
  FormControl,
  Button,
} from "@mui/material";
import "../styles/login.css";

export default function Login() {

  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const navigate = useNavigate();



  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/login", {
        email,
        password,
      })
      .then(() => {
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
      <Header />
      <Navigation />
      <Container
        className="signIn"
        sx={{
          textAlign: "center",
          py: 5,
          "@media (min-width: 1200px)": {
            maxWidth: "550px",
          },
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Sign In
        </Typography>
        <Box className="box">
          <form onSubmit={handleSubmit}>
            <FormControl sx={{ m: 1, width: 300 }}>
              <TextField
                id="email"
                label="Email"
                type="email"
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
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                id="password"
                label="Password"
                type="password"
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
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                variant="outlined"
                size="large"
                type="submit"
                sx={{
                  backgroundColor: "#fff",
                  color: "#38603A",
                  borderRadius: 50,
                  fontWeight: 700,
                  fontSize: 25,
                }}
              >
                Submit
              </Button>
            </FormControl>
          </form>
        </Box>
      </Container>
      <Footer />
    </div>
  );
}