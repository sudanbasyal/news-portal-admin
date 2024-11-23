"use client";

import { createTheme, ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import React from "react";
const theme = createTheme();
function ProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>{children}</SnackbarProvider>
    </ThemeProvider>
  );
}

export default ProviderWrapper;
