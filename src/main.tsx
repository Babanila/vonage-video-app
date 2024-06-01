import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { UserContextProvider } from './context/userContext';
import theme from "./theme";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <UserContextProvider>
        <CssBaseline />
        <App />
      </UserContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
