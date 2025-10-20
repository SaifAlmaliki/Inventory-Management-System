"use client";

import { SignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to onboarding after successful sign up
    const handleSignUp = () => {
      router.push("/onboarding");
    };

    // Listen for successful sign up
    window.addEventListener("clerk:sign-up", handleSignUp);

    return () => {
      window.removeEventListener("clerk:sign-up", handleSignUp);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join the car parts marketplace
          </p>
        </div>
        <div className="flex justify-center">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
                card: "shadow-lg",
              },
            }}
            redirectUrl="/onboarding"
          />
        </div>
      </div>
    </div>
  );
}
