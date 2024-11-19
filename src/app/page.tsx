"use client";
import { useRouter } from "next/navigation";
import Login from "./(auth)/Login";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      router.replace("/dashboard");
    }
  }, [token]);
  return (
    <div>
      <Login />
    </div>
  );
}
