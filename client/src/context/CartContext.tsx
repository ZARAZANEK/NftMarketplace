"use client";

import React, { useState, createContext, useContext, ReactNode, useEffect } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;    
  currency: string;       
  convertedPrice: number; 
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number; 
  discount: number;
  total: number;
  addItem: (item: Omit<CartItem, "convertedPrice">) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  message: string | null;
  clearMessage: () => void;
  ratesReady: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};

const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  BNB: "binancecoin",
  USDT: "tether",
  USDC: "usd-coin",
  DAI: "dai",
  MATIC: "matic-network",
  DOGE: "dogecoin",
  ADA: "cardano",
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  const [fiatRates, setFiatRates] = useState<{ [key: string]: number }>({});
  const [cryptoUsd, setCryptoUsd] = useState<{ [symbol: string]: number }>({});
  const [ratesReady, setRatesReady] = useState(false);

  const shipping = 5.99;

  useEffect(() => {
    const loadFiat = async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await res.json();
        if (data && data.rates) {
          setFiatRates(data.rates);
        }
      } catch (e) {
        console.error("Failed to fetch fiat rates", e);
      }
    };
    loadFiat();
  }, []);

  useEffect(() => {
    const loadCrypto = async () => {
      try {
        const ids = Object.values(COINGECKO_IDS).join(",");
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
        );
        const data = await res.json();
        const map: { [symbol: string]: number } = {};
        for (const [sym, id] of Object.entries(COINGECKO_IDS)) {
          const usd = data[id]?.usd;
          if (typeof usd === "number") map[sym] = usd;
        }
        setCryptoUsd(map);
      } catch (e) {
        console.error("Failed to fetch crypto rates", e);
      }
    };
    loadCrypto();
  }, []);

  useEffect(() => {
    if (Object.keys(fiatRates).length > 0 || Object.keys(cryptoUsd).length > 0) {
      setRatesReady(true);
    }
  }, [fiatRates, cryptoUsd]);

  const itemCount = items.reduce((c, i) => c + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.convertedPrice * i.quantity, 0);
  const total = items.length > 0 ? subtotal + shipping - discount : 0;

  const getUsdRate = (symbol: string): number | null => {
    const code = symbol.toUpperCase();

    if (code === "USD") return 1;

    if (fiatRates[code]) {
      return 1 / fiatRates[code];
    }

    if (cryptoUsd[code]) {
      return cryptoUsd[code]; 
    }

    return null;
  };

  const addItem = (newItem: Omit<CartItem, "convertedPrice">) => {
    const rate = getUsdRate(newItem.currency);

    let converted = newItem.price;
    if (rate && typeof rate === "number") {
      converted = newItem.price * rate;
    } else {
      setMessage(`No rate for ${newItem.currency}. Using USD fallback.`);
    }

    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === newItem.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, { ...newItem, convertedPrice: converted }];
    });

    setMessage(`${newItem.name} додано в корзину`);
  };

  const removeItem = (id: string) => {
    const removed = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (removed) setMessage(`${removed.name} видалено з корзини`);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setDiscount(0);
    setMessage("🗑 Кошик очищено");
  };

  const applyPromoCode = (code: string) => {
    if (code.toLowerCase() === "save10") {
      setDiscount(subtotal * 0.1);
      setMessage("🎉 Промокод застосовано");
      return true;
    }
    return false;
  };

  const clearMessage = () => setMessage(null);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount,
        total: Math.max(0, total),
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyPromoCode,
        message,
        clearMessage,
        ratesReady,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
