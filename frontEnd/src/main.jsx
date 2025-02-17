import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import { ThemeProvider, createTheme, } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

let theme = createTheme({
  palette: {
    primary: {
      main: "#689d6d",
      secondary: "#457447",
    },
  },
  typography: {
    fontFamily: '"Inknut Antiqua", serif', // Set the default font
  },
});

const theme = createTheme({
  typography: {
    fontFamily: '"Inknut Antiqua", serif', // Apply font globally
  },
});
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>

        <CssBaseline/>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
