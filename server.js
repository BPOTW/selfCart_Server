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

app.post("/api/check-barcode", async (req, res) => {
  try {
    const { barcode } = req.body;

    if (!barcode) {
      return res.status(400).json({ error: "Barcode is required" });
    }

    // const product = await ProductSchema.findOne({ barcode });

    // if (!product) {
    //   return res.json({ found: false, message: "Product not found" });
    // }

    res.json({
      found: true,
      product: {
        _id: "67aabbcc1234",
        barcode: "8964000951234",
        name: "Super Biscuit",
        price: 40,
        stock: 50,
        category: "Snacks",
      },
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
