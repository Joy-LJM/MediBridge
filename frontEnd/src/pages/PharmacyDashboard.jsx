import { useCallback, useContext, useEffect, useState } from "react";
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
import { HOST_URL } from "../constant";
import { API, createURLDownloadFile } from "../utils";
import { UserContext } from "../../context";

export default function PharmacyDashboard() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState("");
  const { userInfo } = useContext(UserContext);
  useEffect(() => {
    if (userInfo) {
      const pharmacyId = userInfo.id;

      API
        .get(`${HOST_URL}/api/pharmacy/prescriptions/${pharmacyId}`)
        .then((response) => {
          //console.log("API Response:", response); // Log the full response
          if (response.data && response.data.length > 0) {
            setPrescriptions(response.data);
            //console.log(response.data);
          } else {
            console.log("No prescriptions found.");
          }
        })
        .catch((error) => console.error("Error fetching accounts:", error));
    } else {
      console.error("No user info found in localStorage");
    }
  }, [userInfo]);

  const handlePdfClick = (id) => {
    setSelectedPdf(id); // Set the clicked PDF file
    setOpenModal(true); // Open the modal
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setOpenModal(false); // Close the modal
  };

  //Function to handle button click
  const handleButton = async (presId, action) => {
    try {
      const status =
        action === "accept"
          ? "Preparing"
          : action === "declined"
          ? "Declined"
          : action === "ready"
          ? "Pending"
          : action === "delivered_shipper"
          ? "Delivering"
          : "Completed";

      // Await the API request to ensure it's completed
      await API.put(
        `${HOST_URL}/api/pharmacy/prescription/update/${presId}`,
        { deliveryStatus: status }
      );

      // Update local state based on the correct status name
      setPrescriptions((prev) =>
        prev.map((pres) =>
          pres._id === presId ? { ...pres, status: { status } } : pres
        )
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const downloadPres = useCallback(async () => {
    const res = await API.get(
      `${HOST_URL}/prescription/${selectedPdf}/download`,
      {
        responseType: "blob",
      }
    );
    createURLDownloadFile(res.data, selectedPdf);
  }, [selectedPdf]);

  return (
    <>
      <TabContent label="Orders" sx={{ color: "white" }}>
        <Box sx={{ display: "flex" }}>
          <Container maxWidth="md" sx={{ marginTop: "30px" }}>
            <Typography variant="h4" sx={{ my: 3, textAlign: "center" }}>
              All New Prescriptions
            </Typography>
            <Grid container spacing={4} justifyContent="center" sx={{ my: 3 }}>
              {prescriptions.map((pres) => (
                //console.log("Prescription Object:", pres),
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
                          marginLeft: "100px",
                          textAlign: "left",
                        }}
                      >
                        Prescription : {/* Clickable PDF to open in modal */}
                        <Button
                          onClick={() => handlePdfClick(pres._id)}
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
                          marginBottom: "30px",
                          textAlign: "left",
                          marginLeft: "100px",
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
                          textAlign: "left",
                          marginLeft: "100px",
                        }}
                      >
                        Status : {pres.status?.status}
                      </Typography>

                      <Box>
                        {pres.status?.status === "New" ? (
                          <Grid>
                            <Button
                              onClick={() => handleButton(pres._id, "accept")}
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
                              onClick={() => handleButton(pres._id, "declined")}
                            >
                              Decline
                            </Button>
                          </Grid>
                        ) : pres.status?.status === "Declined" ? (
                          <Button
                            variant="contained"
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
                            disabled
                          >
                            Order Declined
                          </Button>
                        ) : pres.status?.status === "Preparing" ? (
                          <Button
                            variant="contained"
                            sx={{
                              width: "250px",
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
                            onClick={() => handleButton(pres._id, "ready")}
                          >
                            Ready To Delivery
                          </Button>
                        ) : pres.status?.status === "Pending" ? (
                          <Button
                            variant="contained"
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
                            disabled
                          >
                            Wait for Shipper's Acceptance
                          </Button>
                        ) : pres.status?.status === "Accepted" ? (
                          <Button
                            variant="contained"
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
                            onClick={() =>
                              handleButton(pres._id, "delivered_shipper")
                            }
                          >
                            Delivered To Shipper
                          </Button>
                        ) : pres.status?.status === "Delivering" ? (
                          <Button
                            variant="contained"
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
                            disabled
                          >
                            Delivering
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
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
                            disabled
                          >
                            Completed
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
          <iframe
            src={`${HOST_URL}/prescription/${selectedPdf}/view`}
            width="100%"
            height="600px"
          ></iframe>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
          {/* Download button for explicit download action */}
          <Button variant="contained" color="secondary" onClick={downloadPres}>
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
