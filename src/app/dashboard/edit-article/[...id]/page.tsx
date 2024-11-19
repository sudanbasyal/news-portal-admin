"use client";
import { useParams } from "next/navigation";
import React from "react";

function page() {
  const params = useParams();
  console.log(params);
  return <div>Edit article</div>;
}

export default page;
