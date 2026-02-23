import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Cart = () => {
  const { cart, removeitem, placeOrder } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce((total, item) => total + (item.discountPrice || item.price) * item.quantity, 0);

  return (
    <div className="min-h-screen font-sans-lux bg-[#F9F8F6] selection:bg-[#C5A059] selection:text-white noise-bg pt-28 pb-20 px-6">
      <div className="max-w-[90rem] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] font-bold mb-3 block">Your Sanctuary</span>
          <h1 className="text-4xl md:text-5xl font-serif-lux text-[var(--color-espresso)] tracking-tight">Shopping Bag</h1>
        </motion.div>

        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/60 backdrop-blur-2xl p-16 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-white text-center max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[50vh]"
          >
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 border border-gray-100">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </div>
            <h2 className="text-3xl font-serif-lux text-[var(--color-espresso)] mb-4">Your bag is empty</h2>
            <p className="text-gray-500 mb-10 max-w-md text-sm leading-relaxed">Discover our carefully curated collection of luxury furniture and elevate your living spaces today.</p>
            <button
              onClick={() => navigate("/product")}
              className="group relative inline-flex items-center justify-center px-10 py-4 bg-[var(--color-espresso)] text-white text-xs uppercase tracking-widest font-bold overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl rounded-full"
            >
              Start Exploring
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Cart Items List */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {cart.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  key={item.cartItemId || item._id}
                  className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col sm:flex-row gap-8 items-center sm:items-start group"
                >
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden border border-black/[0.03]">
                    <img
                      src={item.selectedVariant?.image || item.images?.[0] || "https://via.placeholder.com/200"}
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                    />
                  </div>

                  <div className="flex-grow flex flex-col h-full w-full justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h2 className="font-serif-lux font-bold text-xl text-[var(--color-espresso)] leading-tight">{item.name}</h2>
                        <p className="text-xl font-medium text-[var(--color-espresso)] ml-4">₹{(item.discountPrice || item.price) * item.quantity}</p>
                      </div>

                      <p className="text-[10px] tracking-widest uppercase font-bold text-gray-400 mb-4">{item.category?.name || "Product"}</p>

                      {/* Variant Details */}
                      {item.selectedVariant && Object.keys(item.selectedVariant).length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {Object.entries(item.selectedVariant).map(([k, v]) => (
                            <span key={k} className="text-[10px] font-bold text-gray-500 bg-gray-100/80 px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                              {k}: {v}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <span className="text-[10px] font-bold text-gray-500 px-3 py-1.5 rounded-full border border-gray-200 uppercase tracking-widest bg-white">
                        Qty: {item.quantity}
                      </span>
                      <button
                        onClick={() => removeitem(item.cartItemId || item._id)}
                        className="text-gray-400 hover:text-red-500 text-sm font-medium transition-colors duration-300 flex items-center gap-1.5"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        <span className="text-[10px] uppercase tracking-widest font-bold">Remove</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sticky Order Summary */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white/60 backdrop-blur-2xl p-8 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.06)] border border-white sticky top-28"
              >
                <h2 className="text-2xl font-serif-lux text-[var(--color-espresso)] mb-8 tracking-tight border-b border-black/[0.04] pb-6">Summary</h2>

                <div className="space-y-5 mb-8">
                  <div className="flex justify-between text-gray-600 text-sm font-medium">
                    <span>Subtotal</span>
                    <span className="text-[var(--color-espresso)]">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm font-medium">
                    <span>Shipping</span>
                    <span className="text-[#C5A059]">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm font-medium">
                    <span>Taxes</span>
                    <span className="text-[var(--color-espresso)]">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-black/[0.04] pt-6 mt-6 flex justify-between items-end">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total</span>
                    <span className="text-3xl font-serif-lux text-[var(--color-espresso)] leading-none">₹{totalPrice}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-[var(--color-espresso)] text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl transition-all duration-300 hover:bg-black hover:shadow-2xl hover:-translate-y-1 block text-center"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-8 pt-6 border-t border-black/[0.04] flex items-center justify-center gap-3">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                    Secure Checkout
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
