"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

interface User {
  username: string;
  email: string;
  createdAt: string;
}

export default function CreateProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("ETH");
  const [image, setImage] = useState<File | null>(null);
  const [keywords, setKeywords] = useState("");
  const [category, setCategory] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { theme } = useTheme();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          localStorage.removeItem("token");
          router.push("/signin");
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        router.push("/signin");
      }
    };

    fetchUser();
  }, [router, API_URL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/signin");

      const keywordsArray = keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("currency", currency);
      formData.append("category", category);
      formData.append("keywords", JSON.stringify(keywordsArray));
      if (image) formData.append("image", image);

      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Error creating product");
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className={`max-w-md mx-auto p-6 border rounded-lg shadow mt-10 transition-colors duration-300
      ${theme === "dark"
        ? "bg-gray-900 border-gray-700 text-white"
        : "bg-white border-gray-200 text-black"}`}>
      <h1 className="mb-4 text-2xl font-bold text-center">Create Product</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* ... решта JSX для форми */}
      </form>
    </div>
  );
}
