"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

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

  interface User {
    username: string;
    email: string;
    createdAt: string;
  }

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
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
  }, [router]);

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

      const res = await fetch("http://localhost:5000/api/products", {
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
    <div
      className={`max-w-md mx-auto p-6 border rounded-lg shadow mt-10 transition-colors duration-300
        ${theme === "dark"
          ? "bg-gray-900 border-gray-700 text-white"
          : "bg-white border-gray-200 text-black"}`}
    >
      <h1 className="text-2xl font-bold mb-4 text-center">Create Product</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block relative mb-1 left-2">Product Name</label>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full p-2 border rounded transition-colors duration-300
            ${theme === "dark"
              ? "bg-gray-800 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
              : "bg-white border-gray-300 text-black focus:ring-2 focus:ring-blue-500"}`}
          required
        />

        <label className="block relative mb-1 left-2">Product Description</label>
        <input
          type="text"
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full p-2 border rounded transition-colors duration-300
            ${theme === "dark"
              ? "bg-gray-800 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
              : "bg-white border-gray-300 text-black focus:ring-2 focus:ring-blue-500"}`}
        />

        <label className="block relative mb-1 left-2">Price</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`w-full p-2 border rounded transition-colors duration-300
              ${theme === "dark"
                ? "bg-gray-800 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                : "bg-white border-gray-300 text-black focus:ring-2 focus:ring-blue-500"}`}
            required
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={`w-32 p-2 border rounded transition-colors duration-300
              ${theme === "dark"
                ? "bg-gray-800 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                : "bg-white border-gray-300 text-black focus:ring-2 focus:ring-blue-500"}`}
          >
            <option value="ETH">ETH (Ethereum)</option>
            <option value="BTC">BTC (Bitcoin)</option>
            <option value="SOL">SOL (Solana)</option>
            <option value="BNB">BNB (Binance Coin)</option>
            <option value="USDT">USDT (Tether)</option>
            <option value="USDC">USDC (USD Coin)</option>
            <option value="DAI">DAI (Dai)</option>
            <option value="MATIC">MATIC (Polygon)</option>
            <option value="DOGE">DOGE (Dogecoin)</option>
            <option value="ADA">ADA (Cardano)</option>

            <option value="USD">USD (US Dollar)</option>
            <option value="EUR">EUR (Euro)</option>
            <option value="GBP">GBP (British Pound)</option>
            <option value="UAH">UAH (Ukrainian Hryvnia)</option>
            <option value="PLN">PLN (Polish Zloty)</option>
            <option value="JPY">JPY (Japanese Yen)</option>
            <option value="CNY">CNY (Chinese Yuan)</option>
            <option value="CHF">CHF (Swiss Franc)</option>
            <option value="CAD">CAD (Canadian Dollar)</option>
            <option value="AUD">AUD (Australian Dollar)</option>
          </select>
        </div>

        <label className="block relative mb-1 left-2">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className={`w-full p-2 border rounded transition-colors duration-300
            ${theme === "dark"
              ? "bg-gray-800 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
              : "bg-white border-gray-300 text-black focus:ring-2 focus:ring-blue-500"}`}
        />

        <label className="block relative mb-1 left-2">Keywords</label>
        <input
          type="text"
          placeholder="Keywords (comma separated)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className={`w-full p-2 border rounded transition-colors duration-300
            ${theme === "dark"
              ? "bg-gray-800 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
              : "bg-white border-gray-300 text-black focus:ring-2 focus:ring-blue-500"}`}
        />

        <label className="block relative mb-1 left-2">Select Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`w-full p-2 border rounded transition-colors duration-300
            ${theme === "dark"
              ? "bg-gray-800 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
              : "bg-white border-gray-300 text-black focus:ring-2 focus:ring-blue-500"}`}
          required
        >
          <option value="">Select Category</option>
          <option value="Art">Art</option>
          <option value="Game">Game</option>
          <option value="Collectible">Collectible</option>
        </select>

        <button
          type="submit"
          className={`w-full py-2 rounded font-medium transition-colors duration-300
            ${theme === "dark"
              ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/40"
              : "bg-blue-500 text-white hover:bg-blue-400 shadow-lg shadow-blue-500/40"}`}
        >
          Create
        </button>
      </form>
    </div>
  );
}
