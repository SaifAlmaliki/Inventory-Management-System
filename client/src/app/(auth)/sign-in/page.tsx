"use client";

import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after successful sign in
    const handleSignIn = () => {
      router.push("/dashboard");
    };

    // Listen for successful sign in
    window.addEventListener("clerk:sign-in", handleSignIn);

    return () => {
      window.removeEventListener("clerk:sign-in", handleSignIn);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access the car parts marketplace
          </p>
        </div>
        <div className="flex justify-center">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
                card: "shadow-lg",
              },
            }}
            redirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
}
