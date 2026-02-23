import React, { useEffect, useState } from "react";
import { useProduct } from "../context/ProductContext";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { FiX, FiArrowLeft, FiChevronRight } from "react-icons/fi";

const Product = () => {
  const { product: products, fetchProduct, category, fetchCategory, subCategory, fetchSubCategoriesById } = useProduct();

  const [search, setSearch] = useState("");
  const [maxprice, setMaxprice] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectedPath, setSelectedPath] = useState([]); // Path of category IDs
  const [selectedVariants, setSelectedVariants] = useState({}); // { Color: 'Red', Size: 'M' }

  useEffect(() => {
    fetchProduct();
    fetchCategory();
  }, []);

  const isDescendantOf = (childId, parentId) => {
    if (!childId || !parentId) return false;
    let current = category.find(c => String(c._id) === String(childId));
    while (current && current.parent) {
      if (String(current.parent._id || current.parent) === String(parentId)) return true;
      current = category.find(c => String(c._id) === String(current.parent._id || current.parent));
    }
    return false;
  };

  const activeLeafId = selectedPath[selectedPath.length - 1];
  const activeCategory = category.find(c => c._id === activeLeafId);

  let filterProduct = products.filter((product) => {
    const matchSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.brand && product.brand.toLowerCase().includes(search.toLowerCase()));

    const matchPrice = maxprice === "" || product.price <= Number(maxprice);

    const matchCategory = (() => {
      if (selectedPath.length === 0) return true;

      const prodCatId = product.category?._id || product.category;
      const prodSubCatId = product.subCategory?._id || product.subCategory;

      return (
        String(prodCatId) === String(activeLeafId) ||
        isDescendantOf(prodCatId, activeLeafId) ||
        String(prodSubCatId) === String(activeLeafId) ||
        isDescendantOf(prodSubCatId, activeLeafId)
      );
    })();

    // Variant Filtering
    const matchVariants = Object.entries(selectedVariants).every(([key, value]) => {
      if (!value) return true;
      // Check if any variant of the product matches this criteria
      return product.variants?.some(v => v.options?.[key] === value);
    });

    return matchSearch && matchPrice && matchCategory && matchVariants;
  });

  if (sortOption === "low") {
    filterProduct.sort((a, b) => a.price - b.price);
  } else if (sortOption === "high") {
    filterProduct.sort((a, b) => b.price - a.price);
  }

  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 500], [0, 150]);
  const headerOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="min-h-screen font-sans-lux bg-[#F9F8F6] selection:bg-[#C5A059] selection:text-white noise-bg overflow-hidden pt-24 pb-20">

      {/* Luxury Collection Header */}
      <motion.div
        style={{ y: headerY, opacity: headerOpacity }}
        className="text-center mb-16 px-6 relative z-10 max-w-4xl mx-auto"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block"
        >
          Curated For You
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif-lux text-5xl md:text-7xl text-[var(--color-espresso)] tracking-tight mb-6"
        >
          The Collection
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-500 font-medium text-sm md:text-base max-w-xl mx-auto leading-relaxed"
        >
          Discover our meticulously curated selection of timeless furniture. Elevate your living spaces with pieces designed for both beauty and comfort.
        </motion.p>
      </motion.div>

      {/* Hierarchical Category Navigator */}
      <div className="max-w-7xl mx-auto px-6 mb-12 relative z-20 space-y-4">
        <AnimatePresence mode="popLayout">
          {/* Level 0: Global / Roots */}
          <motion.div
            layout
            className="flex flex-wrap justify-center gap-3"
          >
            {selectedPath.length === 0 ? (
              <>
                <button
                  onClick={() => setSelectedPath([])}
                  className="px-8 py-2.5 rounded-full text-xs tracking-widest uppercase font-bold transition-all duration-300 shadow-sm border bg-[var(--color-espresso)] text-white border-[var(--color-espresso)] shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
                >
                  All Collections
                </button>
                {category?.filter(cat => !cat.parent).map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => setSelectedPath([cat._id])}
                    className="pl-2 pr-8 py-2 rounded-full text-xs tracking-widest uppercase font-bold transition-all duration-300 shadow-sm border bg-white/80 backdrop-blur-md text-gray-600 border-white hover:border-[var(--color-espresso)] hover:text-[var(--color-espresso)] flex items-center gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
                      <img
                        src={cat.image || "https://via.placeholder.com/100"}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    {cat.name}
                  </button>
                ))}
              </>
            ) : (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setSelectedPath([])}
                className="pl-4 pr-8 py-2.5 rounded-full text-xs tracking-widest uppercase font-bold transition-all duration-300 shadow-sm border bg-white text-gray-400 border-gray-100 flex items-center gap-3 hover:bg-gray-50 group"
              >
                <FiX className="group-hover:rotate-90 transition-transform text-gray-400" />
                <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
                  <img
                    src={category.find(c => c._id === selectedPath[0])?.image || "https://via.placeholder.com/100"}
                    alt="category"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span>{category.find(c => c._id === selectedPath[0])?.name}</span>
              </motion.button>
            )}
          </motion.div>

          {/* Iterative Lower Levels */}
          {selectedPath.map((nodeId, index) => {
            const children = category.filter(cat => String(cat.parent?._id || cat.parent) === nodeId);
            if (children.length === 0 && !selectedPath[index + 1]) return null;

            return (
              <motion.div
                key={`row-${nodeId}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-wrap justify-center gap-2"
              >
                {selectedPath[index + 1] ? (
                  <button
                    onClick={() => setSelectedPath(selectedPath.slice(0, index + 1))}
                    className="px-6 py-1.5 rounded-full text-[10px] tracking-widest uppercase font-bold transition-all duration-300 shadow-sm border bg-white text-gray-300 border-gray-50 flex items-center gap-2"
                  >
                    <FiArrowLeft size={10} />
                    <span>{category.find(c => c._id === selectedPath[index + 1])?.name}</span>
                  </button>
                ) : (
                  <>
                    <button
                      className="pl-2 pr-6 py-1.5 rounded-full text-[10px] tracking-widest uppercase font-bold transition-all duration-300 shadow-sm border bg-[#C5A059] text-white border-[#C5A059] flex items-center gap-2 group"
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
                        <img
                          src={category.find(c => c._id === nodeId)?.image || "https://via.placeholder.com/100"}
                          alt="category"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      All {category.find(c => c._id === nodeId)?.name}
                    </button>
                    {children.map((child) => (
                      <button
                        key={child._id}
                        onClick={() => setSelectedPath([...selectedPath, child._id])}
                        className="pl-2 pr-6 py-1.5 rounded-full text-[10px] tracking-widest uppercase font-bold transition-all duration-300 shadow-sm border bg-white text-gray-500 border-gray-100 hover:bg-gray-50 flex items-center gap-2 group"
                      >
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
                          <img
                            src={child.image || "https://via.placeholder.com/100"}
                            alt={child.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        {child.name}
                      </button>
                    ))}
                  </>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Glassmorphic Filters Bar */}
      <div className="flex flex-wrap gap-4 mb-12 justify-center max-w-5xl mx-auto relative z-20 px-6">
        <div className="bg-white/60 backdrop-blur-2xl border border-white p-2 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex flex-wrap gap-2 w-full md:w-auto items-center justify-center">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input
              type="text"
              placeholder="Search pieces..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-[var(--color-espresso)] placeholder:text-gray-400 font-medium pl-10 pr-4 py-2.5 w-full md:w-64 text-sm"
            />
          </div>

          <div className="w-[1px] h-8 bg-gray-200 hidden md:block"></div>

          <input
            type="number"
            placeholder="Max Price (₹)"
            value={maxprice}
            onChange={(e) => setMaxprice(e.target.value)}
            className="bg-transparent border-none outline-none text-[var(--color-espresso)] placeholder:text-gray-400 font-medium px-4 py-2.5 w-full md:w-40 text-sm"
          />

          <div className="w-[1px] h-8 bg-gray-200 hidden md:block"></div>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-transparent border-none outline-none text-[var(--color-espresso)] font-medium px-4 py-2.5 text-sm cursor-pointer"
          >
            <option value="">Sort By</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>

        {/* Dynamic Variant Filters */}
        {activeCategory?.variantSchema?.length > 0 && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/40 backdrop-blur-md border border-white/60 p-2 rounded-2xl flex flex-wrap gap-2 w-full md:w-auto items-center justify-center"
            >
              {activeCategory.variantSchema.map((field) => (
                <select
                  key={field.name}
                  value={selectedVariants[field.name] || ""}
                  onChange={(e) => setSelectedVariants({ ...selectedVariants, [field.name]: e.target.value })}
                  className="bg-transparent border-none outline-none text-[var(--color-espresso)] font-bold px-4 py-2 text-[10px] uppercase tracking-widest cursor-pointer hover:text-[#C5A059] transition-colors"
                >
                  <option value="">{field.name}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ))}
              {Object.values(selectedVariants).some(v => v) && (
                <button
                  onClick={() => setSelectedVariants({})}
                  className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  title="Clear Variant Filters"
                >
                  <FiX size={14} />
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Product Grid - Glass & Shadows */}
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-[90rem] mx-auto px-6 md:px-12 relative z-20">
        {filterProduct.map((item, index) => (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            key={item._id}
          >
            <Link
              to={`/product/${item._id}`}
              className="block group relative h-full"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
              }}
            >
              <motion.div
                layout
                className="flex flex-col cursor-pointer bg-white p-5 rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-transparent group-hover:border-[#C5A059]/30 transition-all duration-700 relative z-10 overflow-hidden h-full"
              >
                {/* Premium Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),_rgba(197,160,89,0.1)_0%,_transparent_70%)]" />

                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden rounded-[2rem] mb-6 bg-[#F9F8F6] flex items-center justify-center p-6 shadow-inner">
                  <motion.img
                    src={item.images?.[0] || "https://via.placeholder.com/300"}
                    alt={item.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm border border-black/5">
                    <p className="text-[8px] tracking-[2px] uppercase font-black text-[#C5A059]">
                      {item.category?.name}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col px-1 flex-grow">
                  <h3 className="font-serif-lux font-bold text-xl text-[var(--color-espresso)] group-hover:text-[#A88748] transition-colors duration-300 line-clamp-2 mb-6 tracking-tight">
                    {item.name}
                  </h3>

                  <div className="mt-auto pt-4 border-t border-black/[0.03] flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[var(--color-espresso)] font-black text-lg tracking-tight">
                        ₹{(item.discountPrice || item.price).toLocaleString()}
                      </span>
                      {item.discountPrice && (
                        <span className="text-[10px] text-gray-400 line-through font-bold">₹{item.price.toLocaleString()}</span>
                      )}
                    </div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#C5A059] group-hover:text-white transition-all duration-300 shadow-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}

        {filterProduct.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-400 font-medium">No pieces found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
