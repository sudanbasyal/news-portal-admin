"use client";
import { useRouter } from "next/navigation";
import Login from "./(auth)/Login";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/dashboard/articles");
    }
  }, []);
  return <Login />;
}
