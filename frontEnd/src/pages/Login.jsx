import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import Footer from "../components/Footer";

import {
  Typography,
  Container,
  Box,
  TextField,
  FormControl,
  Button,
} from "@mui/material";
import "../styles/login.css";
import { HOST_URL, SUCCESS_CODE } from "../constant";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please input your email or password before submit!");
      return;
    }
    axios
      .post(`${HOST_URL}/login`, {
        email,
        password,
      })
      .then((res) => {
        const { data } = res;
        const { code, message, user } = data;
        if (code === SUCCESS_CODE) {
          navigate("/dashboard");
          toast.success(message);
          localStorage.setItem("userInfo", JSON.stringify(user));
        }else{
          toast.error(message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <>
      <ToastContainer />
      <div className="container">
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
                  // required
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
                  // required
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
        {/* <Footer /> */}
      </div>
    </>
  );
}
