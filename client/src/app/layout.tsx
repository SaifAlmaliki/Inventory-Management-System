import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import StoreProvider from "./redux";
import DashboardWrapper from "./dashboardWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Car Parts Marketplace - Iraq",
  description: "Find car spare parts from dealers across Iraq",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <StoreProvider>
            <DashboardWrapper>{children}</DashboardWrapper>
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
