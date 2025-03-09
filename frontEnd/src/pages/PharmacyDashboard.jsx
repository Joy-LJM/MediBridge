import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import "../styles/Dashboard.css";
import TabContent from "../components/TabContent";
import axios from "axios";
import { ToastContainer } from "react-toastify";
export default function PharmacyDashboard() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");

    if (storedUser) {
      // Parse the JSON data to access user properties
      const parsedUser = JSON.parse(storedUser);
      console.log(parsedUser.id); // Logs the user's ID

      const pharmacyId = parsedUser.id;

      axios
        .get(`http://localhost:3000/api/pharmacy/prescriptions/${pharmacyId}`)
        .then((response) => {
          // console.log("API Response:", response); // Log the full response
          if (response.data && response.data.length > 0) {
            setPrescriptions(response.data);
          } else {
            console.log("No prescriptions found.");
          }
        })
        .catch((error) => console.error("Error fetching accounts:", error));
    } else {
      console.error("No user info found in localStorage");
    }
  }, []);

  const handlePdfClick = (pdfFile) => {
    setSelectedPdf(pdfFile); // Set the clicked PDF file
    setOpenModal(true); // Open the modal
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setOpenModal(false); // Close the modal
  };

  return (
    <>
      <ToastContainer />
      <TabContent label="New Prescription">
        <Typography variant="h4">All New Prescriptions</Typography>
        {prescriptions.map((pres) => (
          <Box className="box" key={pres._id}>
            <Typography variant="h6" gutterBottom>
              Order #: {pres._id}
            </Typography>
            <Grid container spacing={2} sx={{ my: 4, mx: 3 }}>
              <Grid item xs={4}>
                <Typography variant="h5">Prescription:</Typography>
              </Grid>
              <Grid item xs={4}>
                {/* Clickable PDF to open in modal */}
                <Button
                  onClick={() => handlePdfClick(pres.prescription_file)}
                  variant="contained"
                  color="primary"
                >
                  View Prescription
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="h5">Doctor:</Typography>
              </Grid>
              <Grid item xs={4} sx={{ ml: 6 }}>
                {pres.doctor?.firstname} {pres.doctor?.lastname}
              </Grid>
            </Grid>
            <Grid container spacing={2}>
            <Button
                  onClick={() => handlePdfClick(pres.prescription_file)}
                  variant="contained"
                  color="primary"
                >
                  View Prescription
                </Button>
            </Grid>
          </Box>
        ))}
      </TabContent>
      {/* Modal to view the PDF */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <embed
            src={`src/assets/prescriptions/${selectedPdf}`}
            width="100%"
            height="600px"
            type="application/pdf"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
          <Button
            variant="contained"
            color="secondary"
            href={`src/assets/prescriptions/${selectedPdf}`}
            download
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
