import express from "express";
import { authorize, protect } from "../middlewares/auth.js";
import { createProduct, deleteMyProduct, getMyProducts, getSellerOrders, getSellerStats, updateProduct, updateSellerOrderItemStatus } from "../controller/sellerController.js";


import upload from "../middlewares/multer.js";


const sellerRouter = express.Router();

/* ---------- CREATE PRODUCT ---------- */

sellerRouter.post("/create/product", protect, authorize("seller"), upload.any(), createProduct);

/* ---------- MY PRODUCTS ---------- */

sellerRouter.get("/seller/products", protect, authorize("seller"), getMyProducts);

/* ---------- UPDATE PRODUCT ---------- */

sellerRouter.put("/updateproduct/:id", protect, authorize("seller"), upload.any(), updateProduct);

/* ---------- DELETE PRODUCT ---------- */

sellerRouter.delete(
  "/deleteproduct/:id",
  protect,
  authorize("seller"),
  deleteMyProduct,
);

/* ---------- ORDERS & STATS ---------- */

sellerRouter.get("/orders", protect, authorize("seller"), getSellerOrders);
sellerRouter.post("/order/update-status", protect, authorize("seller"), updateSellerOrderItemStatus);
sellerRouter.get("/stats", protect, authorize("seller"), getSellerStats);

export default sellerRouter;
