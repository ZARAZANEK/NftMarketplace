"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import GoogleButton from "../components/GooglButton";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { theme } = useTheme();
  const { setUser } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);

        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        } else {
          const profileRes = await fetch(`${API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${data.token}` },
          });
          if (profileRes.ok) {
            const profile = await profileRes.json();
            localStorage.setItem("user", JSON.stringify(profile));
            setUser(profile);
          }
        }

        setTimeout(() => {
          window.location.href = "/profile";
          window.location.reload();
        }, 500);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-300
        ${theme === "dark" ? "bg-transparent" : "bg-white"}`}
    >
      <form
        onSubmit={handleLogin}
        className={`w-full max-w-md p-8 rounded-xl transition-colors duration-300
          ${
            theme === "dark"
              ? "bg-gray-900 text-white shadow-lg shadow-purple-600/60"
              : "bg-gray-50 text-black shadow-[0_0_15px_rgba(59,130,246,0.6)]"
          }`}
      >
        <h1 className="mb-6 text-2xl font-bold text-center">Login</h1>

        <label className="block mb-1">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`w-full p-3 mb-4 rounded outline-none transition-colors duration-300
            ${
              theme === "dark"
                ? "bg-gray-700 text-white"
                : "bg-gray-200 text-black"
            }`}
        />

        <label className="block mb-1">Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={`w-full p-3 mb-4 rounded outline-none transition-colors duration-300
            ${
              theme === "dark"
                ? "bg-gray-700 text-white"
                : "bg-gray-200 text-black"
            }`}
        />

        <button
          type="submit"
          className="w-full p-3 mt-2 transition-colors bg-blue-600 rounded hover:bg-blue-500"
        >
          Login
        </button>

        <p className="mt-4 text-center text-gray-400">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </form>

      <div className="w-full max-w-md mt-6">
        <GoogleButton redirectTo="/profile" />
      </div>
    </div>
  );
}
