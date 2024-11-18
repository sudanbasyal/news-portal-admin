"use client";
import { Button } from "@mui/material";
import Image from "next/image";
import { useSnackbar } from "notistack";
import Login from "./(auth)/Login";

export default function Home() {
  const { enqueueSnackbar } = useSnackbar();
  return (
    <div>
      <Login />
    </div>
  );
}
