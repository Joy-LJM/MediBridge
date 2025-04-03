import { useState, useEffect, useRef, useCallback, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  Typography,
  Container,
  Box,
  TextField,
  FormControl,
  Button,
} from "@mui/material";
import "../styles/login.css";
import {
  VERIFY_CODE,
  SUCCESS_CODE,
  VALIDATE_EMAIL,
  RESET_PSW,
} from "../constant";
import { UserContext } from "../../context";
import { API } from "../utils";

export default function PswReset() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [validEmail, setvalidEmail] = useState(false);
  const [validCode, setvalidCode] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPsw, setConfirmPsw] = useState("");
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);
  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard");
    }
  }, [navigate, userInfo]);
  const userId = useRef("");
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!email) {
        toast.error("Please input your email!");
        return;
      }
      if (!validEmail) {
        API
          .post(VALIDATE_EMAIL, {
            email,
          })
          .then((res) => {
            const { data } = res;
            const { code, userInfo } = data;
            if (code === SUCCESS_CODE) {
              setvalidEmail(true);
              userId.current = userInfo._id;
            }
          })
          .catch((err) => {
             const errorMessage = err.response?.data?.message || "Failed to delete account";
                    toast.error(errorMessage);
            setvalidEmail(false);
          });
      } else if (!validCode) {
        if (!code) {
          toast.error("Please input verification code!");
          return;
        }
        axios
          .post(VERIFY_CODE, {
            email,
            code,
          })
          .then((res) => {
            const { data } = res;
            const { code } = data;
            if (code === SUCCESS_CODE) {
              setvalidCode(true);
            }
          })
          .catch((err) => {
            toast.error(err.message);
            setvalidCode(false);
          });
      }

      if (validCode) {
        if (!password) {
          toast.error("Please input password!");
          return;
        }
        // check 2 psw match
        if (confirmPsw !== password) {
          toast.error("Two password don't match!");
          return;
        }
        API
          .post(RESET_PSW, {
            password,
            _id: userId.current,
          })
          .then((res) => {
            const { data } = res;
            const { code, message } = data;
            if (code === SUCCESS_CODE) {
              toast.success(message);

              setTimeout(() => {
                navigate("/login");
              }, 2500); // Wait for 2.5 seconds before navigating
            }
          })
          .catch((err) => {
            toast.error(err.message);
          });
      }
    },
    [code, confirmPsw, email, navigate, password, validCode, validEmail]
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
          <Typography variant="h5">Password Reset</Typography>
          <Box className="box">
            <form onSubmit={handleSubmit}>
              <FormControl sx={{ m: 1, width: 300 }}>
                {!validEmail ? (
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
                ) : !validCode ? (
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
                  />
                ) : (
                  <div>
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
                    <TextField
                      id="confirmPassword"
                      label="Confirm Password"
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
                      onChange={(e) => setConfirmPsw(e.target.value)}
                    />
                  </div>
                )}
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
                  {validCode ? "Reset" : "Next"}
                </Button>
              </FormControl>
            </form>
          </Box>
        </Container>
      </div>
    </>
  );
}
