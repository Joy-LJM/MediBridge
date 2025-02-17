import { useCallback, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid2,
  MenuItem,
  Select,
} from "@mui/material";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import "../styles/Dashboard.css";
import TabContent from "../components/TabContent";
import PharmacySearch from "../components/PharmacySearch";

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
        return item[0].name || "";
      });
      return (
        <div style={{ color: "#457447", marginTop: 5 }}>
          {fileNames.join(", ")}
        </div>
      );
    }
    return null;
  }, [files]);
  const handleSubmit = useCallback(() => {
    console.log(formData, "formdata");

    const { files, selectedPharmacy, patient } = formData || {};
    let newErrors = { filesErr: "", selectedPharmacyErr: "", patientErr: "" };

    if (files.length === 0) {
      newErrors.filesErr = "Please upload prescription before submitting!";
    }else{
      newErrors.filesErr =''
    }

    if (!selectedPharmacy) {
      newErrors.selectedPharmacyErr =
        "Please select a pharmacy before submitting!";
    }else{
      newErrors.selectedPharmacyErr =''
    }

    if (!patient) {
      newErrors.patientErr = "Please select a patient before submitting!";
    }else{
      newErrors.patientErr =''
    }

    setError(newErrors); // ✅ Set all errors in one state update

    if(!newErrors.patientErr && ! newErrors.selectedPharmacyErr && !newErrors.filesErr){
      console.log(formData,'submit form data')
    }
  }, [formData]);

  console.log(error, "eeee");

  const handleSelectPharmacy = useCallback(
    (e) => {
      setFormData({
        ...formData,
        selectedPharmacy: e.target.value,
      });
    },
    [formData]
  );

  return (
    // <FormControl required>
    <TabContent label="Upload Prescription" >
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
        <Grid2 size={6}>
          <Box sx={{ pl: 2, maxWidth: 500, mx: "auto", textAlign: "center" }}>
            <Select
              fullWidth
              displayEmpty
              sx={{ mt: 3, ml: 3 }}
              value={formData.patient}
              required
              onChange={(e) => {
                setFormData({
                  ...formData,
                  patient: e.target.value,
                });
              }}
              error={!!error.patientErr}
            >
              <MenuItem value={10}>Ten</MenuItem>
            </Select>
            <FormControl>
              <FormHelperText error={!!error.patientErr}>
                {error.patientErr}
              </FormHelperText>
            </FormControl>
          </Box>
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
    // </FormControl>
  );
}
