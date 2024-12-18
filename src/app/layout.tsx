import type { Metadata } from "next";
import ReduxWrapper from "../../redux/ReduxWrapper";
import "./globals.css";
import ProviderWrapper from "./ProviderWrapper";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ujyalo Bulletin Dashboard",
  description: "Add, edit, and delete articles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <ReduxWrapper>
          <ProviderWrapper>{children}</ProviderWrapper>
        </ReduxWrapper>
      </body>
    </html>
  );
}
