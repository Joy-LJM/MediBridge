import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import "../styles/Dashboard.css";
import TabContent from "../components/TabContent";
import axios from "axios";
import { ToastContainer } from "react-toastify";
export default function PharmacyDashboard() {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/prescriptions")
      .then((response) => {
        console.log(response.data);
        setPrescriptions(response.data);
      })
      .catch((error) => console.error("Error fetching accounts:", error));
  }, []);

  return (
    <>
      <ToastContainer />
      <TabContent label="New Prescription">
        <Typography variant="h4">All New Prescriptions</Typography>
        {prescriptions.map((pres) => (
          <Box className="box" key={pres._id}>
            <Typography variant="h5" gutterBottom>
              Order #: {pres._id}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="h5">Prescription:</Typography>
              </Grid>
              <Grid item xs={4}>
                <img
                  src={`src/assets/prescriptions/${pres.prescription_file}`}
                  alt={pres.prescription_file}
                  loading="lazy"
                />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h4">Doctor:</Typography>
              </Grid>
              <Grid item xs={4}>
                {pres.doctor?.firstname} {pres.doctor?.lastname}
              </Grid>
            </Grid>
          </Box>
        ))}
      </TabContent>
    </>
  );
}
