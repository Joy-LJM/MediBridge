import * as React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import Footer from "../components/Footer";
import {
  Typography,
  Container,
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
} from "@mui/material";
import "../styles/register.css";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { HOST_URL } from "../constant";

export default function Register() {
  const [firstname, setFname] = React.useState();
  const [lastname, setLname] = React.useState();
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const [phone, setNumber] = React.useState();
  const [address, setAddress] = React.useState();
  const [cities, setCities] = React.useState([]);
  const [city, setCity] = React.useState("");
  const [provinces, setProvinces] = React.useState([]);
  const [selectedProvince, setSelectedProvince] = React.useState("");
  const [account, setAccount] = React.useState([]);
  const [selectedAccount, setSelectedAccount] = React.useState("");

  const navigate = useNavigate();

  // Fetch provinces on component mount
  React.useEffect(() => {
    axios
      .get(`${HOST_URL}/api/provinces`)
      .then((response) => {
        setProvinces(response.data);
      })
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);

  // Fetch cities when province changes
  React.useEffect(() => {
    if (selectedProvince) {
      axios
        .get(`${HOST_URL}/api/cities/${selectedProvince}`)
        .then((response) => {
          setCities(response.data);
        })
        .catch((error) => console.error("Error fetching cities:", error));
    }
  }, [selectedProvince]);

  // Fetch account
  React.useEffect(() => {
    axios
      .get("http://localhost:3000/api/accounts")
      .then((response) => {
        setAccount(response.data);
      })
      .catch((error) => console.error("Error fetching accounts:", error));
  }, []);
  React.useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      navigate("/dashboard");
    }
  }, [navigate]);
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${HOST_URL}/register`, {
        firstname,
        lastname,
        email,
        password,
        phone,
        address,
        city: city,
        province: selectedProvince,
        account: selectedAccount,
      })
      .then(() => {
        localStorage.setItem("isRegistered", "true");
        navigate("/verification", { state: { email } });
      })
      .catch((err) => console.log(err));
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
          Sign Up
        </Typography>
        <Box className="box">
          <form onSubmit={handleSubmit}>
            <FormControl sx={{ m: 1, width: 300 }}>
              <TextField
                id="fname"
                label="First Name"
                type="text"
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
                onChange={(e) => setFname(e.target.value)}
                required
              />
              <TextField
                id="lname"
                label="Last Name"
                type="text"
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
                onChange={(e) => setLname(e.target.value)}
                required
              />
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
              <TextField
                id="phone"
                label="Phone"
                type="tel"
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
                onChange={(e) => setNumber(e.target.value)}
                required
              />
              <TextField
                id="address"
                label="Address"
                type="text"
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
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <FormControl sx={{ marginBottom: "30px" }}>
                <InputLabel
                  id="province-label"
                  sx={{ "&.Mui-focused ": { color: "#fff" }, color: "#fff" }}
                >
                  Province
                </InputLabel>
                <Select
                  labelId="province-label"
                  id="province"
                  label="Province"
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  sx={{
                    color: "#fff",
                    "& .MuiSelect-select": { color: "#fff" },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#fff",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#689D6D",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#fff",
                    },
                    "& .MuiSvgIcon-root": { color: "#fff" }, // Changes dropdown arrow color
                  }}
                >
                  {provinces.map((province) => (
                    <MenuItem key={province._id} value={province._id}>
                      {province.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Fixed Select Dropdown */}
              <FormControl sx={{ marginBottom: "30px" }}>
                <InputLabel
                  id="age-label"
                  sx={{ "&.Mui-focused ": { color: "#fff" }, color: "#fff" }}
                >
                  City
                </InputLabel>
                <Select
                  labelId="age-label"
                  id="age"
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  sx={{
                    color: "#fff",
                    "& .MuiSelect-select": { color: "#fff" },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#fff",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#689D6D",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#fff",
                    },
                    "& .MuiSvgIcon-root": { color: "#fff" }, // Changes dropdown arrow color
                  }}
                >
                  {cities.map((city) => (
                    <MenuItem key={city._id} value={city._id}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ marginBottom: "30px" }}>
                <FormLabel
                  id="demo-row-radio-buttons-group-label"
                  sx={{
                    color: "#fff",
                    textAlign: "left",
                    "&.Mui-focused ": { color: "#fff" },
                  }}
                >
                  Account
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  sx={{ py: 2, textAlign: "center" }}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                >
                  {account.map((acc) => (
                    <FormControlLabel
                      key={acc._id}
                      value={acc._id}
                      control={
                        <Radio
                          sx={{
                            color: "#fff",
                            "&.Mui-checked": {
                              color: "#689D6D",
                            },
                          }}
                        />
                      }
                      label={acc.name}
                      sx={{ paddingRight: 3 }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
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
  );
}
