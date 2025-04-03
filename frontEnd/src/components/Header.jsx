import React, { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import logo from "../assets/logo.png";
import "../styles/header.css";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid2,
  Menu,
  MenuItem,
  Select,
  Stack,
  Tab,
  TextField,
  Typography,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";
import {
  EMAIL_REGEX,
  FETCH_CITIES,
  FETCH_PROVINCES,
  PHONE_REGEX,
  RESET_PSW,
  SUCCESS_CODE,
  USER_ACTION,
} from "../constant";
import { toast } from "react-toastify";

export default function Header({ isLogin, handleLogout, userInfo }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabVal, setTabVal] = useState("1");
  const [editKey, setEditKey] = useState(null);
  const [tempValue, setTempValue] = useState(""); // Temporary state for editing
  const [password, setPassword] = useState("");
  const [confirmPsw, setConfirmPsw] = useState("");

  const handleChange = (event, newValue) => {
    setTabVal(newValue);
    setEditKey(null);
    setTempValue("");
  };
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const clickLogout = () => {
    handleLogout();
    setAnchorEl(null);
  };
  const clickSetting = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditKey(null);
  };
  const [formData, setFormData] = useState(userInfo);

  const clickEdit = (key, value) => {
    setEditKey(key);
    setTempValue(value);
  };
  const [dataError, setDataErr] = useState("");
  const { id } = formData || {};
  const handleSave = useCallback(() => {
    if (!tempValue) {
      setDataErr("Input can not be empty!");
      return;
    }
    if (editKey === "phone" && !PHONE_REGEX.test(tempValue)) {
      setDataErr("Incorrect phone number format!");
      return;
    }
    if (editKey === "email" && !EMAIL_REGEX.test(tempValue)) {
      setDataErr("Incorrect email format!");
      return;
    }
    const isPassword = editKey === "password";
    if (isPassword && (!password || !confirmPsw)) {
      setDataErr("Input can not be empty!");
      return;
    }
    if (isPassword && password !== confirmPsw) {
      setDataErr("Two password don't match!");
      return;
    }
    // call Api
    const api = isPassword ? RESET_PSW : `${USER_ACTION}/${id}/update`;
    const params = isPassword
      ? {
          password,
          _id: id,
        }
      : { [editKey]: tempValue };
    axios
      .post(api, params)
      .then((res) => {
        const { data } = res;
        const { code, message } = data;
        if (code === SUCCESS_CODE) {
          toast.success(message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
    if (isPassword) {
      setIsClickChangePsw(false);
    }
    setEditKey(null);
    setDataErr("");
    setFormData({ ...formData, [editKey]: tempValue });
  }, [confirmPsw, editKey, formData, id, password, tempValue]);

  const handleCancel = () => {
    setEditKey(null);
    setDataErr("");
  };

  const [pronviceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  useEffect(() => {
    if (openDialog) {
      axios
        .get(FETCH_PROVINCES)
        .then((response) => {
          setProvinceList(response.data);
        })
        .catch((error) => console.error("Error fetching provinces:", error));
    }
  }, [openDialog]);
  const { province } = formData || {};
  useEffect(() => {
    if (province) {
      if (pronviceList.length) {
        axios
          .get(`${FETCH_CITIES}/${province}`)
          .then((response) => {
            setCityList(response.data);
          })
          .catch((error) => console.error("Error fetching cities:", error));
      }
    }
  }, [pronviceList, province]);
  const [isClickChangePsw, setIsClickChangePsw] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const handleConfirmDelete = useCallback(() => {
    setDeleteDialog(false);
    setOpenDialog(false);
    axios
      .get(`${USER_ACTION}/${id}/delete`, { id })
      .then((res) => {
        const { data } = res;
        const { code, message } = data;
        if (code === SUCCESS_CODE) {
          toast.success(message);
          setTimeout(() => {
            handleLogout();
          }, 800);
        }
      })
      .catch((err) => {
        console.log(err, "delete account error");
      });
  }, [handleLogout, id]);

  return (
    <>
      <header>
        <div className="left">
          <img src={logo} alt="Logo" />
          <div className="brandName">
            <h2>MediBridge </h2>
            <p> Connecting convenient care for everyone</p>
          </div>
        </div>
        {isLogin ? (
          <Stack spacing={2} direction="row" marginRight={6}>
            <Button onClick={handleClick} variant="contained">
              <ManageAccountsOutlinedIcon />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={clickSetting}>Settings</MenuItem>
              <MenuItem onClick={clickLogout}>Logout</MenuItem>
            </Menu>
          </Stack>
        ) : (
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
        )}
      </header>
      <Dialog onClose={handleCloseDialog} open={openDialog}>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={tabVal}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange}>
                <Tab label="Basic Info" value="1" />
                <Tab label="Account" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Typography variant="h6" marginBottom={2}>
                Basic Information
              </Typography>
              {dataError && (
                <Box color={"red"} textAlign={"center"} marginBottom={2}>
                  {dataError}
                </Box>
              )}
              <Grid2 container spacing={2}>
                {[
                  {
                    value: formData?.firstname ??"",
                    type: "input",
                    key: "firstname",
                    label: "First Name",
                  },
                  {
                    value: formData?.lastname??"",
                    type: "input",
                    key: "lastname",
                    label: "Last Name",
                  },
                  {
                    value: formData?.address??"",
                    type: "input",
                    key: "address",
                    label: "Address",
                  },
                  {
                    value: formData?.phone??"",
                    type: "input",
                    key: "phone",
                    label: "Phone Number",
                  },
                  {
                    value: formData?.province??"",
                    type: "select",
                    key: "province",
                    label: "Province",
                    options: pronviceList,
                  },
                  {
                    value: formData?.city??"",
                    type: "select",
                    key: "city",
                    label: "City",
                    options: cityList,
                  },
                ].map((item) => {
                  const { value, key, label, type, options } = item;
                  return (
                    <React.Fragment key={key}>
                      <Grid2 size={4}>{label}:</Grid2>
                      <Grid2 size={6} id={key}>
                        {editKey === key ? (
                          type === "input" ? (
                            <>
                              <TextField
                                type="text"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                              />
                              <Box marginTop={2}>
                                <Button
                                  onClick={handleSave}
                                  variant="contained"
                                >
                                  Save
                                </Button>
                                <Button onClick={handleCancel} variant="text">
                                  Cancel
                                </Button>
                              </Box>
                            </>
                          ) : type === "select" ? (
                            <div>
                              <Select
                                labelId={`${key}-label`}
                                id={key}
                                label={label}
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                sx={{
                                  marginBottom: "10px",
                                  "& .MuiOutlinedInput-root": {
                                    "&:hover fieldset": {
                                      borderColor: "#689D6D",
                                    },
                                  },
                                }}
                              >
                                {options &&
                                  options.map((option) => (
                                    <MenuItem
                                      key={option._id}
                                      value={option._id}
                                    >
                                      {option.name}
                                    </MenuItem>
                                  ))}
                              </Select>
                              <Box marginTop={2}>
                                <Button
                                  onClick={handleSave}
                                  variant="contained"
                                >
                                  Save
                                </Button>
                                <Button onClick={handleCancel} variant="text">
                                  Cancel
                                </Button>
                              </Box>
                            </div>
                          ) : null
                        ) : type === "select" ? (
                          options?.find((item) => item._id === value)?.name ||
                          ""
                        ) : (
                          value
                        )}
                      </Grid2>
                      <Grid2 size={2}>
                        {editKey !== key && (
                          <Button onClick={() => clickEdit(key, value)}>
                            Edit
                          </Button>
                        )}
                      </Grid2>
                    </React.Fragment>
                  );
                })}
              </Grid2>
            </TabPanel>
            <TabPanel value="2">
              <Typography variant="h6" marginBottom={2}>
                Account Information
              </Typography>
              {dataError && (
                <Box color={"red"} textAlign={"center"} marginBottom={2}>
                  {dataError}
                </Box>
              )}
              <Grid2 container spacing={2} marginBottom={3}>
                {[
                  {
                    value: formData?.email??"",
                    type: "input",
                    key: "email",
                    label: "Email",
                  },
                  {
                    // value: formData.firstname,
                    type: "password",
                    key: "password",
                    label: "Password",
                  },
                ].map((item) => {
                  return item.type === "input" ? (
                    <React.Fragment key={item.key}>
                      <Grid2 size={4}>{item.label}:</Grid2>
                      <Grid2 size={6}>
                        {editKey === item.key ? (
                          <>
                            <TextField
                              type="text"
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                            />
                            <Box marginTop={2}>
                              <Button onClick={handleSave} variant="contained">
                                Save
                              </Button>
                              <Button onClick={handleCancel} variant="text">
                                Cancel
                              </Button>
                            </Box>
                          </>
                        ) : (
                          item.value
                        )}
                      </Grid2>
                      {editKey !== item.key && (
                        <Grid2 size={2}>
                          <Button
                            onClick={() => clickEdit(item.key, item.value)}
                          >
                            Edit
                          </Button>
                        </Grid2>
                      )}
                    </React.Fragment>
                  ) : (
                    <React.Fragment></React.Fragment>
                  );
                })}
                <Grid2 size={4}>Password:</Grid2>
                <Grid2 size={6}>
                  {!isClickChangePsw && (
                    <Button
                      onClick={() => {
                        setIsClickChangePsw(true);
                        setEditKey("password");
                      }}
                    >
                      Change password
                    </Button>
                  )}
                  {isClickChangePsw && (
                    <Box>
                      <TextField
                        type="password"
                        label="Password"
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setTempValue(e.target.value);
                        }}
                      />
                      <TextField
                        label="Confirm Password"
                        type="password"
                        margin="normal"
                        onChange={(e) => setConfirmPsw(e.target.value)}
                      />
                      <Box marginLeft={5}>
                        <Button variant="contained" onClick={handleSave}>
                          Confirm
                        </Button>
                        <Button
                          variant="text"
                          style={{ marginLeft: 10 }}
                          onClick={() => {
                            setIsClickChangePsw(false);
                            setEditKey(null);
                            setDataErr("");
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Grid2>
              </Grid2>
              <Button
                color="error"
                variant="contained"
                onClick={() => setDeleteDialog(true)}
              >
                Delete Account
              </Button>
            </TabPanel>
          </TabContext>
        </Box>
      </Dialog>
      <Dialog open={deleteDialog}>
        <DialogContent> Are you sure to delete your account?</DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDelete} autoFocus variant="contained">
            Confirm
          </Button>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

Header.propTypes = {
  isLogin: PropTypes.string,
  handleLogout: PropTypes.func,
  userInfo: PropTypes.object,
};
