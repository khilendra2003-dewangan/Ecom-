import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Checkout = () => {
    const { cart, placeOrder } = useCart();
    const { user, updateProfile } = useUser();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
        paymentMethod: "COD",
    });

    const [loading, setLoading] = useState(false);
    const [isNewAddress, setIsNewAddress] = useState(false);

    useEffect(() => {
        if (cart.length === 0) navigate("/cart");
        if (user) {
            setFormData({
                ...formData,
                name: user.name || "",
                phone: user.phone || "",
                address: user.address || "",
                city: user.city || "",
                pincode: user.pincode || "",
            });
            // If user has no address, force "isNewAddress" to true for form fields
            if (!user.address) setIsNewAddress(true);
        }
    }, [user, cart]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateTotal = () => {
        return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // If user updated address fields, save them to profile simultaneously
            if (isNewAddress || (formData.address !== user.address)) {
                await updateProfile({
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    pincode: formData.pincode
                });
            }

            await placeOrder(formData);
        } catch (error) {
            console.error(error);
            alert("Something went wrong!");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#F9F8F6] pt-12 pb-32 font-sans-lux relative">
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply z-0" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/stardust.png')` }}></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                <div className="mb-16">
                    <h1 className="text-5xl md:text-6xl font-serif-lux text-[var(--color-espresso)] mb-4">Secure Checkout</h1>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059]">Complete your luxury acquisition</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    {/* Left: Forms */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-12">
                        {/* Shipping */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                            className="bg-white/60 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-white"
                        >
                            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                                <span className="w-8 h-8 rounded-full bg-[var(--color-espresso)] text-white flex items-center justify-center text-xs font-bold shadow-md">1</span>
                                <h2 className="text-2xl font-serif-lux text-[var(--color-espresso)]">Shipping Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Map through form fields */}
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-2">Full Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                        className="w-full bg-white/50 border border-gray-200 rounded-2xl p-4 text-sm text-[var(--color-espresso)] font-medium outline-none focus:border-[var(--color-espresso)] focus:ring-1 focus:ring-[var(--color-espresso)] transition-all" />
                                </div>
                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-2">Phone</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} required
                                        className="w-full bg-white/50 border border-gray-200 rounded-2xl p-4 text-sm text-[var(--color-espresso)] font-medium outline-none focus:border-[var(--color-espresso)] focus:ring-1 focus:ring-[var(--color-espresso)] transition-all" />
                                </div>
                                {/* Address */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-2">Street Address</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleChange} required
                                        className="w-full bg-white/50 border border-gray-200 rounded-2xl p-4 text-sm text-[var(--color-espresso)] font-medium outline-none focus:border-[var(--color-espresso)] focus:ring-1 focus:ring-[var(--color-espresso)] transition-all" />
                                </div>
                                {/* City */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-2">City</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleChange} required
                                        className="w-full bg-white/50 border border-gray-200 rounded-2xl p-4 text-sm text-[var(--color-espresso)] font-medium outline-none focus:border-[var(--color-espresso)] focus:ring-1 focus:ring-[var(--color-espresso)] transition-all" />
                                </div>
                                {/* Pincode */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-2">Postal Code</label>
                                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required
                                        className="w-full bg-white/50 border border-gray-200 rounded-2xl p-4 text-sm text-[var(--color-espresso)] font-medium outline-none focus:border-[var(--color-espresso)] focus:ring-1 focus:ring-[var(--color-espresso)] transition-all" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                            className="bg-white/60 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-white"
                        >
                            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                                <span className="w-8 h-8 rounded-full bg-[var(--color-espresso)] text-white flex items-center justify-center text-xs font-bold shadow-md">2</span>
                                <h2 className="text-2xl font-serif-lux text-[var(--color-espresso)]">Method Of Payment</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className={`cursor-pointer border border-transparent rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center transition-all duration-300 ${formData.paymentMethod === "COD" ? "bg-white shadow-lg shadow-[var(--color-espresso)]/5 ring-1 ring-[var(--color-espresso)]" : "bg-white/40 hover:bg-white/80"}`}>
                                    <input type="radio" name="paymentMethod" value="COD" checked={formData.paymentMethod === "COD"} onChange={handleChange} className="hidden" />
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.paymentMethod === "COD" ? "bg-[var(--color-espresso)] text-white" : "bg-gray-100 text-gray-400"}`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-xs uppercase tracking-widest text-[var(--color-espresso)]">Cash On Delivery</p>
                                        <p className="text-[10px] text-gray-400 mt-1">Pay comfortably upon arrival</p>
                                    </div>
                                </label>

                                <label className={`cursor-pointer border border-transparent rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center transition-all duration-300 ${formData.paymentMethod === "Online" ? "bg-white shadow-lg shadow-[var(--color-espresso)]/5 ring-1 ring-[var(--color-espresso)]" : "bg-white/40 hover:bg-white/80"}`}>
                                    <input type="radio" name="paymentMethod" value="Online" checked={formData.paymentMethod === "Online"} onChange={handleChange} className="hidden" />
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.paymentMethod === "Online" ? "bg-[var(--color-espresso)] text-white" : "bg-gray-100 text-gray-400"}`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-xs uppercase tracking-widest text-[var(--color-espresso)]">Online Payment</p>
                                        <p className="text-[10px] text-gray-400 mt-1">Secure via UPI / Cards</p>
                                    </div>
                                </label>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Summary Sidebar */}
                    <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-32 self-start">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white/60 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-white"
                        >
                            <h3 className="text-xl font-serif-lux text-[var(--color-espresso)] border-b border-gray-200/50 pb-6 mb-6">Order Summary</h3>

                            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={item.cartItemId || item._id} className="flex items-center gap-4">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-gray-50 border border-gray-100" />
                                        <div className="flex-grow">
                                            <p className="text-sm font-bold text-[var(--color-espresso)] truncate pr-2">{item.name}</p>
                                            {item.selectedVariant && Object.keys(item.selectedVariant).length > 0 && (
                                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                                    {Object.values(item.selectedVariant).join(', ')}
                                                </p>
                                            )}
                                            <p className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-serif-lux font-medium text-[var(--color-espresso)]">₹{item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200/50 pt-6 space-y-4 mb-8">
                                <div className="flex justify-between text-sm text-[var(--color-charcoal)]">
                                    <p>Subtotal</p>
                                    <p>₹{calculateTotal()}</p>
                                </div>
                                <div className="flex justify-between text-sm text-[var(--color-charcoal)]">
                                    <p>Shipping</p>
                                    <p className="text-[#C5A059] font-medium tracking-wide">Complimentary</p>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-200/50">
                                    <p className="text-sm font-bold uppercase tracking-widest text-[var(--color-espresso)]">Total</p>
                                    <p className="text-2xl font-serif-lux text-[var(--color-espresso)]">₹{calculateTotal()}</p>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="w-full bg-[var(--color-espresso)] hover:bg-[#2A2321] text-white py-5 rounded-full font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-[var(--color-espresso)]/20 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
                            >
                                {loading ? "Processing..." : "Confirm & Pay"}
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-[9px] uppercase font-bold text-gray-400 tracking-widest">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                End-to-End Encryption
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
