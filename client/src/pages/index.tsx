"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useSearch } from "@/context/SearchContext";
import { useTheme } from "next-themes";

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  keywords?: string[];
  category?: string;
  author?: string;
  currency?: string;
}

export default function HomePage() {
  const { searchTerm } = useSearch();
  const { theme } = useTheme();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [descriptionTerm, setDescriptionTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    fetch("https://nftmarketplace-3j5a.onrender.com/api/products")
      .then(res => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, []);

  const applyFilters = () => {
    const filtered = products.filter(p => {
      const matchesSearch =
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(p.keywords) &&
          p.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchesDescription =
        !descriptionTerm || (p.description && p.description.toLowerCase().includes(descriptionTerm.toLowerCase()));

      const matchesCategory =
        !categoryFilter || (p.category && p.category.toLowerCase() === categoryFilter.toLowerCase());

      const priceNum = Number(p.price);
      const matchesMinPrice = minPrice === "" || priceNum >= minPrice;
      const matchesMaxPrice = maxPrice === "" || priceNum <= maxPrice;

      return matchesSearch && matchesDescription && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, categoryFilter, minPrice, maxPrice, descriptionTerm, products]);

  if (loading) return <p className="mt-10 text-center text-gray-400">Loading...</p>;

  return (
    <>
      {/* Filters */}
      <div className="px-4 mx-auto mt-10 mb-8 max-w-7xl">
        <h1 className="mb-4 text-2xl font-bold text-center">Filters</h1>
        {/* ... решта JSX для фільтрів */}
      </div>

      {/* Products */}
      <main className="w-full min-h-screen py-6 bg-transparent">
        {filteredProducts.length > 0 ? (
          <div className="px-4 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {currentProducts.map((p) => (
                <ProductCard
                  key={p._id}
                  product={{
                    ...p,
                    title: p.name, // додаємо поле title
                  }}
                />
              ))}
            </div>
            {/* Pagination */}
          </div>
        ) : (
          <p className="mt-10 text-center text-gray-400">Nothing found 😕</p>
        )}
      </main>
    </>
  );
}
