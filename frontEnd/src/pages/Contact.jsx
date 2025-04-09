import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function Contact() {
  return (
    <Container maxWidth="md" sx={{ py: 6, marginBottom: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
          Get in Touch
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          We're here to support you. Reach out to us through the details below
          for any inquiries or assistance related to MediBridge.
        </Typography>

        <Box>
          <List>
            <ListItem>
              <ListItemText
                primary="📍 Address"
                secondary="Conestoga Waterloo Campus, 108 University Ave E, Waterloo, ON N2J 2W2"
              />
            </ListItem>

            <ListItem>
              <ListItemText primary="📞 Phone" secondary="+1 (234) 567-8900" />
            </ListItem>

            <ListItem>
              <ListItemText
                primary="📧 Email"
                secondary="support@medibridge.com"
              />
            </ListItem>

            <ListItem>
              <ListItemText
                primary="⏰ Support Hours"
                secondary="Monday to Friday, 9 AM – 6 PM"
              />
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Container>
  );
}
