import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "@/components/ProductCard";
import { CartProvider } from "@/context/CartContext";

const product = {
  _id: "1",
  name: "Test Product",
  description: "Cool NFT",
  price: 99,
  image: "https://via.placeholder.com/150",
  author: "Maxum",
};

describe("ProductCard", () => {
  it("рендерить назву і ціну", () => {
    render(
      <CartProvider>
        <ProductCard product={product} />
      </CartProvider>
    );

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$99")).toBeInTheDocument();
  });

  it("додає товар у кошик при кліку", () => {
    render(
      <CartProvider>
        <ProductCard product={product} />
      </CartProvider>
    );

    const button = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(button);
  });
});
