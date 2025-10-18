"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import GoogleButton from "../components/GooglButton";

export default function SignupPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message);
        return;
      }

      alert("User created!");
      router.push("/signin");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  if (!mounted) return null; 

  return (
    <div
      className={`flex items-center justify-center min-h-screen transition-colors duration-300
        ${theme === "dark" ? "bg-transparent" : "bg-white"}`}
    >
      <form
        className={`w-full max-w-md p-8 rounded-xl transition-colors duration-300
          ${theme === "dark" 
            ? "bg-gray-900 text-white shadow-lg shadow-purple-600/60" 
            : "bg-gray-50 text-black shadow-[0_0_15px_rgba(59,130,246,0.6)]"}`}
        onSubmit={handleSignup}
      >
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>

        <label className="block mb-1">Username</label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          required
          className={`w-full p-3 mb-4 rounded outline-none transition-colors duration-300
            ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
        />

        <label className="block mb-1">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`w-full p-3 mb-4 rounded outline-none transition-colors duration-300
            ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
        />

        <label className="block mb-1">Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={`w-full p-3 mb-4 rounded outline-none transition-colors duration-300
            ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
        />

        <button
          type="submit"
          className={`w-full p-3 rounded transition-colors duration-300
            ${theme === "dark" ? "bg-green-600 hover:bg-green-500 text-white" : "bg-green-400 hover:bg-green-300 text-black"}`}
        >
          Sign Up
        </button>

        <p className={`mt-4 text-center transition-colors duration-300
          ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}
        >
          Already have an account?{" "}
          <a href="/signin" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      <div className="w-full max-w-md mt-6">
        <GoogleButton redirectTo="/profile" />
      </div>
      </form>
    </div>
  );
}
