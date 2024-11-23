"use client";
import { useRouter } from "next/navigation";
import AuthWrapper from "../layout/AuthWrapper";
import DashboardLayout from "../layout/DashboardLayout/DashboardLayout";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    // Add a small delay or use redirect() instead
    const redirect = setTimeout(() => {
      router.push("/dashboard/articles");
    }, 0);

    return () => clearTimeout(redirect); // Cleanup timeout
  }, [router]);

  // Return null instead of a div that will be immediately unmounted

  return (
    <html lang="en">
      <body>
        <AuthWrapper>
          <DashboardLayout>{children}</DashboardLayout>
        </AuthWrapper>
      </body>
    </html>
  );
}
