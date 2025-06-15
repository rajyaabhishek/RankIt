"use client";
import { useClerk } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useEffect } from "react";

export default function LoginRedirect() {
  const { openSignIn } = useClerk();
  
  useEffect(() => {
    // Open Clerk's sign-in modal with dark theme
    openSignIn({
      appearance: {
        baseTheme: dark
      },
    });
  }, [openSignIn]);
  
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Opening sign in...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}

