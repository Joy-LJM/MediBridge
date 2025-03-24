import { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import "../styles/Dashboard.css";
import TabContent from "../components/TabContent";
import PharmacySearch from "../components/PharmacySearch";
import axios from "axios";
import {
  ADD_PATIENT,
  EMAIL_REGEX,
  FETCH_CITIES,
  FETCH_PROVINCES,
  GET_PATIENT_LIST,
  ORDER_STATUS_MAP,
  PHONE_REGEX,
  SUBMIT_PRESCRIPTION,
  SUCCESS_CODE,
} from "../constant";
import { toast } from "react-toastify";

const formErr = {
  firstnameErr: "",
  lastnameErr: "",
  phoneNumErr: "",
  addressErr: "",
  emailErr: "",
};
const patientInitials = {
  firstname: "",
  lastname: "",
  email: "",
  address: "",
  phone: "",
  account: "67b270a10a93bde65f142af3",
  city: "",
  province: "",
};
const formInitials = {
  files: null,
  selectedPharmacy: "",
  remark: "",
  patient: "",
  address: "",
};
export default function DoctorDashboard() {
  const [formData, setFormData] = useState(formInitials);
  const [patientData, setPatientData] = useState(patientInitials);
  const [error, setError] = useState({
    filesErr: "",
    selectedPharmacyErr: "",
    patientErr: "",
  });
  const [patientFormError, setPatientFormError] = useState(formErr);
  const [pharmacies, setPharmacies] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [pronviceList, setProvinceList] = useState([]);

  const { files } = formData || {};
  const onFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    console.log(uploadedFile, "uploadedFile");

    if (!uploadedFile) return;

    setFormData((prev) => ({
      ...prev,
      files: uploadedFile, // Store the single file
    }));
  };
  const FileNameText = useCallback(() => {
    if (files) {
      return (
        <div style={{ color: "#457447", marginTop: 5 }}>
          {files.name} {/* Display the single file name */}
        </div>
      );
    }
    return null;
  }, [files]);

  const handleSubmit = useCallback(async () => {
    const { files, selectedPharmacy, patient, remark } = formData || {};
    let newErrors = { filesErr: "", selectedPharmacyErr: "", patientErr: "" };

    if (!files) {
      newErrors.filesErr = "Please upload prescription before submitting!";
    } else {
      newErrors.filesErr = "";
    }

    if (!selectedPharmacy) {
      newErrors.selectedPharmacyErr =
        "Please select a pharmacy before submitting!";
    } else {
      newErrors.selectedPharmacyErr = "";
    }

    if (!patient) {
      newErrors.patientErr = "Please select a patient before submitting!";
    } else {
      newErrors.patientErr = "";
    }

    setError(newErrors); // ✅ Set all errors in one state update

    if (
      !newErrors.patientErr &&
      !newErrors.selectedPharmacyErr &&
      !newErrors.filesErr
    ) {
      const data = new FormData();
      const { id: doctor_id } = JSON.parse(localStorage.getItem("userInfo"));
      data.append("prescription_file", files);
      data.append("patient_id", patient._id);
      data.append("doctor_id", doctor_id);
      data.append("remark", remark);
      data.append("pharmacy_id", selectedPharmacy);
      data.append("uploaded_date", new Date());
      data.append("delivery_status", ORDER_STATUS_MAP.NEW);

      const { data: response } = await axios.post(SUBMIT_PRESCRIPTION, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { code, message } = response || {};
      if (code === SUCCESS_CODE) {
        toast.success(message);
        setFormData(formInitials);
        setPharmacies([]);
      } else {
        toast.error(message);
      }
    }
  }, [formData]);

  const handleAddPatient = useCallback(async () => {
    const { firstname, lastname, phone, address, email, province, city } =
      patientData || {};
    let newErrors = {
      firstnameErr: "",
      lastnameErr: "",
      phoneNumErr: "",
      addressErr: "",
      emailErr: "",
      provinceErr: "",
      cityErr: "",
    };

    if (!lastname) {
      newErrors.lastnameErr = "Please input last name!";
    } else {
      newErrors.lastnameErr = "";
    }
    if (!firstname) {
      newErrors.firstnameErr = "Please input first name!";
    } else {
      newErrors.firstnameErr = "";
    }

    if (!phone) {
      newErrors.phoneNumErr = "Please input phone number!";
    } else {
      newErrors.phoneNumErr = "";
    }
    if (!address) {
      newErrors.addressErr = "Please input address!";
    } else {
      newErrors.addressErr = "";
    }
    if (!province) {
      newErrors.provinceErr = "Please select province!";
    } else {
      newErrors.provinceErr = "";
    }
    if (!city) {
      newErrors.cityErr = "Please select city!";
    } else {
      newErrors.cityErr = "";
    }
    if (!email) {
      newErrors.emailErr = "Please input email!";
    } else {
      newErrors.emailErr = "";
    }
    if (!PHONE_REGEX.test(phone)) {
      newErrors.phoneNumErr = "Incorrect phone number format!";
    } else {
      newErrors.phoneNumErr = "";
    }
    if (!EMAIL_REGEX.test(email)) {
      newErrors.emailErr = "Incorrect email format!";
    } else {
      newErrors.emailErr = "";
    }

    setPatientFormError(newErrors); // ✅ Set all errors in one state update

    const withoutError = Object.values(newErrors).every((item) => item === "");
    if (withoutError) {
      const { data: response } = await axios.post(ADD_PATIENT, patientData);
      setOpen(false);
      setPatientData(patientInitials);
      const { code, message } = response || {};
      if (code === SUCCESS_CODE) {
        toast.success("Add patient successfully");

        axios.get(GET_PATIENT_LIST).then((res) => {
          const { data } = res || {};
          setPatientList(data.patientList);
          const curPatient = data.patientList.find(
            (item) => item.email === email
          );

          const { name: cityName } = cityList.find((item) => item._id === city);
          const { name: provinceName } = pronviceList.find(
            (item) => item._id === province
          );
          if(error.patientErr){
            setError({
              ...error,
              patientErr:""
            })
          }
          setFormData({
            ...formData,
            patient: curPatient,
            address: `${address}, ${cityName}, ${provinceName}`,
          });
        });
      } else {
        toast.error(message);
      }
    }
  }, [cityList, error, formData, patientData, pronviceList]);

  const handleSelectPharmacy = useCallback(
    (e) => {
      setFormData({
        ...formData,
        selectedPharmacy: e?.target?.value??"",
      });
    },
    [formData]
  );
  const handleChangeAddress = useCallback(
    (e) => {
      setFormData({
        ...formData,
        address: e.target.value,
      });
    },
    [formData]
  );

  const [patientList, setPatientList] = useState([]);
  useEffect(() => {
    
    axios.get(GET_PATIENT_LIST).then((res) => {
      const { data } = res || {};
      setPatientList(data.patientList);
    });
  }, []);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPatientFormError(formErr);
    setPatientData(patientInitials);
  };

  useEffect(() => {
    if (open) {
      axios
        .get(FETCH_PROVINCES)
        .then((response) => {
          setProvinceList(response.data);
        })
        .catch((error) => console.error("Error fetching provinces:", error));
    }
  }, [open]);
  const { province } = patientData;
  useEffect(() => {
    if (province) {
      axios
        .get(`${FETCH_CITIES}/${province}`)
        .then((response) => {
          setCityList(response.data);
        })
        .catch((error) => console.error("Error fetching cities:", error));
    }
  }, [province]);

  return (
    // <FormControl required>
    <>
      <TabContent label="Upload Prescription">
        <Grid2 container spacing={2} marginBottom={2}>
          <Grid2 size={4}>
            <label>Upload Prescription:</label>
          </Grid2>
          <Grid2 size={8}>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={
                <span className="material-symbols-outlined">upload_file</span>
              }
            >
              Upload
              <input
                type="file"
                required
                className="upload"
                accept=".pdf"
                onChange={onFileUpload}
              />
            </Button>
            <FormHelperText error={!!error.filesErr}>
              {error.filesErr}
            </FormHelperText>
            <FileNameText />
          </Grid2>
          <Grid2 size={4}>
            <label>Patient List:</label>
          </Grid2>
          <Grid2 size={7} style={{ display: "flex", alignItems: "center" }}>
            <Grid2 size={9}>
              <Box
                sx={{ p: 4, maxWidth: 400, mx: "auto", textAlign: "center" }}
              >
                <Autocomplete
                  // sx={{ width: 300 }}
                  options={patientList}
                  autoHighlight
                  getOptionLabel={(option) => {
                    if (option) {
                      return `${option.firstname} ${option.lastname}`;
                    } else {
                      return "";
                    }
                  }}
                  onChange={(e, option) => {
                    setFormData({
                      ...formData,
                      patient: option,
                      address: option?.address || "",
                    });
                  }}
                  renderOption={(props, option) => {
                    // eslint-disable-next-line react/prop-types
                    const { id, ...optionProps } = props;

                    return (
                      <Box component="li" {...optionProps} key={id}>
                        {`${option.firstname} ${option.lastname}`}
                      </Box>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Patient" />
                  )}
                  value={formData.patient}
                />
                <FormControl>
                  <FormHelperText error={!!error.patientErr}>
                    {error.patientErr}
                  </FormHelperText>
                </FormControl>
              </Box>
            </Grid2>
            <Grid2 size={2}>
              <Button
                color="success"
                variant="outlined"
                onClick={handleClickOpen}
              >
                Add
              </Button>
            </Grid2>
          </Grid2>
          <Grid2 size={4}>
            <label>Search a pharmacy:</label>
          </Grid2>
          <Grid2 size={8}>
            <PharmacySearch
              pharmacies={pharmacies}
              setPharmacies={setPharmacies}
              selectedPharmacy={formData.selectedPharmacy}
              handleSelectPharmacy={handleSelectPharmacy}
              address={formData.address}
              handleChangeAddress={handleChangeAddress}
            />
            <FormHelperText error={!!error.selectedPharmacyErr}>
              {error.selectedPharmacyErr}
            </FormHelperText>
          </Grid2>
          <Grid2 size={4}>
            <label>Remark:</label>
          </Grid2>
          <Grid2 size={8}>
            <TextareaAutosize
              minRows={4}
              value={formData.remark}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  remark: e.target.value,
                });
              }}
            />
          </Grid2>
        </Grid2>
        <Button color="success" variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </TabContent>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">Add new patient</DialogTitle>
        <DialogContent>
          <Box className="box">
            <form onSubmit={handleSubmit}>
              <FormControl sx={{ m: 1, width: 300 }}>
                <TextField
                  id="fname"
                  label="First Name"
                  type="text"
                  sx={{
                    marginBottom: "10px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#689D6D" },
                    },
                  }}
                  value={patientData.firstname}
                  onChange={(e) => {
                    setPatientData({
                      ...patientData,
                      firstname: e.target.value,
                    });
                  }}
                />
                <FormHelperText
                  className="textErr"
                  error={!!patientFormError.firstnameErr}
                >
                  {patientFormError.firstnameErr}
                </FormHelperText>
                <TextField
                  id="lname"
                  label="Last Name"
                  value={patientData.lastname}
                  type="text"
                  sx={{
                    marginBottom: "10px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#689D6D" },
                    },
                  }}
                  onChange={(e) => {
                    setPatientData({
                      ...patientData,
                      lastname: e.target.value,
                    });
                  }}
                />
                <FormHelperText
                  className="textErr"
                  margin="10px"
                  error={!!patientFormError.lastnameErr}
                >
                  {patientFormError.lastnameErr}
                </FormHelperText>
                <TextField
                  id="email"
                  label="Email"
                  value={patientData.email}
                  type="email"
                  sx={{
                    marginBottom: "10px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#689D6D" },
                    },
                  }}
                  onChange={(e) => {
                    setPatientData({
                      ...patientData,
                      email: e.target.value,
                    });
                  }}
                />
                <FormHelperText
                  className="textErr"
                  error={!!patientFormError.emailErr}
                >
                  {patientFormError.emailErr}
                </FormHelperText>
                <TextField
                  id="phone"
                  label="Phone(format:1234567890)"
                  type="tel"
                  value={patientData.phone}
                  sx={{
                    marginBottom: "10px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#689D6D" },
                    },
                  }}
                  onChange={(e) => {
                    setPatientData({
                      ...patientData,
                      phone: e.target.value,
                    });
                  }}
                />
                <FormHelperText
                  className="textErr"
                  error={!!patientFormError.phoneNumErr}
                >
                  {patientFormError.phoneNumErr}
                </FormHelperText>
                <TextField
                  id="address"
                  label="Address"
                  type="text"
                  value={patientData.address}
                  sx={{
                    marginBottom: "10px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#689D6D" },
                    },
                  }}
                  onChange={(e) => {
                    setPatientData({
                      ...patientData,
                      address: e.target.value,
                    });
                  }}
                />
                <FormHelperText
                  className="textErr"
                  error={!!patientFormError.addressErr}
                >
                  {patientFormError.addressErr}
                </FormHelperText>
                <FormControl>
                  <InputLabel
                    id="province-label"
                    // sx={{ "&.Mui-focused ": { color: "#fff" }, }}
                  >
                    Province
                  </InputLabel>
                  <Select
                    labelId="province-label"
                    id="province"
                    label="Province"
                    value={patientData.province}
                    onChange={(e) =>
                      setPatientData({
                        ...patientData,
                        province: e.target.value,
                      })
                    }
                    sx={{
                      marginBottom: "10px",
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#689D6D" },
                      },
                    }}
                  >
                    {pronviceList.map((province) => (
                      <MenuItem key={province._id} value={province._id}>
                        {province.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText
                    className="textErr"
                    error={!!patientFormError.provinceErr}
                  >
                    {patientFormError.provinceErr}
                  </FormHelperText>
                </FormControl>

                {/* Fixed Select Dropdown */}
                <FormControl sx={{ marginBottom: "30px" }}>
                  <InputLabel
                    id="age-label"
                    // sx={{ "&.Mui-focused ": { color: "#fff" }, color: "#fff" }}
                  >
                    City
                  </InputLabel>
                  <Select
                    labelId="age-label"
                    id="age"
                    label="City"
                    value={patientData.city}
                    onChange={(e) => {
                      console.log(e, "eeeee");

                      setPatientData({
                        ...patientData,
                        city: e.target.value,
                      });
                    }}
                    sx={{
                      marginBottom: "10px",
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#689D6D" },
                      },
                    }}
                  >
                    {cityList.map((city) => (
                      <MenuItem key={city._id} value={city._id}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText
                    className="textErr"
                    error={!!patientFormError.cityErr}
                  >
                    {patientFormError.cityErr}
                  </FormHelperText>
                </FormControl>
              </FormControl>
            </form>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleAddPatient} autoFocus variant="outlined">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
    // </FormControl>
  );
}
