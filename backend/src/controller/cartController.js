import Cart from "../models/cartModel.js";

/* ------------------ ADD TO CART ------------------ */
export const addToCart = async (req, res) => {
    const { productId, quantity = 1, selectedVariant = {} } = req.body;
    const userId = req.user._id;

    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: [{ product: productId, quantity, selectedVariant }],
            });
        } else {
            const itemIndex = cart.items.findIndex(
                (item) => {
                    const isSameProduct = item.product.toString() === productId;
                    const isSameVariant = JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant);
                    return isSameProduct && isSameVariant;
                }
            );

            if (itemIndex > -1) {
                // Item exists, update quantity
                cart.items[itemIndex].quantity += Number(quantity);
            } else {
                // New item
                cart.items.push({ product: productId, quantity, selectedVariant });
            }
            await cart.save();
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error adding to cart", error: error.message });
    }
};

/* ------------------ GET CART ------------------ */
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate(
            "items.product"
        );
        if (!cart) return res.json({ items: [] });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart", error: error.message });
    }
};

/* ------------------ REMOVE FROM CART ------------------ */
export const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(
            (item) => item._id.toString() !== req.params.cartItemId
        );
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error removing item", error: error.message });
    }
};

/* ------------------ CLEAR CART ------------------ */
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ message: "Error clearing cart", error: error.message });
    }
};
