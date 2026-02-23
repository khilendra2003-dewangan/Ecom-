

/* ------------------ CREATE PRODUCT ------------------ */

import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import cloudinary from "../config/cloudinary.js";

export const createProduct = async (req, res) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({ message: "Only sellers allowed" });
  }

  try {
    const mainImages = [];
    const variantImagesMap = {};

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const b64 = Buffer.from(file.buffer).toString("base64");
        let dataURI = "data:" + file.mimetype + ";base64," + b64;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "products",
        });

        if (file.fieldname.startsWith("variantImage_")) {
          const index = file.fieldname.split("_")[1];
          variantImagesMap[index] = result.secure_url;
        } else {
          mainImages.push(result.secure_url);
        }
      }
    }

    let { variants, stock, ...rest } = req.body;

    // Parse variants if they come as a string (from FormData)
    if (typeof variants === "string") {
      try {
        variants = JSON.parse(variants);
      } catch (e) {
        variants = [];
      }
    }

    // Map variant images to variants
    if (variants && variants.length > 0) {
      variants = variants.map((v, idx) => ({
        ...v,
        image: variantImagesMap[idx] || v.image,
      }));
      // Calculate total stock
      stock = variants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0);
    }

    const product = await Product.create({
      ...rest,
      variants,
      stock,
      images: mainImages,
      seller: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

/* ------------------ GET SELLER PRODUCTS ------------------ */

export const getMyProducts = async (req, res) => {
  const products = await Product.find({ seller: req.user._id }).populate(
    "category subCategory",
  );

  res.json(products);
};

/* ------------------ UPDATE PRODUCT ------------------ */

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const mainImages = [];
    const variantImagesMap = {};

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const b64 = Buffer.from(file.buffer).toString("base64");
        let dataURI = "data:" + file.mimetype + ";base64," + b64;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "products",
        });

        if (file.fieldname.startsWith("variantImage_")) {
          const index = file.fieldname.split("_")[1];
          variantImagesMap[index] = result.secure_url;
        } else {
          mainImages.push(result.secure_url);
        }
      }
    }

    let { variants, stock, ...rest } = req.body;

    if (typeof variants === "string") {
      try {
        variants = JSON.parse(variants);
      } catch (e) { }
    }

    const updatedData = { ...rest };

    if (variants) {
      // If we have new variant images uploaded, apply them to the parsed variants
      variants = variants.map((v, idx) => ({
        ...v,
        image: variantImagesMap[idx] || v.image,
      }));

      updatedData.variants = variants;
      if (variants.length > 0) {
        updatedData.stock = variants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0);
      }
    } else if (stock !== undefined) {
      updatedData.stock = stock;
    }

    if (mainImages.length > 0) {
      updatedData.images = mainImages;
    }

    Object.assign(product, updatedData);
    await product.save();

    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

/* ------------------ DELETE PRODUCT ------------------ */

export const deleteMyProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ message: "Product not found" });

  if (product.seller.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await product.deleteOne();

  res.json({ message: "Product deleted" });
};

/* ------------------ GET SELLER ORDERS ------------------ */

export const getSellerOrders = async (req, res) => {
  try {
    const myProductIds = await Product.find({ seller: req.user._id }).distinct("_id");

    const detailedOrders = await Order.find({
      "items.product": { $in: myProductIds }
    })
      .populate({
        path: "items.product",
        populate: [
          { path: "category", select: "name" },
          { path: "subCategory", select: "name" }
        ]
      })
      .populate("user", "name email profilePicture phone")
      .sort("-createdAt");

    const filteredOrders = detailedOrders.map(order => {
      const myItems = order.items.filter(item =>
        item.product && item.product.seller.toString() === req.user._id.toString()
      );

      return {
        ...order._doc,
        items: myItems,
        // Calculate the total for the seller's portion of this order
        sellerTotal: myItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
      };
    }).filter(order => order.items.length > 0);

    res.json(filteredOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------ UPDATE ORDER ITEM STATUS ------------------ */

export const updateSellerOrderItemStatus = async (req, res) => {
  const { orderId, itemId, status } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const item = order.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found in order" });

    // Verify ownership
    const product = await Product.findById(item.product);
    if (!product || product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this item" });
    }

    item.status = status;

    // --- RECALCULATE PARENT ORDER STATUS ---
    const allStatuses = order.items.map(i => i.status);

    let newOrderStatus = "Pending";
    if (allStatuses.every(s => s === "Delivered")) {
      newOrderStatus = "Delivered";
    } else if (allStatuses.every(s => s === "Cancelled")) {
      newOrderStatus = "Cancelled";
    } else if (allStatuses.some(s => s === "Shipped")) {
      newOrderStatus = "Shipped";
    } else if (allStatuses.some(s => s === "Processing")) {
      newOrderStatus = "Processing";
    } else if (allStatuses.some(s => s === "Delivered")) {
      // Mixed delivered and others, keep it processing or shipped if applicable
      newOrderStatus = "Processing";
    }

    order.status = newOrderStatus;
    await order.save();

    res.json({ message: "Item status updated and order sync'd", itemStatus: item.status, orderStatus: order.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------ GET SELLER STATS ------------------ */

export const getSellerStats = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const myProductIds = await Product.find({ seller: sellerId }).distinct("_id");

    const orders = await Order.find({
      "items.product": { $in: myProductIds },
      // Only count delivered orders for profit? No, usually any paid/confirmed.
      // Let's count all non-cancelled for general stats.
    }).populate("items.product");

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let totalRevenue = 0;
    let monthlyProfit = 0;
    let dailyProfit = 0;
    let unitsSold = 0;
    const productSales = {};
    const dateWise = {};

    // Initialize productSales for all seller's products
    myProductIds.forEach(id => {
      productSales[id.toString()] = 0;
    });

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const isThisMonth = orderDate >= startOfMonth;
      const isToday = orderDate >= startOfDay;
      const dateKey = orderDate.toISOString().split("T")[0];

      order.items.forEach(item => {
        if (item.product && item.product.seller.toString() === sellerId.toString()) {
          const itemRevenue = item.price * item.quantity;
          totalRevenue += itemRevenue;
          unitsSold += item.quantity;
          productSales[item.product._id.toString()] += item.quantity;

          if (isThisMonth) monthlyProfit += itemRevenue;
          if (isToday) dailyProfit += itemRevenue;

          dateWise[dateKey] = (dateWise[dateKey] || 0) + itemRevenue;
        }
      });
    });

    const products = await Product.find({ seller: sellerId });
    const totalProducts = products.length;
    const remainingStock = products.reduce((acc, curr) => acc + curr.stock, 0);
    const totalStockAdded = remainingStock + unitsSold;

    // Format dateWise into array for charts
    const chartData = Object.keys(dateWise).sort().map(date => ({
      date,
      profit: dateWise[date]
    })).slice(-30);

    res.json({
      totalRevenue,
      monthlyProfit,
      dailyProfit,
      totalProducts,
      totalStockAdded,
      remainingStock,
      unitsSold,
      productSales,
      chartData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
