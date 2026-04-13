"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

const Footer: React.FC = () => {
  const { theme } = useTheme();

  return (
    <footer
      className={`border-t transition-colors duration-300
        ${theme === "dark"
          ? "bg-gray-950 text-white border-gray-700"
          : "bg-gray-100 text-black border-gray-300"}`}
    >
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3
              className={`text-lg font-bold mb-4 ${
                theme === "dark" ? "text-purple-400" : "text-blue-600"
              }`}
            >
              NFT Marketplace
            </h3>
            <p className="opacity-70">
              Premium futuristic fashion for the modern cyberpunk enthusiast.
            </p>
          </div>

          <div>
            <h3
              className={`text-lg font-bold mb-4 ${
                theme === "dark" ? "text-green-400" : "text-green-600"
              }`}
            >
              Shop
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "All Products" },
                { href: "/art", label: "Art" },
                { href: "/game", label: "Game" },
                { href: "/collectible", label: "Collectible" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`transition-colors duration-300 ${
                      theme === "dark"
                        ? "text-gray-400 hover:text-green-400"
                        : "text-gray-600 hover:text-green-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className={`text-lg font-bold mb-4 ${
                theme === "dark" ? "text-purple-400" : "text-purple-600"
              }`}
            >
              Stay Connected
            </h3>
            <p className="mb-4 opacity-70">Subscribe to our newsletter</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex">
              <input
                type="email"
                placeholder="Your email"
                className={`px-4 py-2 w-full focus:outline-none focus:ring-1 rounded-l transition-colors duration-300
                  ${theme === "dark"
                    ? "bg-gray-800 border border-gray-600 text-white focus:ring-purple-500"
                    : "bg-white border border-gray-300 text-black focus:ring-purple-500"}`}
              />
              <button
                type="submit"
                className={`px-4 py-2 font-medium rounded-r transition-colors duration-300
                  ${theme === "dark"
                    ? "bg-purple-600 text-white hover:bg-purple-500"
                    : "bg-purple-500 text-white hover:bg-purple-400"}`}
              >
                Subscribe
              </button>
            </form>

            <div className="flex mt-6 space-x-6">
              {[
                { label: "Facebook", dark: "hover:text-blue-400", light: "hover:text-blue-600" },
                { label: "Instagram", dark: "hover:text-pink-400", light: "hover:text-pink-600" },
                { label: "Twitter", dark: "hover:text-green-400", light: "hover:text-green-600" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  className={`transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-400 " + s.dark : "text-gray-600 " + s.light
                  }`}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center transition-colors duration-300
            ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`}
        >
          <p className="opacity-70">© 2025 NFT Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
