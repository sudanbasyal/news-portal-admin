"use client";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import DashboardLayout from "./DashboardLayout/DashboardLayout";

export default function AuthWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useLayoutEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, []);

  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  if (!token) return null;

  return <DashboardLayout>{children}</DashboardLayout>;
}
