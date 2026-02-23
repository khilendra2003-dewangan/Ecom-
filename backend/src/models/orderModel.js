import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                name: String,
                price: Number,
                quantity: {
                    type: Number,
                    required: true,
                },
                image: String,
                selectedVariant: {
                    type: Map,
                    of: String,
                    default: {},
                },
                status: {
                    type: String,
                    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
                    default: "Pending",
                },
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Pending",
        },
        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending",
        },
        paymentMethod: {
            type: String,
            enum: ["COD", "Online", "Card"],
            default: "COD",
        },
        shippingAddress: {
            address: String,
            city: String,
            pincode: String,
            phone: String,
        },
    },
    { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
