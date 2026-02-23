import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";

/* ------------------ PLACE ORDER ------------------ */
export const placeOrder = async (req, res) => {
    try {
        console.log("Placing Order - Body:", req.body);
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            console.log("Cart empty for user:", req.user._id);
            return res.status(400).json({ message: "Cart is empty" });
        }

        const orderItems = cart.items.map((item) => {
            if (!item.product) {
                console.error("Product missing in cart item:", item);
                throw new Error("Product data missing for an item in cart");
            }

            // Find matching variant if selectedVariant is not empty
            let variantImage = "";
            let selectedVariant = {};
            if (item.selectedVariant && Object.keys(item.selectedVariant).length > 0) {
                // Determine if it was stored as Map or POJO
                const svJson = item.selectedVariant instanceof Map ? Object.fromEntries(item.selectedVariant) : item.selectedVariant;
                selectedVariant = svJson;

                const productVariants = item.product.variants || [];
                const matchedVariant = productVariants.find(v => {
                    const vOpts = v.options instanceof Map ? Object.fromEntries(v.options) : (v.options || {});
                    return JSON.stringify(vOpts) === JSON.stringify(svJson);
                });

                if (matchedVariant && matchedVariant.image) {
                    variantImage = matchedVariant.image;
                }
            }

            return {
                product: item.product._id,
                name: item.product.name,
                price: item.product.discountPrice || item.product.price,
                quantity: item.quantity,
                image: variantImage || item.product.images?.[0] || "",
                selectedVariant: selectedVariant
            };
        });

        const totalPrice = orderItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        console.log("Creating Order document...");
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalPrice,
            paymentStatus: req.body.paymentMethod === "COD" ? "Pending" : "Paid",
            paymentMethod: req.body.paymentMethod || "COD",
            shippingAddress: {
                address: req.body.address,
                city: req.body.city,
                pincode: req.body.pincode,
                phone: req.body.phone,
            }
        });

        console.log("Updating stock...");
        // Update stock for each product
        await Promise.all(
            cart.items.map(async (item) => {
                const product = item.product;

                // Decrement main product stock and increment salesCount
                product.stock -= item.quantity;
                if (product.stock < 0) product.stock = 0; // Guard

                product.salesCount = (product.salesCount || 0) + item.quantity;

                // Decrement specific variant stock if applicable
                if (item.selectedVariant && Object.keys(item.selectedVariant).length > 0) {
                    const svJson = item.selectedVariant instanceof Map ? Object.fromEntries(item.selectedVariant) : item.selectedVariant;
                    if (product.variants && product.variants.length > 0) {
                        const matchedIndex = product.variants.findIndex(v => {
                            const vOpts = v.options instanceof Map ? Object.fromEntries(v.options) : (v.options || {});
                            return JSON.stringify(vOpts) === JSON.stringify(svJson);
                        });

                        // Decrement nested variant stock
                        if (matchedIndex > -1) {
                            product.variants[matchedIndex].stock -= item.quantity;
                            if (product.variants[matchedIndex].stock < 0) {
                                product.variants[matchedIndex].stock = 0;
                            }
                        }
                    }
                }

                await product.save();
            })
        );

        // Clear cart after order
        console.log("Clearing cart...");
        cart.items = [];
        await cart.save();

        console.log("Order placed successfully:", order._id);
        res.status(201).json(order);
    } catch (error) {
        console.error("Place Order Error:", error);
        res.status(500).json({ message: "Error placing order", error: error.message });
    }
};

/* ------------------ GET USER ORDERS ------------------ */
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};
/* ------------------ GET USER SHOPPING STATS ------------------ */
export const getUserShoppingStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ user: userId });

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const startOfWeek = new Date();
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        let totalSpent = 0;
        let yearlySpent = 0;
        let monthlySpent = 0;
        let weeklySpent = 0;
        let dailySpent = 0;

        orders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            const amount = order.totalPrice || 0;

            totalSpent += amount;
            if (orderDate >= startOfYear) yearlySpent += amount;
            if (orderDate >= startOfMonth) monthlySpent += amount;
            if (orderDate >= startOfWeek) weeklySpent += amount;
            if (orderDate >= startOfDay) dailySpent += amount;
        });

        res.json({
            totalSpent,
            yearlySpent,
            monthlySpent,
            weeklySpent,
            dailySpent
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching shopping stats", error: error.message });
    }
};
