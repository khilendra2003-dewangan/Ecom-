import express from "express";
import { authorize, protect } from "../middlewares/auth.js";
import {
  createCategory,
  createSubCategory,
  deleteProductByAdmin,
  getAllUsers,
  getAllSellers,
  toggleSellerApproval,
  getAllProductsAdmin,
  toggleProductApproval,
  getAdminDashboardStats,
  getSellerDetailedStats,
  updateSubCategorySchema,
  migrateSubCategoriesToCategories,
} from "../controller/adminController.js";

const adminrouter = express.Router();

import upload from "../middlewares/multer.js";

/* ---------- DASHBOARD STATS ---------- */

adminrouter.get("/admin/stats", protect, authorize("admin"), getAdminDashboardStats);

/* ---------- CATEGORY ---------- */

adminrouter.post("/create/category", protect, authorize("admin"), upload.single("image"), createCategory);
adminrouter.post("/migrate-categories", protect, authorize("admin"), migrateSubCategoriesToCategories);
adminrouter.post("/create/subcategory", protect, authorize("admin"), upload.single("image"), createSubCategory);
adminrouter.put("/update/subcategory-schema/:id", protect, authorize("admin"), updateSubCategorySchema);

/* ---------- USERS & SELLERS ---------- */

adminrouter.get("/admin/getalluser", protect, authorize("admin"), getAllUsers);
adminrouter.get("/admin/getallsellers", protect, authorize("admin"), getAllSellers);
adminrouter.get("/admin/seller-stats/:id", protect, authorize("admin"), getSellerDetailedStats);
adminrouter.put("/admin/toggle-seller/:id", protect, authorize("admin"), toggleSellerApproval);

/* ---------- PRODUCT MANAGEMENT ---------- */

adminrouter.get("/admin/getallproducts", protect, authorize("admin"), getAllProductsAdmin);
adminrouter.put("/admin/toggle-product/:id", protect, authorize("admin"), toggleProductApproval);
adminrouter.delete("/admin/deleteproduct/:id", protect, authorize("admin"), deleteProductByAdmin);

export default adminrouter;
