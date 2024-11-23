import AuthWrapper from "../layout/AuthWrapper";
import DashboardLayout from "../layout/DashboardLayout/DashboardLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
