import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import userRouter from "./src/routes/userRouter.js";
import adminrouter from "./src/routes/adminRoute.js";
import sellerRouter from "./src/routes/sellerRoute.js";
import Product from "./src/models/ProductModel.js";
import ProductRoute from "./src/routes/productroute.js";
import cartRouter from "./src/routes/cartRouter.js";
import orderRouter from "./src/routes/orderRouter.js";

dotenv.config();

const app = express();

app.use(cookieParser());

// Middleware

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // your frontend URL
    credentials: true,
  }),
);
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "KD Shopping Backend Running Successfully 🚀",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({
    message: "Something went wrong ❌",
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;
connectDB();

app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);

app.use("/api/v1", userRouter);
app.use("/api/v1", adminrouter);
app.use("/api/v1", sellerRouter);
app.use("/api/v1", ProductRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
