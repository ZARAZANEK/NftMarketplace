"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

interface Product {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  category?: string;
  author?: string;
  price: number;
  currency?: string;
  imageUrl?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { theme } = useTheme();
  const { addItem, ratesReady } = useCart();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const total = Number(product.price) * quantity;

  const handleConfirmPurchase = () => {
    if (!ratesReady) {
      alert("Please wait a moment. Loading currency rates...");
      return;
    }
    addItem({
      id: product.id || product._id || "",
      name: product.title,
      price: Number(product.price),
      image: product.imageUrl || "",
      quantity,
      currency: (product.currency || "USD").toUpperCase(),
    });
    setIsOpen(false);
    router.push("/Cart");
  };

  return (
    <div
      className={`w-full md:w-auto transition border rounded-lg shadow hover:shadow-lg 
        ${theme === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-100"}`}
    >
      <div className="overflow-hidden rounded-t-md">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="object-cover w-full h-64 transition-transform duration-300 transform md:h-72 hover:scale-110"
          />
        )}
      </div>

      <h3 className="px-3 mt-2 text-xl font-bold">
        {product.title.length > 14
          ? product.title.slice(0, 20) + "..."
          : product.title}
      </h3>

      <p className="px-3 mt-1 text-gray-600 truncate dark:text-gray-400">
        {product.description}
      </p>
      <div className="flex items-center justify-between px-3 mt-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Author: {product.author || "Unknown"}
        </p>
        <p className="font-semibold text-blue-600">
          {product.price} {product.currency}
        </p>
      </div>

      <div className="p-3">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full px-4 py-2 mt-3 text-white transition bg-blue-600 rounded hover:bg-green-700"
        >
          Buy
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-10 backdrop-blur-sm bg-black/30">
          <div
            className={`rounded-lg shadow-lg w-150 max-h-[90vh] overflow-y-auto ${
              theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
            }`}
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="object-cover w-full mb-4 rounded h-55"
              />
            )}

            <h2 className="relative text-[30px] left-5 font-bold mb-4">
              {product.title}
            </h2>

            <div className="relative left-3 top-[-10] max-w-120">
              <p className="mb-2">
                <span className="font-semibold">Description:</span>{" "}
                {product.description || "No description"}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Category:</span>{" "}
                {product.category || "—"}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Author:</span>{" "}
                {product.author || "Unknown"}
              </p>
              <p className="mb-4">
                <span className="font-semibold">Price per unit:</span>{" "}
                {product.price} {product.currency}
              </p>
            </div>

            <label className="block mb-2 w-135 ml-6.5 mt-[-17]">
              Quantity:
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className={`w-full border rounded p-2 mt-1 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-gray-100 border-gray-300"
                }`}
              />
            </label>

            <p className="block mb-4 ml-3 font-semibold">
              Total: {total} {product.currency}
            </p>

            <div className="flex justify-between">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 mb-5 ml-3 text-white bg-gray-400 rounded hover:bg-gray-500"
              >
                Close
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="px-4 py-2 mb-5 mr-3 text-white bg-green-600 rounded hover:bg-green-700"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
