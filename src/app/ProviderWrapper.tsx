"use client";
import { SnackbarProvider } from "notistack";
import React from "react";

function ProviderWrapper({ children }: { children: React.ReactNode }) {
  return <SnackbarProvider>{children}</SnackbarProvider>;
}

export default ProviderWrapper;
