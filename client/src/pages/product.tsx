"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";

interface Product {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  description?: string;
  author?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, [API_URL]);

  const handleSearch = (term: string) => {
    const filtered = products.filter((p) =>
      p.title.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="w-full min-h-screen text-white bg-transparent">
      <Header onSearch={handleSearch} />

      <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
