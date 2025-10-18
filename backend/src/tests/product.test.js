import request from "supertest";
import app from "../app.js"; // твій Express app
import mongoose from "mongoose";
import Product from "../src/models/Product.js";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Products API", () => {
  it("GET /api/products → має повертати масив", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/products → створює продукт", async () => {
    const token = "тут встав JWT токен"; // можна згенерити через auth
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "Test Product")
      .field("price", 100)
      .field("category", "Art")
      .field("keywords", JSON.stringify(["test", "unit"]))
      .attach("image", "__tests__/fixtures/test.png");

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe("Test Product");
  });
});
