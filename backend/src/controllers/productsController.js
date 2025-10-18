import Product from "../models/Product.js";
import User from "../models/User.js";

export const getProducts = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;

    let products = await Product.find().sort({ createdAt: -1 });

    products = products.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (Array.isArray(p.keywords) &&
          p.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase())));

      const matchesCategory =
        !category || (p.category && p.category.toLowerCase() === category.toLowerCase());

      const priceNum = Number(p.price);
      const matchesMinPrice = !minPrice || priceNum >= Number(minPrice);
      const matchesMaxPrice = !maxPrice || priceNum <= Number(maxPrice);

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });

    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, keywords, currency } = req.body;
    const user = await User.findById(req.userId).select("username");

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const newProduct = new Product({
      name,
      description,
      price,
      currency,
      category,
      keywords: keywords ? JSON.parse(keywords) : [],
      author: user.username,
      image: req.file?.path || "",
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
};
