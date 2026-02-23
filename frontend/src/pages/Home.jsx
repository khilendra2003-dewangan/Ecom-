import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiShoppingCart } from 'react-icons/fi';


// Luxury Image Assets
const heroBg = "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=2850&q=80";
const categoryLiving = "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80";
const categoryDining = "https://images.unsplash.com/photo-1617806118233-18e1c0945594?auto=format&fit=crop&w=1000&q=80";
const categoryBedroom = "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1000&q=80";

const Home = () => {
  const { product: products, fetchProduct, category, fetchCategory } = useProduct();
  const { scrollYProgress } = useScroll();

  // Parallax effects
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    fetchProduct();
    fetchCategory();
  }, []);

  const featured = products?.filter(p => p.isActive).slice(0, 4) || [];

  // Dynamic Best Sellers Logic
  // Filter active/approved products with sales, sort by salesCount (descending), take top 10
  const bestSellers = [...(products || [])]
    .filter(p => p.isActive && p.salesCount > 0 && p.stock > 0)
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 10);

  const defaultCats = [
    { _id: "fallback-1", name: "Living Room", image: categoryLiving },
    { _id: "fallback-2", name: "Dining Room", image: categoryDining },
    { _id: "fallback-3", name: "Bedroom", image: categoryBedroom }
  ];

  const displayCategories = category?.filter(cat => !cat.parent).slice(0, 3) || [];
  const renderCategories = [...displayCategories];
  while (renderCategories.length < 3) {
    renderCategories.push(defaultCats[renderCategories.length]);
  }

  return (
    <div className="min-h-screen font-sans-lux bg-[#F9F8F6] selection:bg-[#C5A059] selection:text-white noise-bg overflow-hidden">

      {/* Hero Section - Clean, Airy, Full Bleed */}
      <section className="relative h-screen flex flex-col items-center justify-center bg-[#F2EBE3] overflow-hidden">
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-x-0 -top-[20%] w-full h-[140%]"
        >
          <div
            className="absolute inset-0 w-full h-full bg-black/30 z-10"
          />
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url('${heroBg}')`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat'
            }}
          />
        </motion.div>

        {/* Elegant Glass Card over Hero */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 text-center px-8 py-12 md:px-16 md:py-14 max-w-2xl mx-auto flex flex-col items-center bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 shadow-[0_30px_80px_rgba(0,0,0,0.2)] mt-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <p className="text-white uppercase tracking-[0.2em] text-[10px] font-bold">
              Minimalist Collection
            </p>
          </div>

          <h1 className="font-serif-lux text-5xl md:text-7xl text-white leading-[1.05] mb-6 tracking-tight drop-shadow-md">
            Curated<br />
            <span className="italic font-light text-[#E5C07B]">Spaces</span>
          </h1>

          <p className="text-white/90 font-medium text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed drop-shadow-sm">
            Thoughtfully designed pieces. Clean lines, exceptional comfort, and understated elegance.
          </p>

          <Link
            to="/product"
            className="group relative inline-flex items-center justify-center px-10 py-4 bg-white text-[var(--color-espresso)] text-xs uppercase tracking-widest font-bold overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl rounded-full"
          >
            Start Exploring
          </Link>
        </motion.div>


      </section>

      {/* Kinetic Marquee (Warm Tone) */}
      <div className="w-full bg-[#EAE2D6] py-5 overflow-hidden border-y border-black/5 relative z-20">
        <div className="kinetic-text-container">
          <div className="kinetic-text font-serif-lux text-xl md:text-2xl text-[var(--color-espresso)] opacity-80 tracking-wide">
            • THOUGHTFUL DESIGN • EXCEPTIONAL QUALITY • EFFORTLESS STYLE • MODERN LIVING •
          </div>
          <div className="kinetic-text font-serif-lux text-xl md:text-2xl text-[var(--color-espresso)] opacity-80 tracking-wide">
            • THOUGHTFUL DESIGN • EXCEPTIONAL QUALITY • EFFORTLESS STYLE • MODERN LIVING •
          </div>
        </div>
      </div>

      {/* 3D Categories Section - Unique Masonry Layout */}
      <section className="py-32 px-6 md:px-12 max-w-[90rem] mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] font-bold mb-3 block">The Collections</span>
          <h2 className="font-serif-lux text-4xl md:text-5xl text-[var(--color-espresso)]">Explore Our Collections</h2>
        </div>

        {/* Circular Category Marquee */}
        <div className="mb-16 relative overflow-hidden py-6">
          <div className="flex gap-8 animate-marquee-slower whitespace-nowrap group">
            {[...(category?.filter(cat => !cat.parent) || []), ...(category?.filter(cat => !cat.parent) || [])].map((item, idx) => (
              <Link
                key={`${item._id}-${idx}`}
                to="/product"
                className="flex flex-col items-center gap-3 transition-transform duration-500 hover:scale-110 shrink-0"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white shadow-lg hover:shadow-xl transition-all duration-500">
                  <img
                    src={item.image || categoryLiving}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-serif-lux text-sm md:text-base text-[var(--color-espresso)] font-bold tracking-wide uppercase">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Category */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="md:col-span-7 relative rounded-[1.5rem] overflow-hidden group shadow-[0_15px_40px_rgba(0,0,0,0.06)] cursor-pointer h-[320px] md:h-auto aspect-[16/9]"
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-700 z-10" />
            <motion.img
              src={renderCategories[0].image || categoryLiving}
              alt={renderCategories[0].name || "Category"}
              className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
            />
            <div className="absolute bottom-8 left-8 z-20 transition-transform duration-500 group-hover:-translate-y-2">
              <h3 className="text-white font-serif-lux text-3xl mb-1 drop-shadow-md">{renderCategories[0].name || "Category"}</h3>
              <p className="text-white/90 text-sm tracking-wide flex items-center gap-2 text-[#E5C07B] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100">
                Explore Collection <span>→</span>
              </p>
            </div>
          </motion.div>

          {/* Secondary Categories Wrapper */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Secondary Category 1 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 relative rounded-[1.5rem] overflow-hidden group shadow-[0_15px_40px_rgba(0,0,0,0.06)] cursor-pointer min-h-[150px] aspect-[16/7]"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-700 z-10" />
              <motion.img
                src={renderCategories[1].image || categoryDining}
                alt={renderCategories[1].name || "Category"}
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
              />
              <div className="absolute bottom-6 left-6 z-20 transition-transform duration-500 group-hover:-translate-y-2">
                <h3 className="text-white font-serif-lux text-2xl mb-1 drop-shadow-md">{renderCategories[1].name || "Category"}</h3>
                <p className="text-[#E5C07B] text-xs tracking-wide opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100 flex items-center gap-2">Explore <span>→</span></p>
              </div>
            </motion.div>

            {/* Secondary Category 2 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex-1 relative rounded-[1.5rem] overflow-hidden group shadow-[0_15px_40px_rgba(0,0,0,0.06)] cursor-pointer min-h-[150px] aspect-[16/7]"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-700 z-10" />
              <motion.img
                src={renderCategories[2].image || categoryBedroom}
                alt={renderCategories[2].name || "Category"}
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
              />
              <div className="absolute bottom-6 left-6 z-20 transition-transform duration-500 group-hover:-translate-y-2">
                <h3 className="text-white font-serif-lux text-2xl mb-1 drop-shadow-md">{renderCategories[2].name || "Category"}</h3>
                <p className="text-[#E5C07B] text-xs tracking-wide opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100 flex items-center gap-2">Explore <span>→</span></p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Soft & Elevated New Arrivals Section */}
      <section className="py-24 px-6 md:px-12 max-w-[90rem] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <span className="text-[#C5A059] uppercase tracking-[0.2em] text-xs font-semibold mb-3 block">Curated Selection</span>
            <h2 className="font-serif-lux text-5xl md:text-6xl text-[var(--color-espresso)]">New Arrivals</h2>
          </div>
          <Link to="/product" className="text-[var(--color-espresso)] text-sm font-semibold hover:text-[#C5A059] hover:underline underline-offset-4 transition-all flex items-center gap-2">
            View the Gallery
            <span className="text-lg leading-none">→</span>
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  to={`/product/${item._id}`}
                  className="block group relative"
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
                    className="flex flex-col cursor-pointer bg-white p-5 rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-transparent group-hover:border-[#C5A059]/30 transition-all duration-700 relative z-10 overflow-hidden"
                  >
                    {/* Premium Hover Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),_rgba(197,160,89,0.1)_0%,_transparent_70%)]" />

                    {/* Image Container with Inner Shadow */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] mb-6 bg-[#F9F8F6] shadow-inner">
                      <motion.img
                        src={item.images?.[0] || "https://via.placeholder.com/400x500"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      />

                      {/* Floating Add icon - Micro Interaction */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-[#C5A059] w-12 h-12 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-xl border border-white"
                      >
                        <FiShoppingCart size={22} strokeWidth={2.5} />
                      </motion.div>
                    </div>

                    <div className="flex flex-col px-1">
                      <p className="text-[#C5A059] text-[9px] tracking-[3px] uppercase font-black mb-2 opacity-80">{item.category?.name || "Premium Design"}</p>
                      <h3 className="font-serif-lux font-bold text-xl text-[var(--color-espresso)] group-hover:text-[#A88748] transition-colors duration-300 line-clamp-1 mb-6">{item.name}</h3>

                      <div className="flex justify-between items-center mt-auto pt-4 border-t border-black/[0.03]">
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
                          className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#C5A059] group-hover:text-white transition-all duration-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-[var(--color-charcoal)]">
            <div className="bg-white rounded-3xl max-w-2xl mx-auto p-16 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-black/[0.02]">
              <div className="text-[#C5A059] text-4xl mb-6">✧</div>
              <p className="font-serif-lux text-3xl mb-4 text-[var(--color-espresso)]">Our collection is refreshing.</p>
              <p className="text-base">Please check back shortly for our latest curated selection.</p>
            </div>
          </div>
        )}
      </section>

      {/* Why Choose Us - Soft Sage Background */}
      <section className="bg-[#EAECE6] py-32 px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D8DED3]/50 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-[75rem] mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-serif-lux text-5xl md:text-6xl text-[var(--color-espresso)] mb-6">Art of Intentional Living</h2>
            <p className="text-[var(--color-charcoal)] font-medium max-w-2xl mx-auto text-lg leading-relaxed">
              We believe that furniture should be more than just functional. It should transform your space into a sanctuary of elegance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Sustainable Materials",
                desc: "Ethically sourced woods and fabrics that age beautifully and respect our environment.",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
              },
              {
                title: "Artisan Crafted",
                desc: "Each piece is meticulously constructed by master craftsmen with decades of combined experience.",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83m13.79-4l-5.74 9.94" /></svg>
              },
              {
                title: "White-Glove Delivery",
                desc: "Premium end-to-end service. We deliver, assemble, and place your furniture exactly where you want it.",
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="bg-white/60 backdrop-blur-xl p-10 rounded-[2rem] shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-shadow duration-500 border border-white"
              >
                <div className="w-14 h-14 rounded-full bg-[#EAECE6] text-[#C5A059] flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="font-serif-lux text-2xl text-[var(--color-espresso)] mb-4">{feature.title}</h3>
                <p className="text-[var(--color-charcoal)] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers - Horizontal Parallax Grid */}
      {bestSellers.length > 0 && (
        <section className="py-32 bg-[#E8ECE6] relative overflow-hidden">
          <div className="max-w-[90rem] mx-auto px-6 md:px-12 mb-16 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <span className="text-[#C5A059] uppercase tracking-[0.2em] text-xs font-semibold mb-3 block">Most Loved</span>
                <h2 className="font-serif-lux text-5xl md:text-6xl text-[var(--color-espresso)]">Best Sellers</h2>
              </div>
              <Link to="/product" className="text-[var(--color-espresso)] text-sm font-semibold hover:text-[#C5A059] hover:underline underline-offset-4 transition-all flex items-center gap-2">
                Shop All <span className="text-lg leading-none">→</span>
              </Link>
            </div>
          </div>

          <div className="w-full overflow-x-auto pb-16 pt-4 hide-scrollbar snap-x relative z-10">
            <div className="flex gap-8 px-6 md:px-12 w-max">
              {/* Dynamic Best Sellers based on salesCount */}
              {bestSellers.map((item, index) => (
                <motion.div
                  key={`${item._id}-${index}`}
                  whileHover={{ y: -10 }}
                  className="w-[320px] shrink-0 snap-center"
                >
                  <Link to={`/product/${item._id}`} className="block group">
                    <div className="bg-white p-5 rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-transparent group-hover:border-[#C5A059]/30 transition-all duration-700 relative overflow-hidden">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] mb-6 bg-[#F9F8F6]">
                        <motion.img
                          src={item.images?.[0] || "https://via.placeholder.com/400x500"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 1.2 }}
                        />
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[var(--color-espresso)] text-[9px] font-black uppercase tracking-[2px] px-4 py-1.5 rounded-xl shadow-lg border border-white/50">
                          Best Seller
                        </div>
                      </div>
                      <div className="px-1 text-center">
                        <h3 className="font-serif-lux font-bold text-xl text-[var(--color-espresso)] mb-2 truncate group-hover:text-[#A88748] transition-colors font-serif-lux">{item.name}</h3>
                        <p className="text-[var(--color-espresso)] font-black text-lg tracking-tight">₹{(item.discountPrice || item.price).toLocaleString()}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Future Product / Waitlist Section */}
      <section className="py-24 px-6 md:px-12 max-w-[90rem] mx-auto">
        <div className="bg-[#1A1816] rounded-[3rem] overflow-hidden flex flex-col md:flex-row relative shadow-[0_30px_60px_rgba(0,0,0,0.15)]">

          <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center relative z-10">
            <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] font-bold mb-6 block">Coming Soon • Fall 2026</span>
            <h2 className="font-serif-lux text-5xl md:text-6xl text-white mb-6 leading-[1.1]">The Cloud<br />Sofa Collection</h2>
            <p className="text-white/70 text-lg mb-10 max-w-md leading-relaxed">
              Uncompromising comfort meets architectural precision. Experience zero-gravity relaxation wrapped in sustainable Italian boucle.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 mb-4">
              <input
                type="email"
                placeholder="Enter email for early access"
                className="bg-white/10 border border-white/20 text-white px-6 py-4 rounded-xl focus:outline-none focus:border-[#C5A059] font-medium placeholder:text-white/40 w-full sm:w-auto flex-grow transition-all"
              />
              <button className="px-8 py-4 bg-[#C5A059] text-white font-bold tracking-widest uppercase text-xs rounded-xl hover:bg-white hover:text-[#C5A059] transition-all duration-300 shrink-0">
                Join Waitlist
              </button>
            </form>
            <p className="text-white/40 text-[10px] uppercase tracking-wider">Limited to 100 pieces worldwide.</p>
          </div>

          <div className="md:w-1/2 relative min-h-[400px] md:min-h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1816] to-transparent z-10 hidden md:block"></div>
            <img
              src="https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&w=1000&q=80"
              alt="Cloud Sofa preview"
              className="absolute inset-0 w-full h-full object-cover object-left"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 md:px-12 bg-[#F9F8F6]">
        <div className="max-w-[90rem] mx-auto">
          <div className="text-center mb-20">
            <span className="text-[#C5A059] uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Client Stories</span>
            <h2 className="font-serif-lux text-5xl md:text-6xl text-[var(--color-espresso)]">Words of Praise</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "The atelier dining table completely transformed our space. The craftsmanship is flawless and the delivery was seamless.",
                author: "Elena R.",
                role: "Interior Designer",
                rating: 5
              },
              {
                text: "I've never experienced furniture this comfortable. The attention to detail in the stitching of the lounge chair is incredible.",
                author: "Marcus T.",
                role: "Architect",
                rating: 5
              },
              {
                text: "Exceptional quality that rivals the most expensive Italian brands but with a much more thoughtful, sustainable approach.",
                author: "Sarah L.",
                role: "Art Director",
                rating: 5
              }
            ].map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="bg-white p-12 rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-black/[0.02] relative"
              >
                {/* Large quote mark behind text */}
                <div className="absolute top-8 left-8 text-[#F2EBE3] font-serif-lux text-8xl leading-none font-bold select-none pointer-events-none">"</div>

                <div className="relative z-10">
                  <div className="flex gap-1 mb-6 text-[#C5A059]">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    ))}
                  </div>
                  <p className="text-[var(--color-charcoal)] text-lg leading-relaxed mb-8 italic">"{review.text}"</p>
                  <div>
                    <h4 className="font-bold text-[var(--color-espresso)] font-serif-lux text-xl">{review.author}</h4>
                    <span className="text-sm text-[var(--color-charcoal)]/60">{review.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#F5EBEB] relative py-32 overflow-hidden border-y border-black/5">
        <div className="max-w-[90rem] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
          <div className="md:w-1/2">
            <span className="text-[#C5A059] uppercase tracking-[0.2em] text-xs font-bold mb-4 block">Exclusive Access</span>
            <h2 className="font-serif-lux text-5xl md:text-7xl text-[var(--color-espresso)] mb-6 leading-[1.1]">
              Join the<br />Atelier Insider
            </h2>
            <p className="text-[var(--color-charcoal)] text-lg mb-10 max-w-md">
              A weekly curation of design inspiration, early access to new arrivals, and the art of intentional living.
            </p>
          </div>

          <div className="md:w-1/2 w-full max-w-lg">
            <div className="bg-white/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.06)] border border-white">
              <form className="flex flex-col gap-5">
                <input
                  type="text"
                  placeholder="First Name"
                  className="bg-[#F9F8F6] border-none text-[var(--color-espresso)] px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 font-medium placeholder:text-[var(--color-charcoal)]/40 w-full transition-all"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="bg-[#F9F8F6] border-none text-[var(--color-espresso)] px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A059]/30 font-medium placeholder:text-[var(--color-charcoal)]/40 w-full transition-all"
                />
                <button className="px-8 py-4 mt-2 bg-[#C5A059] text-white font-bold tracking-widest uppercase text-xs rounded-xl hover:bg-[#A88748] hover:shadow-[0_10px_20px_rgba(197,160,89,0.3)] hover:-translate-y-1 transition-all duration-300 w-full">
                  Subscribe Now
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Decorative oversized background text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif-lux text-[15rem] leading-none text-[#EEDADA]/40 whitespace-nowrap z-0 pointer-events-none select-none">
          KD Luxe
        </div>
      </section>

      {/* Premium Multi-column Footer */}
      <footer className="bg-white pt-24 pb-12 px-6 md:px-12 border-t border-[#F2EBE3]">
        <div className="max-w-[90rem] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-20">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="font-serif-lux text-3xl text-[var(--color-espresso)] font-bold tracking-tight mb-6 inline-block hover:opacity-70 transition-opacity">
              KD Luxe
            </Link>
            <p className="text-[var(--color-charcoal)] text-sm leading-relaxed max-w-xs mb-8">
              Curating spaces that inspire. Premium furniture designed for modern living, crafted with timeless traditions.
            </p>
            <div className="flex gap-4">
              {['Instagram', 'Pinterest', 'Twitter'].map(social => (
                <a key={social} href="#" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-[var(--color-espresso)] hover:bg-[#F2EBE3] hover:border-[#F2EBE3] hover:-translate-y-1 transition-all duration-300">
                  <span className="sr-only">{social}</span>
                  <div className="w-4 h-4 rounded-full bg-current"></div> {/* Placeholder icon */}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[var(--color-espresso)] uppercase tracking-widest text-xs mb-6">Shop</h4>
            <ul className="flex flex-col gap-4">
              {['New Arrivals', 'Living Room', 'Bedroom', 'Dining', 'Accessories'].map(link => (
                <li key={link}><a href="#" className="text-[var(--color-charcoal)] text-sm hover:text-[#C5A059] transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[var(--color-espresso)] uppercase tracking-widest text-xs mb-6">About</h4>
            <ul className="flex flex-col gap-4">
              {['Our Story', 'Design Studio', 'Sustainability', 'Careers'].map(link => (
                <li key={link}><a href="#" className="text-[var(--color-charcoal)] text-sm hover:text-[#C5A059] transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[var(--color-espresso)] uppercase tracking-widest text-xs mb-6">Support</h4>
            <ul className="flex flex-col gap-4">
              {['Contact Us', 'Shipping & Returns', 'FAQ', 'Track Order'].map(link => (
                <li key={link}><a href="#" className="text-[var(--color-charcoal)] text-sm hover:text-[#C5A059] transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-[90rem] mx-auto pt-8 border-t border-[#F2EBE3] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[var(--color-charcoal)]/60 text-xs">
            © {new Date().getFullYear()} KD Luxe. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[var(--color-charcoal)]/60 text-xs hover:text-[var(--color-espresso)] transition-colors">Privacy Policy</a>
            <a href="#" className="text-[var(--color-charcoal)]/60 text-xs hover:text-[var(--color-espresso)] transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
