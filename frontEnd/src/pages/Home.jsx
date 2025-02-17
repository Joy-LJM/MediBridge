
import Footer from "../components/Footer";
import Header from "../components/Header";
import Navigation from "../components/Navigation";

import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Paper,
  Box,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import "../styles/home.css";
import avatar from "../assets/avatar.png";

export default function Home() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }} className="container">
      <Header />
      <Navigation />
      <Container
        className="welcomeCard"
        sx={{
          textAlign: "center",
          py: 10,
          marginLeft: 0,
          marginRight: 0,
          "@media (min-width: 1200px)": {
            maxWidth: "1440px",
          },
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Welcome to MediBridge
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          A website to deliver your medicine following the doctors’
          prescriptions
        </Typography>
        <Typography variant="h6" sx={{ mt: 1, fontWeight: "bold" }}>
          Safe, Secure, Fast And Convenient.
        </Typography>
      </Container>

      <Container className="mission" sx={{ mt: 5, mb: 10 }}>
        <Typography
          variant="h5"
          textAlign="center"
          fontWeight="bold"
          gutterBottom
          sx={{ mt: 5, mb: 10 }}
        >
          OUR MISSIONS
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {[
            {
              title: "Safety",
              text: "Ensure the order reaches the patient safely and effectively",
            },
            { title: "Security", text: "Your information is secured" },
            {
              title: "Speed",
              text: "Your medicine will be delivered as fast as possible",
            },
            {
              title: "Convenience",
              text: "Receive your medicine at home without waiting or lining up.",
            },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  bgcolor: "#cde4a3",
                  minHeight: 130,
                  textAlign: "center",
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {item.title}
                  </Typography>
                  <Typography variant="body2">{item.text}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container sx={{ paddingBottom: 5, minHeight: 550 }}>
        <Typography
          variant="h5"
          textAlign="center"
          fontWeight="bold"
          gutterBottom
          paddingBottom={5}
        >
          Reviews
        </Typography>
        <Paper
          sx={{
            p: 3,
            bgcolor: "#fff",
            maxHeight: 300,
            overflowY: "auto",
            borderRadius: 5,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
                border: 1,
                borderRadius: 5,
                height: 100,
              }}
            >
              <Box
                variant="circular"
                component="img"
                src={avatar}
                alt="Avatar"
                sx={{
                  p: 2,
                  width: 70,
                  height: 70,
                  borderRadius: 50,
                }}
              />
              <Box flexDirection={"column"}>
                <Box flexDirection={"row"}>
                  <StarIcon color="warning" />
                  <StarIcon color="warning" />
                  <StarIcon color="warning" />
                  <StarIcon color="warning" />
                  <StarIcon color="warning" />
                </Box>

                <Typography variant="body1">
                  It is a good app for everyone.
                </Typography>
              </Box>
            </Box>
          ))}
        </Paper>
      </Container>
      
      <Footer />
    </Box>
  );
}
