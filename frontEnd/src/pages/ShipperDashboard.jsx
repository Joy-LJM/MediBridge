import React, { useState, useEffect } from "react";
import { Container, Card, CardContent, Typography, Button, Grid, Box, Avatar } from "@mui/material";
import axios from "axios";

const Dashboard = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get("http://localhost:3000/api/orders");
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handleAccept = async (id) => {
        await axios.put(`http://localhost:5000/orders/accept/${id}`);
        fetchOrders();
    };

    return (
        <Box sx={{ backgroundColor: "#F0F8E2", minHeight: "100vh", paddingBottom: "20px" }}>
            
            {/* ✅ HEADER - MediBridge Title & Logo
            <Box sx={{ backgroundColor: "#4a7c59", padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img src="/medibridge.png" alt="MediBridge Logo" style={{ width: "50px", marginRight: "15px" }} />
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: "bold", color: "white" }}>
                            MediBridge
                        </Typography>
                        <Typography variant="body1" sx={{ color: "white", fontSize: "14px", marginTop: "-4px" }}>
                            Connecting convenient care for everyone
                        </Typography>
                    </Box>
                </Box>

                <Avatar src="/avatar.png" sx={{ width: 60, height: 60 }} />
            </Box> */}

            {/* ✅ NAVIGATION BAR
            <Box sx={{ backgroundColor: "#5B8C5A", padding: "10px", textAlign: "center" }}>
                <Box sx={{ display: "inline-flex", gap: "30px" }}>
                    <Typography variant="body1" sx={{ color: "white", fontWeight: "bold", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
                        Home
                    </Typography>
                    <Typography variant="body1" sx={{ color: "white", fontWeight: "bold", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
                        About
                    </Typography>
                    <Typography variant="body1" sx={{ color: "white", fontWeight: "bold", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
                        Contact
                    </Typography>
                </Box>
            </Box> */}

            {/* Sidebar */}
            <Box sx={{ display: "flex" }}>
                <Box sx={{ width: "200px", backgroundColor: "#6F996D", color: "white", padding: "20px", minHeight: "100vh" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Orders
                    </Typography>
                </Box>

                {/* ✅ UPDATED ORDER DISPLAY */}
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
                            Order: {order.orderId}
                        </Typography>

                        {/* ✅ Added spacing between sections */}
                        <Typography sx={{ fontWeight: "bold", fontSize: "16px", fontFamily: "Georgia, serif", marginBottom: "20px", marginLeft: "-20px" }}>
                            Pharmacy’s Location :   {order.pharmacyLocation}
                        </Typography>
                        

                        <Typography sx={{ fontWeight: "bold", fontSize: "16px", fontFamily: "Georgia, serif", marginBottom: "20px", marginLeft: "-65px" }}>
                            Customer’s Location : {order.customerLocation}
                        </Typography>
                       

                        <Typography sx={{ fontWeight: "bold", fontSize: "16px", fontFamily: "Georgia, serif", marginBottom: "20px", marginLeft: "-405px" }}>
                            Remark : {order.remark || "None"}
                        </Typography>

                        <Typography sx={{ fontWeight: "bold", fontSize: "16px", fontFamily: "Georgia, serif", marginBottom: "30px", marginLeft: "-408px" }}>
                            Status : {order.status || "None"}
                        </Typography>
                        

                        {/* ✅ Added spacing above button */}
                        {order.status === "Pending" ? (
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
                                    marginTop: "20px", // ✅ Added spacing above the button
                                    "&:hover": { backgroundColor: "#f0f0f0" }
                                }}
                            >
                                Accept
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
                                    marginTop: "20px" // ✅ Added spacing above the button
                                }}
                            >
                                Complete
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        ))}
    </Grid>
</Container>
            </Box>

            {/* Footer
            <Box sx={{ backgroundColor: "#4a7c59", color: "white", textAlign: "center", padding: "10px", marginTop: "20px" }}>
                <Typography variant="body2">© 2025 MediBridge. All rights reserved</Typography>
            </Box> */}
        </Box>
    );
};

export default Dashboard;



