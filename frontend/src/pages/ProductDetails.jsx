import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useParams } from "react-router-dom";
import API from "../api/api";
import { motion } from "framer-motion";

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedVariantObj, setSelectedVariantObj] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        // Get Main Product
        const { data: mainProduct } = await API.get(`/getproduct/${id}`);
        setProduct(mainProduct);
        if (mainProduct.variants && mainProduct.variants.length > 0) {
          setSelectedVariantObj(mainProduct.variants[0]);
        } else {
          setSelectedVariantObj(null);
        }

        // Get Related Products (Same subcategory for hyper-relevance)
        if (mainProduct.subCategory?._id) {
          const { data: related } = await API.get(`/subcategory/${mainProduct.subCategory._id}`);
          // Filter out the current product
          setRelatedProducts(related.filter((p) => p._id !== id));
        } else if (mainProduct.category?._id) {
          // Fallback to category if no subcategory exists
          const { data: related } = await API.get(`/category/${mainProduct.category._id}`);
          setRelatedProducts(related.filter((p) => p._id !== id));
        }

        setLoading(false);
        window.scrollTo(0, 0); // Scroll to top when product changes
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F9F8F6]">
        <div className="w-12 h-12 border-4 border-[var(--color-espresso)] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-[var(--color-charcoal)] uppercase tracking-[0.3em] animate-pulse">Curating Selection...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F8F6]">
        <p className="text-xl font-serif-lux text-[var(--color-espresso)] tracking-widest">Masterpiece Not Found</p>
      </div>
    );
  }

  const currentStock = selectedVariantObj ? selectedVariantObj.stock : (product?.stock || 0);
  const currentImage = selectedVariantObj?.image || product?.images?.[0] || "https://via.placeholder.com/600";

  const increaseQty = () => {
    if (quantity < currentStock) {
      setQuantity((prev) => prev + 1);
    }
  };
  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] font-sans-lux pb-32">
      {/* Subtle Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply z-0" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/stardust.png')` }}></div>

      {/* Navigation */}
      <div className="relative z-10 px-8 py-8 lg:px-16 flex items-center">
        <Link to="/product" className="group flex items-center gap-3 text-sm font-bold text-gray-500 hover:text-[var(--color-espresso)] uppercase tracking-widest transition-all">
          <span className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-[var(--color-espresso)] group-hover:text-white group-hover:border-[var(--color-espresso)] transition-all">←</span>
          Back to Collection
        </Link>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 lg:px-16 relative z-10">
        <div className="flex flex-col xl:flex-row gap-16 lg:gap-24 relative items-start">

          {/* Left: Sticky Image Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full xl:w-1/2 xl:sticky xl:top-32"
          >
            <div className="relative group rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.08)] bg-white">
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 z-10"></div>
              <img
                src={currentImage}
                alt={product.name}
                className="w-full aspect-[4/5] object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
              <div className="absolute top-6 left-6 z-20">
                <span className="bg-white/80 backdrop-blur-md text-[var(--color-espresso)] text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-sm border border-white/50">
                  {product.category?.name}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right: Scrollable Details */}
          <div className="w-full xl:w-1/2 flex flex-col pt-4 xl:pt-10 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif-lux text-[var(--color-espresso)] leading-[1.1] mb-6 capitalize">{product.name}</h1>

              <div className="flex items-center gap-4 mb-10">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${product.isActive && currentStock > 0 ? "bg-green-50/50 border-green-200 text-green-700" : "bg-red-50/50 border-red-200 text-red-700"}`}>
                  {product.isActive && currentStock > 0 ? "In Stock" : "Out of Stock"}
                </span>
                <span className="text-gray-300">|</span>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-widest text-[#C5A059]">
                  Atelier: <span className="underline cursor-pointer">{product.seller?.name || "Global Studio"}</span>
                </p>
              </div>

              <div className="prose prose-lg text-[var(--color-charcoal)] leading-relaxed font-light mb-12">
                <p>{product.description || "An exquisite piece crafted with precision, designed to elevate your living space with timeless elegance."}</p>
              </div>

              {/* Variant Selection */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-12">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Select Specification</p>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((v, idx) => {
                      const optionsObj = v.options || {};
                      const valArr = Object.values(optionsObj);
                      const variantLabel = valArr.length > 0 ? valArr.join(" - ") : `Variant ${idx + 1}`;
                      const isSelected = selectedVariantObj === v;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedVariantObj(v)}
                          className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${isSelected
                              ? "border-[var(--color-espresso)] bg-[var(--color-espresso)] text-white shadow-lg shadow-black/10"
                              : "border-gray-300 bg-transparent text-[var(--color-espresso)] hover:border-[var(--color-espresso)]"
                            }`}
                        >
                          {variantLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity and Price Container in a Glass Card */}
              <div className="bg-white/40 backdrop-blur-2xl border border-white p-8 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.03)] flex flex-col gap-8 mb-12">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Quantity</p>
                    <div className="flex items-center bg-white border border-gray-100 rounded-full p-1.5 shadow-sm inline-flex">
                      <button onClick={decreaseQty} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[var(--color-espresso)] transition-colors">−</button>
                      <span className="w-12 text-center text-sm font-bold text-[var(--color-espresso)]">{quantity}</span>
                      <button onClick={increaseQty} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[var(--color-espresso)] transition-colors">+</button>
                    </div>
                    <p className="text-[10px] font-medium text-gray-400 mt-3">{currentStock} pieces available</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Investment</p>
                    <div className="flex items-baseline justify-end gap-3">
                      <p className="text-4xl font-serif-lux text-[var(--color-espresso)] tracking-tight">
                        ₹{(product.discountPrice || product.price).toLocaleString()}
                      </p>
                      {product.discountPrice && (
                        <p className="text-lg text-gray-400 line-through font-light">
                          ₹{product.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(product, quantity, selectedVariantObj ? selectedVariantObj.options : {})}
                  disabled={!product.isActive || currentStock === 0}
                  className={`w-full py-5 rounded-full text-xs font-bold uppercase tracking-[0.3em] transition-all duration-500 overflow-hidden relative group ${product.isActive && currentStock > 0
                      ? "bg-[var(--color-espresso)] text-white hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1"
                      : "bg-gray-300 text-white cursor-not-allowed"
                    }`}
                >
                  <span className="relative z-10">{product.isActive && currentStock > 0 ? "Add to Cart" : "Out of Stock"}</span>
                  {product.isActive && currentStock > 0 && <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-0"></span>}
                </button>
              </div>

              <div className="border-t border-gray-200/50 pt-8 mt-12">
                <div className="grid grid-cols-2 gap-6">
                  {["Complimentary Shipping", "Secure Checkout", "24/7 Concierge", "Easy Returns"].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{feat}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 border-t border-gray-200/50 pt-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif-lux text-[var(--color-espresso)] mb-4">You May Also Like</h2>
              <p className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-bold">Curated pieces from {product.subCategory?.name || product.category?.name || "our collection"}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.slice(0, 4).map((item, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                  key={item._id}
                >
                  <Link to={`/product/${item._id}`} className="group block h-full bg-white/40 backdrop-blur-xl border border-white rounded-[2.5rem] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500">
                    <div className="relative mb-6 overflow-hidden rounded-[2rem] bg-gray-50 aspect-[4/5]">
                      <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
                    </div>
                    <div className="px-2 text-center pb-2">
                      <h3 className="text-xs font-bold text-[var(--color-espresso)] uppercase tracking-widest truncate mb-2">{item.name}</h3>
                      <p className="text-[12px] text-[#C5A059] font-medium tracking-wider font-serif-lux">₹{item.price.toLocaleString()}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
