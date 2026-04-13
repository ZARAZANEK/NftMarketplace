"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { useSearch } from "@/context/SearchContext";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface User {
  username: string;
  email: string;
  createdAt: string;
}

interface HeaderProps {
  showSearch: boolean;
}

export default function Header() {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { searchTerm, setSearchTerm } = useSearch();
  const [user, setUser] = useState<User | null>(null);
  const { items } = useCart();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      setUser(null);
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    };

    fetchUser();
  }, [router]);


  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/signin");
  };

  return (
    <header
      className={`w-full shadow-md transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-950 text-white shadow-lg shadow-purple-600/60"
          : "bg-white text-black shadow-[0_0_15px_rgba(59,130,246,0.6)]"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-4 mx-auto md:px-6 max-w-7xl">
        <Link
          href="/"
          className="text-2xl font-extrabold sm:text-3xl md:text-4xl gradient-text"
        >
          NFT Marketplace
        </Link>

        <div className="items-center hidden space-x-3 md:flex md:flex-1 md:justify-end">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-2xl w-60 border transition-all duration-300 ${
              theme === "dark"
                ? "bg-gray-920 border-gray-700 text-white focus-within:border-blue-500"
                : "bg-gray-100 border-gray-200 text-black shadow-lg focus-within:border-blue-500"
            }`}
          >
            <Search
              className={`w-5 h-5 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            />
            <input
              type="text"
              placeholder="Search Products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={`flex-1 outline-none rounded transition-colors duration-300 ${
                theme === "dark"
                  ? "bg-gray-920 text-white placeholder-white/70"
                  : "bg-gray-100 text-black placeholder-black"
              }`}
            />
          </div>

          <button
            className={`w-32 h-9 rounded-[8px] border transition-all duration-300 ${
              theme === "dark"
                ? "bg-gray-950 text-white border-gray-700 hover:bg-gray-900"
                : "bg-white text-black shadow-lg border-gray-200 hover:bg-gray-100"
            }`}
            onClick={() => router.push("/create-product")}
          >
            + Add Product
          </button>

          {user ? (
            <>
              <Link
                href="/profile"
                className={`px-3 py-1 rounded border-[1px] border-gray-300 transition-colors ${
                  theme === "dark"
                    ? "text-white border-gray-700 hover:bg-gray-900"
                    : "text-black shadow-lg hover:bg-gray-200"
                }`}
              >
                {user.username}
              </Link>
              <button
                onClick={handleLogout}
                className={`px-3 py-1 rounded border-[1px] border-gray-300 transition-colors ${
                  theme === "dark"
                    ? "text-white border-gray-700 hover:bg-gray-900"
                    : "text-black shadow-lg hover:bg-gray-200"
                }`}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/signin"
              className={`px-3 py-1 rounded border-[1px] border-gray-300 transition-colors ${
                theme === "dark"
                  ? "text-white border-gray-700 hover:bg-gray-900"
                  : "text-black shadow-lg hover:bg-gray-200"
              }`}
            >
              Sign in
            </Link>
          )}

          <Link href="/Cart" className="relative">
            <ShoppingCart
              className={`w-7 h-7 transition-colors ${
                theme === "dark" ? "text-white hover:text-blue-400" : "text-black hover:text-blue-600"
              }`}
            />
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg"
              >
                {cartCount}
              </span>
            )}
          </Link>


          <button
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className={`px-4 py-1 rounded border-[1px] border-gray-300 transition-colors ${
              theme === "dark"
                ? "bg-gray-950 text-white hover:bg-gray-900 border-gray-700"
                : "bg-white text-black shadow-lg hover:bg-gray-100"
            }`}
          >
            {resolvedTheme === "dark" ? "Light" : "Dark"}
          </button>
        </div>

        <div className="flex items-center gap-3 ml-auto md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className={`md:hidden px-4 pb-4 flex flex-col gap-3 transition-all duration-300 ${
            theme === "dark" ? "bg-gray-950 text-white" : "bg-white text-black"
          }`}
        >
          <div className="flex items-center w-full gap-2 px-3 py-2 border rounded-2xl">
            <Search
              className={`w-5 h-5 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            />
            <input
              type="text"
              placeholder="Search Products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={`flex-1 outline-none rounded transition-colors duration-300 ${
                theme === "dark"
                  ? "bg-gray-920 text-white placeholder-white/70"
                  : "bg-gray-100 text-black placeholder-black"
              }`}
            />
          </div>

          <button
            className={`w-full h-10 rounded-[8px] border transition-all duration-300 ${
              theme === "dark"
                ? "bg-gray-950 text-white border-gray-700 hover:bg-gray-900"
                : "bg-white text-black shadow-lg border-gray-200 hover:bg-gray-100"
            }`}
            onClick={() => {
              router.push("/create-product");
              setMenuOpen(false);
            }}
          >
            + Add Product
          </button>

          {user ? (
            <>
              <Link
                href="/profile"
                className={`px-3 py-2 rounded border-[1px] border-gray-300 text-center transition-colors ${
                  theme === "dark"
                    ? "text-white border-gray-700 hover:bg-gray-900"
                    : "text-black shadow-lg hover:bg-gray-200"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {user.username}
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className={`px-3 py-2 rounded border-[1px] border-gray-300 text-center transition-colors ${
                  theme === "dark"
                    ? "text-white border-gray-700 hover:bg-gray-900"
                    : "text-black shadow-lg hover:bg-gray-200"
                }`}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/signin"
              className={`px-3 py-2 rounded border-[1px] border-gray-300 text-center transition-colors ${
                theme === "dark"
                  ? "text-white border-gray-700 hover:bg-gray-900"
                  : "text-black shadow-lg hover:bg-gray-200"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Sign in
            </Link>
          )}


          <Link href="/Cart" className="relative">
            <ShoppingCart
              className={`w-7 h-7 transition-colors ${
                theme === "dark" ? "text-white hover:text-blue-400" : "text-black hover:text-blue-600"
              }`}
              onClick={() => setMenuOpen(false)}
            />
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg"
                onClick={() => setMenuOpen(false)}
              >
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            href="/Cart"
            className={`px-3 py-2 rounded border-[1px] border-gray-300 text-center transition-colors ${
              theme === "dark"
                ? "text-white border-gray-700 hover:bg-gray-900"
                : "text-black shadow-lg hover:bg-gray-200"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Cart
          </Link>

          <button
            onClick={() => {
              setTheme(resolvedTheme === "dark" ? "light" : "dark");
              setMenuOpen(false);
            }}
            className={`px-4 py-2 rounded border-[1px] border-gray-300 text-center ${
              theme === "dark"
                ? "bg-gray-950 text-white hover:bg-gray-900 border-gray-700"
                : "bg-white text-black shadow-lg hover:bg-gray-100"
            }`}
          >
            {resolvedTheme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      )}

      <hr
        className={`w-full h-px border-0 ${
          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
        }`}
      />
    </header>
  );
}
