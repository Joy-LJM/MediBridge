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
  TextField,
} from "@mui/material";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import "../styles/Dashboard.css";
import TabContent from "../components/TabContent";
import PharmacySearch from "../components/PharmacySearch";
import axios from "axios";
import { ADD_PATIENT, GET_PATIENT_LIST,  SUBMIT_PRESCRIPTION, SUCCESS_CODE } from "../constant";
import { toast, ToastContainer } from "react-toastify";

const formErr={
  firstnameErr: "",
  lastnameErr: "",
  phoneNumErr: "",
  addressErr: "",
  emailErr: "",
}
export default function DoctorDashboard() {
  const [formData, setFormData] = useState({
    files: [],
    selectedPharmacy: "",
    remark: "",
    patient: "",
    address:""
  });
  const [patientData, setPatientData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    address: "",
    phone: "",
    account:"3"
  });
  const [error, setError] = useState({
    filesErr: "",
    selectedPharmacyErr: "",
    patientErr: "",
  });
  const [patientFormError, setPatientFormError] = useState(formErr);
  const [pharmacies, setPharmacies] = useState([]);
  const { files } = formData || {};
  const onFileUpload = (files) => {
    setFormData({
      ...formData,
      files: Array.isArray(files) ? files : [files],
    });
  };
  const FileNameText = useCallback(() => {
    if (files.length > 0) {
      const fileNames = files.map((item) => {
        return item[0]?.name || "";
      });
      return (
        <div style={{ color: "#457447", marginTop: 5 }}>
          {fileNames.join(", ")}
        </div>
      );
    }
    return null;
  }, [files]);
  const handleSubmit = useCallback(async () => {
    const { files, selectedPharmacy, patient, remark } = formData || {};
    let newErrors = { filesErr: "", selectedPharmacyErr: "", patientErr: "" };

    if (files.length === 0) {
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
      data.append("file", files);
      data.append("patient_id", patient._id);
      data.append("remark", remark);
      data.append("pharmacy_id", selectedPharmacy);

      const { data: response } = await axios.post(
        SUBMIT_PRESCRIPTION,
        data
      );
      const { code, message } = response || {};
      if (code === SUCCESS_CODE) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    }
  }, [formData]);

  const handleAddPatient = useCallback(async () => {
    const { firstname, lastname, phone, address, email } = patientData || {};
    let newErrors = {
      firstnameErr: "",
      lastnameErr: "",
      phoneNumErr: "",
      addressErr: "",
      emailErr: "",
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
    if (!email) {
      newErrors.emailErr = "Please input email!";
    } else {
      newErrors.emailErr = "";
    }

    setPatientFormError(newErrors); // ✅ Set all errors in one state update

    const flag = Object.values(patientData).every((item) => item !== "");
    if (flag) {
      const { data: response } = await axios.post(
        ADD_PATIENT,
        patientData
      );
      setOpen(false);
      const { code, message } = response || {};
      if (code === SUCCESS_CODE) {
        toast.success(message);
        axios.get(GET_PATIENT_LIST).then((res) => {
          const { data } = res || {};
          setPatientList(data.patientList);
          const curPatient=data.patientList.find(item=>item.email===email)
          setFormData({
            ...formData,
            patient: curPatient,
            address
          });
        });
      } else {
        toast.error(message);
      }
    }
  }, [formData, patientData]);

  const handleSelectPharmacy = useCallback(
    (e) => {
      setFormData({
        ...formData,
        selectedPharmacy: e.target.value,
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
    setPatientFormError(formErr)
  };

  return (
    // <FormControl required>
    <>
      <ToastContainer />
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
                onChange={(event) => onFileUpload(event.target.files)}
                // multiple
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
                    console.log(option,'option')
                    setFormData({
                      ...formData,
                      patient: option,
                      address:option?.address||''
                    });
                  }}
                  renderOption={(props, option) => {
                    // eslint-disable-next-line react/prop-types
                    const { key, ...optionProps } = props;
                    return (
                      <Box
                        key={key}
                        component="li"
                        // sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                        {...optionProps}
                      >
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
                <FormHelperText className="textErr" marginBottom={5} error={!!patientFormError.firstnameErr}>
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
                <FormHelperText className="textErr"  margin="10px" error={!!patientFormError.lastnameErr}>
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
                <FormHelperText  className="textErr" error={!!patientFormError.emailErr}>
                  {patientFormError.emailErr}
                </FormHelperText>
                <TextField
                  id="phone"
                  label="Phone"
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
                <FormHelperText className="textErr" error={!!patientFormError.phoneNumErr}>
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
                <FormHelperText  className="textErr" error={!!patientFormError.addressErr}>
                  {patientFormError.addressErr}
                </FormHelperText>
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
