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
import { HOST_URL, SUCCESS_CODE } from "../constant";
import { toast, ToastContainer } from "react-toastify";

export default function DoctorDashboard() {
  const [formData, setFormData] = useState({
    files: [],
    selectedPharmacy: "",
    remark: "",
    patient: "",
  });
  const [error, setError] = useState({
    filesErr: "",
    selectedPharmacyErr: "",
    patientErr: "",
  });
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
        `${HOST_URL}/prescription/submit`,
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

  const handleSelectPharmacy = useCallback(
    (e) => {
      setFormData({
        ...formData,
        selectedPharmacy: e.target.value,
      });
    },
    [formData]
  );

  const [patientList, setPatientList] = useState([]);
  useEffect(() => {
    axios.get(`${HOST_URL}/prescription/patient`).then((res) => {
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
            <label>Search a pharmacy:</label>
          </Grid2>
          <Grid2 size={8}>
            <PharmacySearch
              pharmacies={pharmacies}
              setPharmacies={setPharmacies}
              selectedPharmacy={formData.selectedPharmacy}
              handleSelectPharmacy={handleSelectPharmacy}
            />
            <FormHelperText error={!!error.selectedPharmacyErr}>
              {error.selectedPharmacyErr}
            </FormHelperText>
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
        <DialogTitle id="alert-dialog-title">
        Add new patient
        </DialogTitle>
        <DialogContent>
        <Box className="box">
          <form onSubmit={handleSubmit}>
            <FormControl sx={{ m: 1, width: 300 }}>
              <TextField
                id="fname"
                label="First Name"
                type="text"
                sx={{
                  marginBottom: "20px",
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "#689D6D" },
                  },
                }}
                // onChange={(e) => setFname(e.target.value)}
                required
              />
              <TextField
                id="lname"
                label="Last Name"
                type="text"
                sx={{
                  marginBottom: "20px",
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "#689D6D" },
                  },
                }}
                // onChange={(e) => setLname(e.target.value)}
                required
              />
              <TextField
                id="email"
                label="Email"
                type="email"
                sx={{
                  marginBottom: "20px",
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "#689D6D" },
                  },
                }}
                // onChange={(e) => setEmail(e.target.value)}
                required
              />
             
              <TextField
                id="phone"
                label="Phone"
                type="tel"
                sx={{
                  marginBottom: "20px",
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "#689D6D" },
                
                  },
                }}
                // onChange={(e) => setNumber(e.target.value)}
                required
              />
              <TextField
                id="address"
                label="Address"
                type="text"
                sx={{
                  marginBottom: "20px",
                  "& .MuiOutlinedInput-root": {
                 
                    "&:hover fieldset": { borderColor: "#689D6D" },
                  
                  },
                }}
                // onChange={(e) => setAddress(e.target.value)}
                required
              />
              
            </FormControl>
          </form>
        </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error" variant="outlined">Cancel</Button>
          <Button onClick={handleClose} autoFocus variant="outlined">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
    // </FormControl>
  );
}
