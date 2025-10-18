"use client";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function CartMessage() {
  const { message, clearMessage } = useCart();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => clearMessage(), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, clearMessage]);

  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 px-4 py-2 rounded shadow-lg
                    bg-black text-white animate-fade-in">
      {message}
    </div>
  );
}
