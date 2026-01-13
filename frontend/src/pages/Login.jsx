import React from "react";
import { SignIn } from "@clerk/clerk-react";

// Clerk-hosted authentication replaces the manual form.
// Ensure the app is wrapped with <ClerkProvider publishableKey=...>
// (typically in main.jsx) and that VITE_CLERK_PUBLISHABLE_KEY is set.

const Login = () => {
  return (
    <div className="flex justify-center mt-14">
      <SignIn
        path="/login"
        routing="path"
        signUpUrl="/login"
        afterSignInUrl="/"
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-black text-white hover:bg-gray-900 px-4 py-2 rounded",
          },
        }}
      />
    </div>
  );
};

export default Login;
