import { Box } from "@mui/material";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Navigation from "../components/Navigation";

export default function Home() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }} className="container">
      <Header />
      <Navigation />
      sss
      <Footer />
    </Box>
  );
}
