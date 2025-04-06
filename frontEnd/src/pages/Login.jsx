import { useState, useEffect, useCallback, useContext } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import {
  Typography,
  Container,
  Box,
  TextField,
  FormControl,
  Button,
} from "@mui/material";
import "../styles/Login.css";
import { SUCCESS_CODE } from "../constant";
import { useAuth } from "../hooks/useAuth";
import { UserContext } from "../../context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { userInfo, loginUser } = useContext(UserContext);

  // prevent user to navigate to login page if they are already logged in
  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard");
    }
  }, [navigate, userInfo]);
  const loginMutation = useAuth();
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!email || !password) {
        toast.error("Please input your email or password before submitting!");
        return;
      }

      try {
        const { code, message, user } = await loginMutation.mutateAsync({
          email,
          password,
        });

        if (code === SUCCESS_CODE) {
          toast.success(message);
          loginUser(user);

          setTimeout(() => {
            navigate("/dashboard");
          }, 800);
        } else {
          toast.error(message);
        }
      } catch (err) {
        toast.error(err.message || "Login failed");
      }
    },
    [email, password, loginMutation, loginUser, navigate]
  );
  
  return (
    <>
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
                />
                  <div className="signup">
                  <Link to="/password_reset">Forgot password?</Link>
                  <p>Need an account?<Link to="/register">Sign up</Link></p>
                  </div>
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
      </div>
    </>
  );
}
