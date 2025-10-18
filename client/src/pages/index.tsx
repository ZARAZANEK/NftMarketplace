"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useSearch } from "@/context/SearchContext";
import { useTheme } from "next-themes";

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: string | number;
  image?: string;
  keywords?: string[];
  category?: string;
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
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const applyFilters = () => {
    const filtered = products.filter(p => {
      const matchesSearch =
        !searchTerm ||
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(p.keywords) &&
          p.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())));
      const matchesDescription =
        !descriptionTerm || (p.description && p.description.toLowerCase().includes(descriptionTerm.toLowerCase()));
      const matchesCategory = !categoryFilter || (p.category && p.category.toLowerCase() === categoryFilter.toLowerCase());
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

  if (loading) return <p className="text-center mt-10 text-gray-400">Loading...</p>;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 mt-10 mb-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Filters</h1>
        <div
          className={`flex flex-wrap gap-4 p-4 rounded-lg shadow-md transition-colors duration-300
            ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}
        >
          <select
            className={`p-2 rounded w-40 transition-colors duration-300
              ${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 text-black border-gray-300"}`}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All categories</option>
            <option value="Art">Art</option>
            <option value="Game">Game</option>
            <option value="Collectible">Collectible</option>
          </select>

          <input
            type="number"
            placeholder="Minimum price"
            className={`p-2 rounded w-40 transition-colors duration-300
              ${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 text-black border-gray-300"}`}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
          />

          <input
            type="number"
            placeholder="Maximum price"
            className={`p-2 rounded w-40 transition-colors duration-300
              ${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 text-black border-gray-300"}`}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
          />

          <input
            type="text"
            placeholder="Search in description"
            className={`p-2 rounded flex-1 min-w-[200px] transition-colors duration-300
              ${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 text-black border-gray-300"}`}
            value={descriptionTerm}
            onChange={(e) => setDescriptionTerm(e.target.value)}
          />
        </div>
      </div>

      <main className="min-h-screen w-full py-6 bg-transparent">
        {filteredProducts.length > 0 ? (
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : theme === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-10">Nothing found 😕</p>
        )}
      </main>

    </>
  );
}
