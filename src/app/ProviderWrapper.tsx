"use client";

import { createTheme, ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import React from "react";
// const theme = createTheme();
const theme = createTheme({
  palette: {
    primary: {
      main: "#f29727",
    },
    secondary: {
      main: "#f27127",
    },
  },
});
function ProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>{children}</SnackbarProvider>
    </ThemeProvider>
  );
}

export default ProviderWrapper;
