// import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  CardMedia,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import aboutImg from "../assets/about.jpeg"; // Update this path to your image if stored locally

export default function About() {
  return (
    <Container maxWidth="lg" sx={{ py: 6, marginBottom: 5 }}>
      {/* Header */}
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography
            variant="h3"
            gutterBottom
            color="primary"
            fontWeight="bold"
          >
            About MediBridge
          </Typography>
          <Typography variant="body1">
            MediBridge is a platform built with the desire to bring good
            experience, care, and convenience to patients. We connect doctors,
            pharmacies, and patients, enabling fast and seamless prescription
            delivery right to your door.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            image={aboutImg}
            alt="MediBridge About"
            sx={{ borderRadius: 2, boxShadow: 3 }}
          />
        </Grid>
      </Grid>

      {/* What We Do */}
      <Box mt={6}>
        <Typography
          variant="h5"
          color="primary"
          fontWeight="medium"
          gutterBottom
        >
          What We Do
        </Typography>
        <Typography variant="body1">
          MediBridge streamlines the process of receiving prescription
          medication. After your doctor sends the prescription, we work with
          nearby pharmacies to deliver your medicine directly to your home,
          eliminating the need to wait in lines or travel unnecessarily.
        </Typography>
      </Box>

      {/* Medicine Recycling Program */}
      <Box mt={6}>
        <Typography
          variant="h5"
          color="primary"
          fontWeight="medium"
          gutterBottom
        >
          Medicine Recycling Program
        </Typography>
        <Typography variant="body1">
          We are committed to sustainability. MediBridge’s Medicine Recycling
          Program allows patients to return unused or expired medications
          safely, reducing waste and promoting responsible use of
          pharmaceuticals.
        </Typography>
      </Box>

      {/* Why Choose MediBridge */}
      <Box mt={6}>
        <Typography
          variant="h5"
          color="primary"
          fontWeight="medium"
          gutterBottom
        >
          Why Choose MediBridge?
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Doctor-approved prescriptions" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Partnered with trusted local pharmacies" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Fast and convenient delivery" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Eco-friendly through medicine recycling" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Patient-first approach to healthcare" />
          </ListItem>
        </List>
      </Box>

      {/* Mission */}
      <Box mt={6}>
        <Typography
          variant="h5"
          color="primary"
          fontWeight="medium"
          gutterBottom
        >
          Our Mission
        </Typography>
        <Typography variant="body1">
          Our mission is to simplify access to medication, support local
          pharmacies, and build a healthier, more sustainable future by
          combining healthcare and innovation in one unified platform.
        </Typography>
      </Box>
    </Container>
  );
}
