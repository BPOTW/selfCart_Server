import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import ProductSchema from "./models/Product.js";
import dotenv from "dotenv";

const app = express();

dotenv.config();
app.use(cors());
app.use(json());

connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err));

app.post("/api/save-product", async (req, res) => {
  try {
    const response = await saveProduct(req.body);
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/check-barcode", async (req, res) => {
  try {
    const { barcode } = req.body;
    console.log(barcode);
    if (!barcode) {
      return res.status(400).json({ error: "Barcode is required" });
    }

    const product = await ProductSchema.findOne({ barcode });

    if (!product) {
      return res.json({ found: false, message: "Product not found" });
    }

    res.json({
      found: true,
      product: product,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export const saveProduct = async (data) => {
  try {
    const { barcode, name, price, stock, category } = data;

    if (!barcode || !name) {
      throw new Error("Barcode and name are required");
    }

    // Check if product already exists
    let product = await ProductSchema.findOne({ barcode });

    if (product) {
      // Update existing product
      product.name = name;
      if (price !== undefined) product.price = price;
      if (stock !== undefined) product.stock = stock;
      if (category !== undefined) product.category = category;

      await product.save();
      return { message: "Product updated", product };
    }

    // Create new product
    product = new ProductSchema({
      barcode,
      name,
      price,
      stock,
      category,
    });

    await product.save();

    return { message: "Product created", product };

  } catch (err) {
    console.error("Save product error:", err.message);
    throw new Error("Failed to save product");
  }
};

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
