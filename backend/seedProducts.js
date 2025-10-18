import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/Product.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const products = [
  {
    name: "Криптокіт",
    description: "Суперовий NFT котик",
    price: 99,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU7ayQAfh3Q7oEihJGIuCcD47y7sAGh78bNw&s",
    keywords: ["cute", "cat", "crypto"],
    category: "Art",
    author: "Unkmown"
  },
  {
    name: "Містер Біткоін",
    description: "Популярний NFT",
    price: 149,
    image: "https://www.brookings.edu/wp-content/uploads/2021/06/shutterstock_1708749826_small.jpg?quality=75&w=500",
    keywords: ["bitcoin", "crypto", "funny"],
    category: "Collectible",
    author: "Unkmown"
  },
  {
    name: "NFT Арт",
    description: "Красивий цифровий арт",
    price: 199,
    image: "https://i.insider.com/5df8ff6f695b587e357ed3f4?width=800&format=jpeg&auto=webp",
    keywords: ["art", "digital", "colorful"],
    category: "Art",
    author: "Unkmown"
  },
  {
    name: "Crypto Game Item",
    description: "Ітем для NFT гри",
    price: 49,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpfH1VNq2_B1FpohqmcCKUrUAndtPfLTSUdw&s",
    keywords: ["game", "item", "crypto"],
    category: "Game",
    author: "Unkmown"
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    await Product.deleteMany({});
    console.log("Колекція очищена");

    await Product.insertMany(products);
    console.log("Продукти додані");

    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

seed();
