"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface GoogleButtonProps {
  redirectTo?: string;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ redirectTo = "/profile" }) => {
  const router = useRouter();

  const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
    try {
      const token = response.credential;

      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      });

      if (!res.ok) throw new Error("Google authentication failed");
      const data = await res.json();

      localStorage.setItem("token", data.token);
      router.push(redirectTo);
    } catch (err) {
      console.error("Google login error:", err);
      alert("Google login failed. Please try again.");
    }
  }, [router, redirectTo]);


  useEffect(() => {
    if (typeof window === "undefined" || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleButtonDiv")!,
      {
        theme: "outline",
        size: "large",
        width: "100%",
        text: "signin_with",
      }
    );
  }, [handleCredentialResponse]);

  return <div id="googleButtonDiv" className="w-full my-4" />;
};

export default GoogleButton;
