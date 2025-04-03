import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./index.css";
import App from "./App.jsx";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { QueryClient } from "@tanstack/react-query";
import { UseProvider } from "../context";

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
const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient} contextSharing={true}>
        <UseProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
          </ThemeProvider>
        </UseProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
