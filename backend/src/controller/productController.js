

/* ------------------ GET ALL PRODUCTS ------------------ */

import Product from "../models/productModel.js";

export const getAllProducts = async (req, res) => {
  const products = await Product.find({ isActive: true, isApproved: true })
    .populate({ path: "category", populate: { path: "parent" } })
    .populate({ path: "subCategory", populate: { path: "parent" } })
    .populate("seller", "name");

  res.json(products);
};

/* ------------------ GET PRODUCT BY ID ------------------ */

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category")
    .populate("subCategory")
    .populate("seller", "name email");

  if (!product) return res.status(404).json({ message: "Not found" });
  if (!product.isApproved && req.user?.role !== "admin") {
    return res.status(403).json({ message: "Product pending approval" });
  }

  res.json(product);
};

/* ------------------ FILTER BY CATEGORY ------------------ */

export const getProductsByCategory = async (req, res) => {
  const products = await Product.find({
    category: req.params.categoryId,
    isActive: true,
    isApproved: true,
  });

  res.json(products);
};

/* ------------------ FILTER BY SUB-CATEGORY ------------------ */

export const getProductsBySubCategory = async (req, res) => {
  const products = await Product.find({
    subCategory: req.params.subCategoryId,
    isActive: true,
    isApproved: true,
  });

  res.json(products);
};
