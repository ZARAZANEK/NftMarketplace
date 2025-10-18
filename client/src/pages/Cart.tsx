"use client";

import React, { useState } from "react";
import { TrashIcon, PlusIcon, MinusIcon } from "lucide-react";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useTheme } from "next-themes";

const Cart: React.FC = () => {
  const {
    items: cartItems,
    updateQuantity,
    removeItem,
    subtotal,
    applyPromoCode,
    discount,
    total,
  } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const shipping = 5.99;
  const { theme } = useTheme();

  const handleApplyPromoCode = () => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }
    const success = applyPromoCode(promoCode);
    if (success) {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoApplied(false);
      setPromoError("Invalid promo code");
    }
  };

  return (
    <div className="relative mt-20 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="border-b pb-4 mb-4 hidden lg:grid lg:grid-cols-12 gap-4">
              <div className="lg:col-span-6">
                <span className="font-medium">Product</span>
              </div>
              <div className="lg:col-span-2 text-center">
                <span className="font-medium">Price</span>
              </div>
              <div className="lg:col-span-2 text-center">
                <span className="font-medium">Quantity</span>
              </div>
              <div className="lg:col-span-2 text-right">
                <span className="font-medium">Total</span>
              </div>
            </div>

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="border-b py-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center"
              >
                <div className="lg:col-span-6 flex items-center">
                  <div className="w-20 h-20 bg-gray-100 mr-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <button
                      className="text-gray-500 flex items-center text-sm mt-1 hover:text-black"
                      onClick={() => removeItem(item.id)}
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Remove
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2 text-center">
                  <span className="lg:hidden font-medium mr-2">Price:</span>
                  {item.price} {item.currency}
                  <div className="text-xs text-gray-500">
                    (~${item.convertedPrice.toFixed(2)})
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="flex border border-gray-300 w-32 mx-auto">
                    <button
                      className="px-3 py-1 border-r border-gray-300"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      readOnly
                      className="w-full text-center"
                    />
                    <button
                      className="px-3 py-1 border-l border-gray-300"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2 text-right">
                  <span className="lg:hidden font-medium mr-2">Total:</span>
                  {item.price * item.quantity} {item.currency}
                  <div className="text-xs text-gray-500">
                    (~${(item.convertedPrice * item.quantity).toFixed(2)})
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-8 flex justify-between">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-black"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div
              className={`p-6 ${
                theme === "dark"
                  ? "bg-gray-950 text-white shadow-lg"
                  : "bg-white text-black"
              }`}
            >
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 border-b pb-4">
                <div className="flex justify-between">
                  <span>Subtotal (USD)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between py-4 font-bold">
                <span>Total (USD)</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Link
                href="/checkout"
                className={`w-full transition-colors duration-300 py-3 font-medium mt-4 block text-center
                  ${theme === "dark"
                    ? "bg-gray-900 text-white shadow-lg hover:bg-gray-800"
                    : "bg-blue-500 text-white shadow-lg hover:bg-blue-600"}`}
              >
                Proceed to Checkout
              </Link>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Promo Code</h3>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      setPromoError("");
                    }}
                    disabled={promoApplied}
                    className={`flex-1 border ${
                      promoError ? "border-red-300" : "border-gray-300"
                    } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black`}
                  />
                  <button
                    className={`px-4 py-2 font-medium ${
                      promoApplied
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }`}
                    onClick={handleApplyPromoCode}
                    disabled={promoApplied}
                  >
                    {promoApplied ? "Applied" : "Apply"}
                  </button>
                </div>
                {promoError && (
                  <p className="text-red-500 text-sm mt-1">{promoError}</p>
                )}
                {promoApplied && (
                  <p className="text-green-600 text-sm mt-1">
                    Promo code applied successfully!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link
            href="/"
            className="text-white bg-blue-500 px-6 py-3 font-medium rounded hover:bg-blue-600"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
