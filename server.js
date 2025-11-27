import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import ProductSchema from "./models/Product.js";
import dotenv from "dotenv";
import { loadLocalProducts, saveLocalProducts } from "./cache.js";

let productCache = loadLocalProducts();


const app = express();

dotenv.config();
app.use(cors());
app.use(json());

connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err));

const restoreFromDB = async () => {
  if (Object.keys(productCache).length === 0) {
    console.log("Local cache empty → restoring from MongoDB");
    const dbProducts = await ProductSchema.find({});
    
    dbProducts.forEach((p) => {
      productCache[p.barcode] = p.toObject();
    });

    saveLocalProducts(productCache);
  } else {
    console.log("Loaded products from local storage");
  }
};

app.post("/api/save-product", async (req, res) => {
  try {
    const productData = req.body;

    // Update cache
    productCache[productData.barcode] = productData;

    // Save to local file
    saveLocalProducts(productCache);

    // Save to DB
    await ProductModel.findOneAndUpdate(
      { barcode: productData.barcode },
      productData,
      { upsert: true, new: true }
    );

    res.json({ success: true, product: productData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save product" });
  }
});


app.post("/api/check-barcode", async (req, res) => {
  const { barcode } = req.body;

  const product = productCache[barcode];

  if (!product) {
    return res.json({ found: false });
  }

  return res.json({
    found: true,
    product,
  });
});


restoreFromDB();
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
