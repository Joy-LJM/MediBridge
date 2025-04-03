import React, { useState, useEffect } from "react";
import { Container, Card, CardContent, Typography, Button, Grid, Box, Avatar } from "@mui/material";
import axios from "axios";

const ShipperDashboard = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get("http://localhost:3000/api/orders");
            console.log("Fetched Orders:", data);
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handleAccept = async (id) => {
        try {
            await axios.put(`http://localhost:3000/api/orders/update/${id}`, { status: "Accepted" });
            fetchOrders();
        } catch (error) {
            console.error("Error accepting order:", error);
        }
    };

    const handleDeliveryComplete = async (id) => {
        try {
            await axios.put(`http://localhost:3000/api/orders/update/${id}`, { status: "Completed" });
            fetchOrders();
        } catch (error) {
            console.error("Error completing delivery:", error);
        }
    };

    return (
        <Box sx={{  minHeight: "100vh", paddingBottom: "20px" }}>
            <Box sx={{ display: "flex" }}>
                <Box sx={{ width: "200px", backgroundColor: "#6F996D", color: "white", padding: "20px", minHeight: "100vh" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Orders
                    </Typography>
                </Box>

                <Container maxWidth="md" sx={{ marginTop: "30px" }}>
                    <Grid container spacing={4} justifyContent="center">
                        {orders.map((order) => (
                            <Grid item xs={12} sm={12} key={order._id}>
                                <Card
                                    sx={{
                                        backgroundColor: "#EAF4E1",
                                        borderRadius: "15px",
                                        boxShadow: "2px 4px 8px rgba(0,0,0,0.1)",
                                        padding: "15px",
                                        textAlign: "center",
                                        maxWidth: "650px",
                                        margin: "auto",
                                        border: "1px solid rgba(0, 0, 0, 0.1)"
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
                                                fontFamily: "Georgia, serif"
                                            }}
                                        >
                                            Order: {order._id}
                                        </Typography>

                                        <Typography sx={{ fontWeight: "bold", fontSize: "15px", fontFamily: "Georgia, serif", marginBottom: "20px" }}>
                                            Pharmacy’s Location: {order.pharmacyLocation}
                                        </Typography>

                                        <Typography sx={{ fontWeight: "bold", fontSize: "15px", fontFamily: "Georgia, serif", marginBottom: "20px" }}>
                                            Customer’s Location: {order.customerLocation || "None"}
                                        </Typography>

                                        <Typography sx={{ fontWeight: "bold", fontSize: "15px", fontFamily: "Georgia, serif", marginBottom: "20px" }}>
                                            Remark: {order.remark || "None"}
                                        </Typography>

                                        <Typography sx={{ fontWeight: "bold", fontSize: "15px", fontFamily: "Georgia, serif", marginBottom: "30px" }}>
                                            Status: {order.status || "None"}
                                        </Typography>

                                        {/* Action Buttons Based on Order Status */}
                                        {order.status === "New" || order.status === "Declined" ? (
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
                                                    marginTop: "20px"
                                                }}
                                            >
                                                {order.status === "New" ? "Waiting for Pharmacy" : "Order Declined"}
                                            </Button>
                                        ) : order.status === "Pending" ? (
                                            <Button
                                                onClick={() => handleAccept(order._id)}
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: "white",
                                                    color: "black",
                                                    borderRadius: "30px",
                                                    padding: "10px 40px",
                                                    textTransform: "none",
                                                    fontSize: "16px",
                                                    fontWeight: "bold",
                                                    boxShadow: "1px 2px 5px rgba(0,0,0,0.2)",
                                                    marginTop: "20px",
                                                    "&:hover": { backgroundColor: "#f0f0f0" }
                                                }}
                                            >
                                                Accept
                                            </Button>
                                        ) : order.status === "Accepted" ? (
                                            <Button
                                                onClick={() => handleDeliveryComplete(order._id)}
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: "#FFC107",
                                                    color: "black",
                                                    borderRadius: "30px",
                                                    padding: "10px 40px",
                                                    textTransform: "none",
                                                    fontSize: "16px",
                                                    fontWeight: "bold",
                                                    boxShadow: "1px 2px 5px rgba(0,0,0,0.2)",
                                                    marginTop: "20px",
                                                    "&:hover": { backgroundColor: "#FFD54F" }
                                                }}
                                            >
                                                Mark as Delivered
                                            </Button>
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
                                                    marginTop: "20px"
                                                }}
                                            >
                                                {order.status === "Delivering" ? "Delivering" : "Completed"}
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default ShipperDashboard;
