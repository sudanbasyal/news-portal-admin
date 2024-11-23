"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Replace with your auth logic
    if (!token) {
      router.push("/login"); // Redirect to login if no token
    }
  }, []);
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
