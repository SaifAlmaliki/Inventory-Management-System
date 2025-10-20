import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
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
          <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="text-lg font-semibold text-gray-800">Car Parts Marketplace</div>
              <div className="flex items-center gap-3">
                <SignedOut>
                  <SignInButton signInUrl="/sign-in">
                    <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Sign in</button>
                  </SignInButton>
                  <SignUpButton signUpUrl="/sign-up">
                    <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">Sign up</button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </div>
          </header>
          <StoreProvider>
            <DashboardWrapper>{children}</DashboardWrapper>
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
