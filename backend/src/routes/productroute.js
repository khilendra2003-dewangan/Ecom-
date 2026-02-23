import express from "express";
import { getAllProducts, getProductById, getProductsByCategory, getProductsBySubCategory } from "../controller/productController.js";


const ProductRoute = express.Router();

/* ---------- PUBLIC ---------- */

ProductRoute.get("/getproduct", getAllProducts);

ProductRoute.get("/getproduct/:id", getProductById);

ProductRoute.get("/category/:categoryId", getProductsByCategory);

ProductRoute.get("/subcategory/:subCategoryId", getProductsBySubCategory);

export default ProductRoute;
