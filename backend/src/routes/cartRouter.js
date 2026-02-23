import express from "express";
import { addToCart, clearCart, getCart, removeFromCart } from "../controller/cartController.js";
import { protect } from "../middlewares/auth.js";

const cartRouter = express.Router();

cartRouter.post("/add", protect, addToCart);
cartRouter.get("/", protect, getCart);
cartRouter.delete("/clear", protect, clearCart);
cartRouter.delete("/:cartItemId", protect, removeFromCart);

export default cartRouter;
