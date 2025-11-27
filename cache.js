import fs from "fs";
import path from "path";

const folderPath = path.resolve("data");
const filePath = path.resolve("data/products.json");

// Ensure folder + file exist
export const ensureStorage = () => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "{}");
  }
};

export const loadLocalProducts = () => {
  try {
    ensureStorage();
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data || "{}");
  } catch (e) {
    console.error("Failed to load local products:", e);
    return {};
  }
};

export const saveLocalProducts = (products) => {
  try {
    ensureStorage();
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  } catch (e) {
    console.error("Failed to save products:", e);
  }
};
