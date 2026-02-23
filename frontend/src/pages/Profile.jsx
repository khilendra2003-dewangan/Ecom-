import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

const Profile = () => {
    const navigate = useNavigate();
    const { user, updateProfile } = useUser();
    const { shoppingStats } = useCart();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                city: user.city || "",
                pincode: user.pincode || "",
            });
            setPreviewUrl(user.profilePicture || "");
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("File selected:", file.name, file.type, file.size);
            setProfilePicture(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            submitData.append(key, formData[key]);
        });
        if (profilePicture) {
            submitData.append("profilePicture", profilePicture);
        }

        try {
            console.log("Submitting Profile Update...");
            const res = await updateProfile(submitData);
            console.log("Update Response received:", res);
            setMessage("Profile updated successfully!");
        } catch (error) {
            console.error("Update Request Failed:", error);
            setMessage("Error updating profile. Please try again.");
        }
        setLoading(false);
    };

    const StatCard = ({ label, value, delay }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay }}
            className="bg-white/60 backdrop-blur-2xl p-8 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden group"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-espresso)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] mb-3">{label}</p>
            <p className="text-4xl font-serif-lux text-[var(--color-espresso)]">₹{value?.toLocaleString() || 0}</p>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-[#F9F8F6] font-sans-lux pb-32 pt-12 relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply z-0" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/stardust.png')` }}></div>

            <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
                <div className="mb-16 text-center relative">
                    {/* Profile Picture Avatar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="mb-8 relative inline-block group"
                    >
                        <div className="w-40 h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white/50 backdrop-blur-md relative mx-auto">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Profile" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[var(--color-espresso)] opacity-20 bg-gray-100">
                                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                </div>
                            )}

                            {/* Overlay with Upload Icon */}
                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white cursor-pointer backdrop-blur-[2px]">
                                <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Update Portrait</span>
                                <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                            </label>
                        </div>

                        {/* Always visible small edit icon for clarity */}
                        <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[var(--color-espresso)] text-white flex items-center justify-center shadow-lg border-2 border-white pointer-events-none group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                        className="text-5xl md:text-6xl font-serif-lux text-[var(--color-espresso)] mb-4"
                    >
                        Your Sanctuary
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059]"
                    >
                        Personal Details & Analytics
                    </motion.p>
                </div>

                {/* Shopping Stats */}
                <div className="mb-20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard label="Today" value={shoppingStats?.dailySpent} delay={0.1} />
                        <StatCard label="This Month" value={shoppingStats?.monthlySpent} delay={0.2} />
                        <StatCard label="This Year" value={shoppingStats?.yearlySpent} delay={0.3} />
                        <StatCard label="Lifetime Investment" value={shoppingStats?.totalSpent} delay={0.4} />
                    </div>
                </div>

                {/* Profile Form */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
                    className="bg-white/60 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-white overflow-hidden max-w-4xl mx-auto"
                >
                    <div className="p-10 md:px-16 md:pt-14 md:pb-8 border-b border-gray-100/50 bg-white/40">
                        <h2 className="text-3xl font-serif-lux text-[var(--color-espresso)]">Account Preferences</h2>
                        <p className="mt-2 text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Manage your private information</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 md:p-16 space-y-8">
                        {message && (
                            <div className={`p-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-center ${message.includes("success") ? "bg-green-50/50 text-green-700 border border-green-100" : "bg-red-50/50 text-red-700 border border-red-100"}`}>
                                {message}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-white/50 border border-gray-200 rounded-2xl p-4 text-sm text-[var(--color-espresso)] font-medium outline-none focus:border-[var(--color-espresso)] focus:ring-1 focus:ring-[var(--color-espresso)] transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl p-4 text-sm text-gray-400 font-medium outline-none cursor-not-allowed"
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-2">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter 10-digit mobile number"
                                    className="w-full bg-white/50 border border-gray-200 rounded-2xl p-4 text-sm text-[var(--color-espresso)] font-medium outline-none focus:border-[var(--color-espresso)] focus:ring-1 focus:ring-[var(--color-espresso)] transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-2">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full bg-white/50 border border-gray-200 rounded-2xl p-4 text-sm text-[var(--color-espresso)] font-medium outline-none focus:border-[var(--color-espresso)] focus:ring-1 focus:ring-[var(--color-espresso)] transition-all"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-2">Address Line</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full bg-white/50 border border-gray-200 rounded-2xl p-4 text-sm text-[var(--color-espresso)] font-medium outline-none focus:border-[var(--color-espresso)] focus:ring-1 focus:ring-[var(--color-espresso)] transition-all resize-none"
                                    rows="3"
                                    placeholder="Apartment, Street, Area..."
                                ></textarea>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-2">Postal Code</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    className="w-full bg-white/50 border border-gray-200 rounded-2xl p-4 text-sm text-[var(--color-espresso)] font-medium outline-none focus:border-[var(--color-espresso)] focus:ring-1 focus:ring-[var(--color-espresso)] transition-all"
                                />
                            </div>
                        </div>

                        <div className="pt-10 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[var(--color-espresso)] hover:bg-[#2A2321] text-white px-12 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-[var(--color-espresso)]/20 transition-all transform hover:-translate-y-1 disabled:opacity-50"
                            >
                                {loading ? "Updating..." : "Save Preferences"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
