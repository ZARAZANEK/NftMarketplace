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

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      });
  }, []);

  const handleSearch = (term: string) => {
    const filtered = products.filter(p =>
      p.title.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="w-full min-h-screen text-white bg-transparent">
      <Header onSearch={handleSearch} />

      <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
