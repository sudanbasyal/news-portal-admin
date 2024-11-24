"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout/DashboardLayout";

export default function AuthWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, []);

  // During SSR and initial client render, return a loading state or skeleton
  if (!isClient) {
    return null; // or return a loading spinner/skeleton
  }

  // Only check token after component has mounted on client
  const token = localStorage.getItem("token");
  if (!token) return null;

  return <DashboardLayout>{children}</DashboardLayout>;
}
