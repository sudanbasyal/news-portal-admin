"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function Page() {
  const router = useRouter();
  useEffect(() => {
    router.push("/dashboard/articles");
  }, []);
  return <div>Dashboard Page</div>;
}

export default Page;
