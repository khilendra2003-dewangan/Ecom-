import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useUser } from "./userContext";

const cartContext = createContext();

export const CartProvider = ({ children }) => {
  const products = [];
  const { user } = useUser();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState([]);
  const [shoppingStats, setShoppingStats] = useState(null);

  const fetchCart = async () => {
    if (!user) return;
    try {
      const { data } = await API.get("/cart");
      const formattedItems = data.items.map((item) => ({
        ...item.product,
        quantity: item.quantity,
        cartItemId: item._id, // Preserve the cart subdocument ID for variant-specific removal
        selectedVariant: item.selectedVariant, // Preserve the variant selection
      }));
      setCart(formattedItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const { data } = await API.get("/order/my");
      setOrder(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchShoppingStats = async () => {
    if (!user) return;
    try {
      const { data } = await API.get("/order/shopping-stats");
      setShoppingStats(data);
    } catch (error) {
      console.error("Error fetching shopping stats:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
      fetchOrders();
      fetchShoppingStats();
    } else {
      setCart([]);
      setOrder([]);
      setShoppingStats(null);
    }
  }, [user]);

  const placeOrder = async (orderData) => {
    if (cart.length === 0) return;
    try {
      await API.post("/order/place", orderData);
      await fetchOrders();
      await fetchShoppingStats();
      setCart([]);
      navigate("/order");
    } catch (error) {
      console.error("Error placing order:", error);
      throw error;
    }
  };

  const addToCart = async (product, quantity, selectedVariant = {}) => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await API.post("/cart/add", { productId: product._id, quantity, selectedVariant });
      await fetchCart();
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeitem = async (id) => {
    try {
      await API.delete(`/cart/${id}`);
      await fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <cartContext.Provider value={{ cart, addToCart, removeitem, placeOrder, order, products, fetchOrders, shoppingStats, fetchShoppingStats }}>
      {children}
    </cartContext.Provider>
  );
};

export const useCart = () => useContext(cartContext);
