"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk();
  const router = useRouter();

  useEffect(() => {
    // Handle the OAuth callback by parsing the code from the URL
    handleRedirectCallback({
      redirectUrl: "/",
      afterSignInUrl: "/",
      afterSignUpUrl: "/",
    })
      .then(() => {
        // Successfully authenticated, redirect to home page
        router.push("/");
      })
      .catch((error) => {
        console.error("Error handling OAuth callback:", error);
        // Redirect to home page on error
        router.push("/");
      });
  }, [handleRedirectCallback, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Completing authentication...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}