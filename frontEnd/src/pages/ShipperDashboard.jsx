import { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
} from "@mui/material";
import axios from "axios";
import { HOST_URL } from "../constant";

const ShipperDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${HOST_URL}/api/orders`, {
        withCredentials: true,
      });
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `${HOST_URL}/api/pharmacy/prescription/update/${id}`,
        { deliveryStatus: newStatus },
        { withCredentials: true }
      );

      // Update UI immediately
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error(`Error updating order to ${newStatus}:`, error);
    }
  };

  const visibleOrders = orders.filter((order) =>
    ["Pending", "Accepted", "Delivering","Completed"].includes(order.status)
  );

  return (
    <Box sx={{ minHeight: "100vh", paddingBottom: "20px" }}>
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            width: "200px",
            backgroundColor: "#6F996D",
            color: "white",
            padding: "20px",
            minHeight: "100vh",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            My Orders
          </Typography>
        </Box>

        <Container maxWidth="md" sx={{ marginTop: "30px" }}>
          {visibleOrders.length === 0 ? (
            <Typography
              variant="h6"
              sx={{ fontFamily: "Georgia, serif", marginTop: "50px" }}
            >
              No orders found
            </Typography>
          ) : (
            <Grid container spacing={4} justifyContent="center">
              {visibleOrders.map((order) => (
                <Grid item xs={12} sm={12} key={order._id}>
                  <Card
                    sx={{
                      backgroundColor: "#EAF4E1",
                      borderRadius: "15px",
                      padding: "15px",
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
                          marginBottom: "20px",
                          fontFamily: "Georgia, serif",
                        }}
                      >
                        Order ID: {order._id}
                      </Typography>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          marginBottom: "20px",
                          fontFamily: "Georgia, serif",
                        }}
                      >
                        Updated at:{" "}
                        {new Date(order.updated_at)
                          .toLocaleString("en-US", {
                            weekday: "long", // e.g., Sunday
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          })
                          .replace(",", "")}
                      </Typography>

                      <Typography>
                        <strong>Pharmacy:</strong>{" "}
                        {order.pharmacyLocation || "N/A"}
                      </Typography>
                      <Typography>
                        <strong>Customer:</strong>{" "}
                        {order.customerLocation || "N/A"}
                      </Typography>
                      <Typography>
                        <strong>Remark:</strong> {order.remark || "None"}
                      </Typography>
                      <Typography>
                        <strong>Status:</strong> {order.status}
                      </Typography>

                      <Box sx={{ marginTop: "20px", display: "flex", gap: 2 }}>
                        {order.status === "Pending" && (
                          <>
                            <Button
                              onClick={() =>
                                updateOrderStatus(order._id, "Accepted")
                              }
                              variant="contained"
                              sx={{
                                backgroundColor: "#4CAF50",
                                color: "white",
                                fontWeight: "bold",
                                "&:hover": { backgroundColor: "#45a049" },
                              }}
                            >
                              Accept
                            </Button>
                            <Button
                              onClick={() =>
                                updateOrderStatus(order._id, "Declined")
                              }
                              variant="outlined"
                              sx={{
                                color: "red",
                                borderColor: "red",
                                fontWeight: "bold",
                                "&:hover": {
                                  borderColor: "#d32f2f",
                                  backgroundColor: "#ffe6e6",
                                },
                              }}
                            >
                              Decline
                            </Button>
                          </>
                        )}

                        {order.status === "Accepted" && (
                          <Button
                            onClick={() =>
                              updateOrderStatus(order._id, "Delivering")
                            }
                            variant="contained"
                            sx={{
                              backgroundColor: "#FF9800",
                              color: "white",
                              fontWeight: "bold",
                              "&:hover": { backgroundColor: "#fb8c00" },
                            }}
                          >
                            Delivering
                          </Button>
                        )}

                        {order.status === "Delivering" && (
                          <Button
                            onClick={() =>
                              updateOrderStatus(order._id, "Completed")
                            }
                            variant="contained"
                            sx={{
                              backgroundColor: "#2196F3",
                              color: "white",
                              fontWeight: "bold",
                              "&:hover": { backgroundColor: "#1976D2" },
                            }}
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
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default ShipperDashboard;
