"use client";

import React, { useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navbar from "@/app/(components)/Navbar";
import Sidebar from "@/app/(components)/Sidebar";
import { useAppSelector, useAppDispatch } from "./redux";
import { setUser, setAuthenticated, setRole } from "@/state/userSlice";
import { UserRole } from "@/state/api";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.add("light");
    }
  });

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user) {
        const role = (user.publicMetadata?.role as UserRole) || UserRole.CUSTOMER;
        
        // Create user object for Redux store
        const userData = {
          userId: user.id,
          clerkId: user.id,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
          email: user.emailAddresses[0]?.emailAddress || "",
          role,
          phoneNumber: user.phoneNumbers[0]?.phoneNumber || "",
          address: "",
          city: "",
          province: "",
          isApproved: role === UserRole.ADMIN, // Auto-approve admins
          businessName: "",
          businessLicense: "",
          storeName: "",
          createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
        };

        dispatch(setUser(userData));
        dispatch(setAuthenticated(true));
        dispatch(setRole(role));
      } else {
        dispatch(setAuthenticated(false));
        dispatch(setRole(null));
      }
    }
  }, [isLoaded, isSignedIn, user, dispatch]);

  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  // Redirect to onboarding if user doesn't have role set
  if (isSignedIn && user && !user.publicMetadata?.role) {
    router.push("/onboarding");
    return null;
  }

  return (
    <div
      className={`${
        isDarkMode ? "dark" : "light"
      } flex bg-gray-50 text-gray-900 w-full min-h-screen`}
    >
      <Sidebar />
      <main
        className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 ${
          isSidebarCollapsed ? "md:pl-24" : "md:pl-72"
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default DashboardWrapper;
