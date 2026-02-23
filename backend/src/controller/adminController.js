import Category from "../models/categoryModel.js";
import SubCategory from "../models/subcategorymodel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import cloudinary from "../config/cloudinary.js";

export const createCategory = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin allowed" });
  }

  try {
    let imageUrl = req.body.image;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "categories",
      });
      imageUrl = result.secure_url;
    }

    const category = await Category.create({
      name: req.body.name,
      image: imageUrl,
      parent: req.body.parentId || null, // Support nesting
      variantSchema: req.body.variantSchema || [], // Support variants at any level
      createdBy: req.user._id,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------ MIGRATION UTILITY ------------------ */

export const migrateSubCategoriesToCategories = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin allowed" });
  }

  try {
    const subCategories = await SubCategory.find();
    console.log(`Found ${subCategories.length} subcategories to migrate.`);

    for (const sub of subCategories) {
      // Check if already migrated (by name and parent)
      const existing = await Category.findOne({ name: sub.name, parent: sub.category });
      if (!existing) {
        await Category.create({
          name: sub.name,
          image: sub.image,
          parent: sub.category,
          variantSchema: sub.variantSchema,
          createdBy: sub.createdBy,
          createdAt: sub.createdAt,
        });
        console.log(`Migrated: ${sub.name}`);
      }
    }

    res.json({ message: "Migration complete 🚀" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------ SUBCATEGORY ------------------ */

export const createSubCategory = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin allowed" });
  }

  try {
    let imageUrl = req.body.image; // optional fallback

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "categories",
      });
      imageUrl = result.secure_url;
    }

    const subCategory = await SubCategory.create({
      name: req.body.name,
      category: req.body.categoryId,
      image: imageUrl,
      variantSchema: req.body.variantSchema || [],
      createdBy: req.user._id,
    });

    res.status(201).json(subCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------ VIEW USERS & SELLERS ------------------ */

export const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

export const getAllSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" }).sort({ createdAt: -1 });
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleSellerApproval = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "seller") {
      return res.status(404).json({ message: "Seller not found" });
    }
    user.isApproved = !user.isApproved;
    await user.save();
    res.json({ message: `Seller ${user.isApproved ? "Approved" : "Unapproved"} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------ PRODUCT APPROVAL ------------------ */

export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("seller", "name email")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleProductApproval = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.isApproved = !product.isApproved;
    await product.save();
    res.json({ message: `Product ${product.isApproved ? "Approved" : "Unapproved"} successfully`, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------ DASHBOARD STATS ------------------ */

export const getAdminDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalSellers = await User.countDocuments({ role: "seller" });
    const totalUsers = await User.countDocuments({ role: "user" });

    const orders = await Order.find();
    const totalSales = orders
      .filter(o => o.paymentStatus === "Paid")
      .reduce((acc, curr) => acc + curr.totalPrice, 0);

    const statusCounts = {
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0
    };

    orders.forEach(order => {
      order.items.forEach(item => {
        if (statusCounts[item.status] !== undefined) {
          statusCounts[item.status]++;
        }
      });
    });

    res.json({
      overview: {
        totalProducts,
        totalSellers,
        totalUsers,
        totalSales,
        totalOrders: orders.length
      },
      statusCounts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("createdBy", "name email")
      .populate("parent", "name") // Populate parent name for easy display
      .sort({ createdAt: -1 });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------ GET SUBCATEGORIES BY CATEGORY ------------------ */

export const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(subCategories);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

export const getSubCategoriesByCategory = async (req, res) => {
  try {
    // Return all children (immediate or all descendants? 
    // Usually immediate children is safer for breadcrumbs, 
    // but the frontend might expect all. Let's return all nodes with this parent.)
    const subCategories = await Category.find({
      parent: req.params.categoryId,
    }).populate("parent", "name");
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------ DELETE PRODUCT ------------------ */

export const deleteProductByAdmin = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted by admin 🛡️" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------ SELLER DETAILED STATS ------------------ */

export const getSellerDetailedStats = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch all products by this seller
    const products = await Product.find({ seller: id });
    const productIds = products.map(p => p._id.toString());
    const totalProducts = products.length;
    const remainingStock = products.reduce((acc, curr) => acc + curr.stock, 0);

    // Fetch all paid orders containing these products
    const orders = await Order.find({
      "items.product": { $in: productIds },
      paymentStatus: "Paid"
    });

    let totalRevenue = 0;
    let unitsSold = 0;
    const productSales = {};

    // Initialize map for all products
    productIds.forEach(id => {
      productSales[id] = 0;
    });

    orders.forEach(order => {
      order.items.forEach(item => {
        if (productIds.includes(item.product.toString())) {
          totalRevenue += item.price * item.quantity;
          unitsSold += item.quantity;
          productSales[item.product.toString()] += item.quantity;
        }
      });
    });

    // Total Stock Added = Current stock + Units Sold
    const totalStockAdded = remainingStock + unitsSold;

    res.json({
      totalProducts,
      remainingStock,
      totalStockAdded,
      unitsSold,
      totalRevenue,
      productSales // Map of productId -> quantitySold
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSubCategorySchema = async (req, res) => {
  try {
    const { id } = req.params;
    const { variantSchema } = req.body;

    console.log("Updating SubCategory Schema:", id);
    console.log("Variant Schema Payload:", JSON.stringify(variantSchema, null, 2));

    const node = await Category.findByIdAndUpdate(
      id,
      { $set: { variantSchema } }, // Explicitly use $set
      { new: true, runValidators: true }
    );

    if (!node) {
      console.log("Category Node NOT FOUND for ID:", id);
      return res.status(404).json({ message: "Category node not found" });
    }

    console.log("Updated Category Node:", JSON.stringify(node, null, 2));
    res.status(200).json(node);
  } catch (error) {
    console.error("Update Schema error:", error);
    res.status(500).json({ message: error.message });
  }
};
