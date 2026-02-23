import express from "express";
import { getUserOrders, getUserShoppingStats, placeOrder } from "../controller/orderController.js";
import { protect } from "../middlewares/auth.js";

const orderRouter = express.Router();

orderRouter.post("/place", protect, placeOrder);
orderRouter.get("/my", protect, getUserOrders);
orderRouter.get("/shopping-stats", protect, getUserShoppingStats);

export default orderRouter;
