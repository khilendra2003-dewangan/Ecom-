import { createContext, useContext, useState } from "react";
import API from "../api/api";

const SellerContext = createContext();

export const SellerProvider = ({ children }) => {
  const [myProducts, setMyProducts] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [sellerStats, setSellerStats] = useState(null);


  // Create Product
  const createProduct = async (form) => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("discountPrice", form.discountPrice);
    formData.append("stock", form.stock);
    formData.append("category", form.category);
    formData.append("subCategory", form.subCategory);
    formData.append("isActive", form.isActive);

    if (form.images) {
      for (let i = 0; i < form.images.length; i++) {
        formData.append("images", form.images[i]);
      }
    }

    if (form.variants && form.variants.length > 0) {
      // Need to stringify variants but handle images separately
      const variantsData = form.variants.map(({ imageFile, ...v }) => v);
      formData.append("variants", JSON.stringify(variantsData));

      form.variants.forEach((v, idx) => {
        if (v.imageFile) {
          formData.append(`variantImage_${idx}`, v.imageFile);
        }
      });
    }

    const { data } = await API.post("/create/product", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setMyProducts((prev) => [...prev, data]);
  };

  // Get My Products
  const getMyProducts = async () => {
    const { data } = await API.get("/seller/products");
    setMyProducts(data);
  };

  // Delete Product
  const deleteProduct = async (id) => {
    await API.delete(`/deleteproduct/${id}`);
    setMyProducts((prev) => prev.filter((p) => p._id !== id));
  };

  // Update Product
  const updateProduct = async (id, form) => {
    let payload;
    let headers = {};

    if ((form.images && form.images.length > 0) || (form.variants && form.variants.some(v => v.imageFile))) {
      payload = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "images") {
          for (let i = 0; i < form.images.length; i++) {
            payload.append("images", form.images[i]);
          }
        } else if (key === "variants") {
          const variantsData = form.variants.map(({ imageFile, ...v }) => v);
          payload.append("variants", JSON.stringify(variantsData));
          form.variants.forEach((v, idx) => {
            if (v.imageFile) {
              payload.append(`variantImage_${idx}`, v.imageFile);
            }
          });
        } else {
          payload.append(key, form[key]);
        }
      });
      headers = { "Content-Type": "multipart/form-data" };
    } else {
      payload = form;
    }

    const { data } = await API.put(`/updateproduct/${id}`, payload, { headers });
    setMyProducts((prev) => prev.map((p) => (p._id === id ? data : p)));
    return data;
  };

  // Get Seller Orders
  const getSellerOrders = async () => {
    const { data } = await API.get("/orders");
    setSellerOrders(data);
  };

  // Update Order Item Status
  const updateOrderItemStatus = async (orderId, itemId, status) => {
    await API.post("/order/update-status", { orderId, itemId, status });
    setSellerOrders((prev) =>
      prev.map(order =>
        order._id === orderId
          ? { ...order, items: order.items.map(item => item._id === itemId ? { ...item, status } : item) }
          : order
      )
    );
    getSellerStats(); // Refresh profit stats instantly
  };

  // Get Seller Stats
  const getSellerStats = async () => {
    const { data } = await API.get("/stats");
    setSellerStats(data);
  };





  return (
    <SellerContext.Provider
      value={{
        myProducts,
        createProduct,
        getMyProducts,
        deleteProduct,
        updateProduct,
        sellerOrders,
        getSellerOrders,
        updateOrderItemStatus,
        sellerStats,
        getSellerStats,

      }}
    >
      {children}
    </SellerContext.Provider>
  );
};

export const useSeller = () => useContext(SellerContext);
