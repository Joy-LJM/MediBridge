import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Container,
  CardContent,
  Card,
} from "@mui/material";
import "../styles/Dashboard.css";
import "../styles/Pharmacy.css";
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

  //Function to handle button click
  const handleButton = ()=>{
    
  }

  return (
    <>
      <ToastContainer />
      <TabContent label="New Prescription" sx={{ color: "white" }}>
        <Box sx={{ display: "flex" }}>
          <Container maxWidth="md" sx={{ marginTop: "30px" }}>
            <Typography variant="h4" sx={{ my: 3, textAlign: "center" }}>
              All New Prescriptions
            </Typography>
            <Grid container spacing={4} justifyContent="center" sx={{ my: 3 }}>
              {prescriptions.map((pres) => (
                <Grid item xs={12} sm={12} key={pres._id}>
                  <Card
                    sx={{
                      backgroundColor: "#EAF4E1",
                      borderRadius: "15px",
                      boxShadow: "2px 4px 8px rgba(0,0,0,0.1)",
                      padding: "15px",
                      textAlign: "center",
                      maxWidth: "650px",
                      margin: "auto",
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "20px",
                          marginBottom: "20px",
                          textTransform: "uppercase",
                          fontFamily: "Georgia, serif",
                        }}
                      >
                        Order: {pres._id}
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: "bold",
                          fontSize: "15px",
                          fontFamily: "Georgia, serif",
                          marginBottom: "20px",
                          marginLeft: "-150px",
                        }}
                      >
                        Prescription : {/* Clickable PDF to open in modal */}
                        <Button
                          onClick={() => handlePdfClick(pres.prescription_file)}
                          variant="contained"
                          color="primary"
                        >
                          View Prescription
                        </Button>
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: "bold",
                          fontSize: "15px",
                          fontFamily: "Georgia, serif",
                          marginBottom: "20px",
                          marginLeft: "-200px",
                        }}
                      >
                        Doctor : {pres.doctor?.firstname}{" "}
                        {pres.doctor?.lastname}
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: "bold",
                          fontSize: "15px",
                          fontFamily: "Georgia, serif",
                          marginBottom: "30px",
                          marginLeft: "-325px",
                        }}
                      >
                        Status : {pres.status?.status}
                      </Typography>

                      <Box>
                        {pres.status.status === "New" ? (
                          <Grid>
                            <Button
                              onClick={() => handleButton(PaymentResponse._id)}
                              variant="contained"
                              sx={{
                                width: "200px",
                                height: "70px",
                                backgroundColor: "white",
                                color: "black",
                                borderRadius: "30px",
                                padding: "10px 40px",
                                textTransform: "none",
                                fontSize: "16px",
                                fontWeight: "bold",
                                boxShadow: "1px 2px 5px rgba(0,0,0,0.2)",
                                marginTop: "20px",
                                marginRight: "80px",
                                "&:hover": { backgroundColor: "#f0f0f0" },
                              }}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="contained"
                              sx={{
                                width: "200px",
                                height: "70px",
                                backgroundColor: "white",
                                color: "black",
                                borderRadius: "30px",
                                padding: "10px 40px",
                                textTransform: "none",
                                fontSize: "16px",
                                fontWeight: "bold",
                                boxShadow: "1px 2px 5px rgba(0,0,0,0.2)",
                                marginTop: "20px",
                              }}
                            >
                              Decline
                            </Button>
                          </Grid>
                        ) : (
                          <Button
                            variant="contained"
                            disabled
                            sx={{
                              backgroundColor: "#ccc",
                              color: "black",
                              borderRadius: "30px",
                              padding: "10px 40px",
                              textTransform: "none",
                              fontSize: "16px",
                              fontWeight: "bold",
                              boxShadow: "none",
                              marginTop: "20px",
                            }}
                          >
                            Decline
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
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
