import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

const Order = () => {
  const { order, shoppingStats } = useCart();

  const StatCard = ({ label, value, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white/60 backdrop-blur-2xl p-6 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] mb-2">{label}</p>
      <p className="text-3xl font-serif-lux text-[var(--color-espresso)]">₹{value?.toLocaleString() || 0}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen font-sans-lux bg-[#F9F8F6] selection:bg-[#C5A059] selection:text-white noise-bg pt-28 pb-20 px-6">
      <div className="max-w-[90rem] mx-auto space-y-12">

        {/* Header Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left mb-12"
        >
          <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] font-bold mb-3 block">Your Atelier</span>
          <h1 className="text-4xl md:text-5xl font-serif-lux text-[var(--color-espresso)] tracking-tight">Order History</h1>
        </motion.div>

        {/* Shopping Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="This Week" value={shoppingStats?.weeklySpent} delay={0.1} />
          <StatCard label="This Month" value={shoppingStats?.monthlySpent} delay={0.2} />
          <StatCard label="This Year" value={shoppingStats?.yearlySpent} delay={0.3} />
          <StatCard label="Total Invested" value={shoppingStats?.totalSpent} delay={0.4} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {order.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-2xl p-16 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-white text-center flex flex-col items-center justify-center">
              <p className="text-gray-500 font-medium tracking-wide">Your collection awaits. No orders placed yet.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {order.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  key={item._id}
                  className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-white overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50/50 p-6 md:px-8 border-b border-black/[0.03] flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <p className="text-[10px] tracking-widest uppercase font-bold text-gray-400 mb-1">Order Reference</p>
                      <p className="text-sm font-mono text-[var(--color-espresso)] font-medium bg-white px-3 py-1 rounded-full border border-gray-100 inline-block">{item._id}</p>
                    </div>
                    <div className="md:text-right flex flex-col md:items-end">
                      <p className="text-[10px] tracking-widest uppercase font-bold text-gray-400 mb-1">Status</p>
                      <span className={`text-[10px] tracking-widest px-4 py-1.5 rounded-full font-bold uppercase ${item.status === "Delivered" ? "bg-[#E6F3EB] text-[#2E7D4C] border border-[#2E7D4C]/10" :
                        item.status === "Cancelled" ? "bg-red-50 text-red-700 border border-red-100" :
                          "bg-[#F4F1E1] text-[#A67C00] border border-[#A67C00]/10"
                        }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6 md:p-8">
                    <div className="space-y-6">
                      {item.items.map((prod, index) => (
                        <div key={index} className="flex flex-col md:flex-row items-center gap-6 py-6 border-b border-black/[0.03] last:border-0 last:pb-0">
                          <div className="flex items-center gap-6 flex-grow w-full">
                            <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden border border-black/[0.03]">
                              <img
                                src={prod.image || "https://via.placeholder.com/120"}
                                alt={prod.name}
                                className="w-full h-full object-contain mix-blend-multiply"
                              />
                            </div>
                            <div className="flex-grow">
                              <p className="font-serif-lux font-bold text-lg text-[var(--color-espresso)] mb-1">{prod.name}</p>
                              {prod.selectedVariant && Object.keys(prod.selectedVariant).length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                                  {Object.entries(prod.selectedVariant).map(([k, v]) => (
                                    <span key={k} className="text-[10px] font-bold text-gray-500 bg-gray-100/80 px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                                      {k}: {v}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <p className="text-xs text-gray-500 font-medium tracking-wide">Qty: {prod.quantity} <span className="mx-2 text-gray-300">•</span> ₹{prod.price}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                            <div className="text-right">
                              <p className="text-xl font-medium text-[var(--color-espresso)]">₹{prod.price * prod.quantity}</p>
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap ${prod.status === "Delivered" ? "bg-[#E6F3EB] text-[#2E7D4C]" :
                              prod.status === "Cancelled" ? "bg-red-50 text-red-600" :
                                "bg-gray-100 text-gray-500"
                              }`}>
                              {prod.status || "Pending"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="mt-8 pt-8 border-t border-black/[0.04] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Purchased On</p>
                        <p className="text-sm text-[var(--color-espresso)] font-medium">
                          {new Date(item.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Order Total</p>
                        <p className="text-3xl font-serif-lux text-[var(--color-espresso)] leading-none">₹{item.totalPrice}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Order;
