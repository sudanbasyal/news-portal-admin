import AuthWrapper from "../layout/AuthWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthWrapper>{children}</AuthWrapper>;
}
