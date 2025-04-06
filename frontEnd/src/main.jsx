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
import { UserProvider } from "../context";

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
      {/* Provide React Query client to the app */}
      <QueryClientProvider client={queryClient} contextSharing={true}>
        {/* Provide global context state and methods */}
        <UserProvider>
          {/* Apply Material UI theme */}
          <ThemeProvider theme={theme}>
            {/* Normalize CSS across browsers */}
            <CssBaseline />
            <App />
            {/* React Query dev tools (only in development) */}
            <ReactQueryDevtools initialIsOpen={false} />
          </ThemeProvider>
        </UserProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
