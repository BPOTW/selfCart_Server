import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
  barcode: { type: String, unique: true },
  name: String,
  price: Number,
  stock: Number,
  category: String,
});

export default model("Product", ProductSchema);
