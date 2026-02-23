import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FloatingSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/product?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl mx-auto z-40"
        >
            <form
                onSubmit={handleSearch}
                className="bg-white/10 backdrop-blur-xl border border-white/40 p-1.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-center gap-2 group focus-within:bg-white/20 focus-within:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-500"
            >
                <div className="pl-6 text-white opacity-80 flex-shrink-0 group-focus-within:opacity-100 transition-opacity">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for elegant furniture..."
                    className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/60 font-medium px-2 py-3"
                />
                <button
                    type="submit"
                    className="bg-white text-[var(--color-espresso)] px-8 py-3 rounded-full font-bold tracking-widest uppercase text-[10px] hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all shrink-0 shadow-md"
                >
                    Search
                </button>
            </form>
        </motion.div>
    );
};

export default FloatingSearch;
