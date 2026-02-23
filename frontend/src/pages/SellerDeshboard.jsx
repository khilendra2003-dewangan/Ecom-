import React, { useEffect, useState } from "react";
import { useSeller } from "../context/SellerContext";
import { useProduct } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";

const SellerDashboard = () => {
  const {
    myProducts, getMyProducts, deleteProduct,
    sellerOrders, getSellerOrders, updateOrderItemStatus,
    sellerStats, getSellerStats
  } = useSeller();
  const { user } = useUser();
  const { category, fetchCategory, subCategory, fetchSubCategories } = useProduct();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCat, setSelectedCat] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [productFilter, setProductFilter] = useState("all"); // 'all', 'approved', 'pending'
  const [viewingOrder, setViewingOrder] = useState(null);
  const navigate = useNavigate();

  const filteredProducts = myProducts.filter(p => {
    const matchCat = selectedCat ? p.category?._id === selectedCat : true;
    const matchSub = selectedSub ? p.subCategory?._id === selectedSub : true;
    const matchStatus = productFilter === "all" ? true :
      productFilter === "approved" ? p.isApproved :
        !p.isApproved;
    return matchCat && matchSub && matchStatus;
  });

  const filteredOrders = sellerOrders.filter(order => {
    const matchStatus = orderStatusFilter ? order.items.some(item => item.status === orderStatusFilter) : true;
    const matchPayment = paymentStatusFilter ? (order.paymentStatus || "Unpaid") === paymentStatusFilter : true;
    const matchMethod = paymentMethodFilter ? (order.paymentMethod || "COD") === paymentMethodFilter : true;
    return matchStatus && matchPayment && matchMethod;
  });

  useEffect(() => {
    getMyProducts();
    getSellerOrders();
    getSellerStats();
    fetchCategory();
    fetchSubCategories();
  }, []);

  const StatCard = ({ title, value, color, prefix = "₹" }) => (
    <div className={`bg-white p-6 rounded-3xl shadow-sm border border-white flex flex-col justify-between hover:shadow-md transition`}>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-black text-[var(--color-espresso)] font-serif-lux">
          {prefix}{typeof value === "number" ? value.toLocaleString() : value || 0}
        </p>
      </div>
      <div className={`h-1 rounded-full mt-4 overflow-hidden bg-gray-50`}>
        <div className={`h-full ${color} w-2/3`}></div>
      </div>
    </div>
  );

  const FilterBadge = ({ label, count, active, onClick, colorClass }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${active
        ? `${colorClass} text-white shadow-lg`
        : 'bg-gray-50 text-gray-500 hover:bg-gray-200 border border-transparent'
        }`}
    >
      {label}: {count}
    </button>
  );

  const FilterSelect = ({ value, onChange, options, label }) => (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 font-bold shadow-sm transition"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 mb-20 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold text-[var(--color-espresso)] font-serif-lux tracking-tight">Seller Hub</h1>
          <button
            onClick={() => navigate("/addproduct")}
            className="bg-[var(--color-espresso)] hover:bg-[#2A2321] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[var(--color-espresso)]/5 transition transform hover:-translate-y-0.5"
          >
            + Add New Product
          </button>
        </div>

        {/* Premium Profile Header */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-white shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10 animate-fadeIn overflow-hidden">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-[var(--color-espresso)] rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-[var(--color-espresso)]/5 overflow-hidden">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.[0]?.toUpperCase()
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
            </div>
            <div>
              <h2 className="text-3xl font-black text-[var(--color-espresso)] font-serif-lux tracking-tight">{user?.name}</h2>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Authorized Seller Profile</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-lg uppercase tracking-wider">
                  Verified & Active
                </span>
                <span className="text-gray-300">|</span>
                <p className="text-[10px] font-black text-gray-400 uppercase">
                  Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2026'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Store Rating</p>
              <p className="text-lg font-black text-[var(--color-espresso)]">4.9 / 5.0</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-10 bg-white p-1.5 rounded-2xl shadow-sm w-fit border border-white">
          {["overview", "products", "orders"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 capitalize ${activeTab === tab
                ? "bg-[var(--color-espresso)] text-white shadow-md shadow-[var(--color-espresso)]/5"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {activeTab === "overview" && (
          <div className="animate-fadeIn space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <StatCard title="Total Earnings" value={sellerStats?.totalRevenue} color="bg-[var(--color-espresso)]" />
              <StatCard title="Total Products" value={sellerStats?.totalProducts} color="bg-gray-400" prefix="" />
              <StatCard title="Total Stock Added" value={sellerStats?.totalStockAdded} color="bg-indigo-400" prefix="" />
              <StatCard title="Remaining Stock" value={sellerStats?.remainingStock} color="bg-orange-500" prefix="" />
              <StatCard title="Units Sold" value={sellerStats?.unitsSold} color="bg-green-500" prefix="" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Today's Profit" value={sellerStats?.dailyProfit} color="bg-green-500" />
              <StatCard title="Monthly Revenue" value={sellerStats?.monthlyProfit} color="bg-blue-500" />
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-white">
              <h2 className="text-xl font-bold text-[var(--color-espresso)] font-serif-lux mb-6">Recent Performance</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 text-xs uppercase tracking-widest border-b border-white/50">
                      <th className="pb-4 font-semibold">Date</th>
                      <th className="pb-4 font-semibold text-right">Profit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {sellerStats?.chartData && [...sellerStats.chartData].reverse().map((data, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition">
                        <td className="py-4 text-sm font-medium text-gray-700">{data.date}</td>
                        <td className="py-4 text-sm font-bold text-green-600 text-right">₹{data.profit.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-white overflow-hidden animate-fadeIn">
            <div className="p-10 border-b border-white/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div>
                <h2 className="text-2xl font-black text-[var(--color-espresso)] font-serif-lux">Inventory Catalog</h2>
                <div className="flex flex-wrap gap-3 mt-4">
                  <FilterBadge
                    label="All items"
                    count={myProducts.length}
                    active={productFilter === 'all'}
                    onClick={() => setProductFilter('all')}
                    colorClass="bg-gray-800"
                  />
                  <FilterBadge
                    label="Live"
                    count={myProducts.filter(p => p.isApproved).length}
                    active={productFilter === 'approved'}
                    onClick={() => setProductFilter('approved')}
                    colorClass="bg-green-600"
                  />
                  <FilterBadge
                    label="Pending"
                    count={myProducts.filter(p => !p.isApproved).length}
                    active={productFilter === 'pending'}
                    onClick={() => setProductFilter('pending')}
                    colorClass="bg-orange-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                <select
                  value={selectedCat}
                  onChange={(e) => { setSelectedCat(e.target.value); setSelectedSub(""); }}
                  className="bg-gray-50 border border-white text-gray-700 text-xs rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white p-3 font-bold shadow-sm transition outline-none"
                >
                  <option value="">All Categories</option>
                  {category.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>

                <select
                  value={selectedSub}
                  onChange={(e) => setSelectedSub(e.target.value)}
                  disabled={!selectedCat}
                  className="bg-gray-50 border border-white text-gray-700 text-xs rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white p-3 font-bold shadow-sm transition outline-none disabled:opacity-50"
                >
                  <option value="">All Subcategories</option>
                  {subCategory.filter(sub => sub.category?._id === selectedCat || sub.category === selectedCat).map(sub => (
                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {filteredProducts.length === 0 ? (
                <div className="p-32 text-center">
                  <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No products found matching your filters</p>
                </div>
              ) : (
                filteredProducts.map((product) => {
                  const soldCount = sellerStats?.productSales?.[product._id] || 0;
                  const totalAdded = product.stock + soldCount;
                  const stockPercentage = totalAdded > 0 ? (product.stock / totalAdded) * 100 : 0;

                  return (
                    <div key={product._id} className="p-10 flex flex-col md:flex-row items-center justify-between gap-10 hover:bg-gray-50/50 transition">
                      <div className="flex items-center gap-8 w-full">
                        <div className="relative group">
                          <img
                            src={product.images?.[0] || "https://via.placeholder.com/150"}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-[2rem] shadow-xl shadow-indigo-50 border-4 border-white group-hover:scale-105 transition duration-300"
                          />
                          {!product.isApproved && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
                              <span className="text-[8px] font-black">!</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-black text-[var(--color-espresso)] font-serif-lux">{product.name}</h3>
                            <span className={`text-[8px] uppercase tracking-widest font-black px-2 py-0.5 rounded-lg ${product.isApproved ? "bg-green-50 text-green-600 border border-green-100" : "bg-orange-50 text-orange-600 border border-orange-100"}`}>
                              {product.isApproved ? "Live" : "Awaiting Review"}
                            </span>
                          </div>
                          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">
                            {product.category?.name || "Uncategorized"}
                            {product.subCategory?.name && ` • ${product.subCategory.name}`}
                          </p>

                          {/* Advanced Stock Info */}
                          <div className="flex flex-col gap-2 w-full max-w-xs">
                            <div className="flex justify-between items-end">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Availability</p>
                              <p className="text-xs font-black text-[var(--color-espresso)] font-serif-lux">
                                {product.stock} <span className="text-gray-300 mx-1">/</span> {totalAdded}
                                <span className="ml-1 text-[8px] text-gray-400">PCS</span>
                              </p>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-1000 ${stockPercentage < 20 ? 'bg-red-500' :
                                  stockPercentage < 50 ? 'bg-orange-500' :
                                    'bg-[var(--color-espresso)]'
                                  }`}
                                style={{ width: `${stockPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center md:items-end gap-6 w-full md:w-auto">
                        <div className="text-right">
                          <p className="text-2xl font-black text-[var(--color-espresso)] font-serif-lux tracking-tighter">₹{(product.discountPrice || product.price).toLocaleString()}</p>
                          {product.discountPrice && <p className="text-xs text-gray-400 line-through font-bold">₹{product.price.toLocaleString()}</p>}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/edit-product/${product._id}`)}
                            className="p-3 bg-white border border-white text-[var(--color-espresso)] hover:bg-[var(--color-espresso)] hover:text-white rounded-2xl shadow-sm transition-all duration-300"
                            title="Edit Listing"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                          </button>
                          <button
                            onClick={() => deleteProduct(product._id)}
                            className="p-3 bg-white border border-white text-red-600 hover:bg-red-600 hover:text-white rounded-2xl shadow-sm transition-all duration-300"
                            title="Remove Product"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-white flex flex-wrap gap-6 items-center">
              <div className="flex-grow">
                <h2 className="text-xl font-black text-[var(--color-espresso)] font-serif-lux">Order Management</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Total Filtered: {filteredOrders.length}</p>
              </div>

              <div className="flex flex-wrap gap-4">
                <FilterSelect
                  label="Order Status"
                  value={orderStatusFilter}
                  onChange={setOrderStatusFilter}
                  options={[
                    { label: "All Status", value: "" },
                    { label: "Pending", value: "Pending" },
                    { label: "Processing", value: "Processing" },
                    { label: "Shipped", value: "Shipped" },
                    { label: "Delivered", value: "Delivered" },
                    { label: "Cancelled", value: "Cancelled" },
                  ]}
                />
                <FilterSelect
                  label="Payment State"
                  value={paymentStatusFilter}
                  onChange={setPaymentStatusFilter}
                  options={[
                    { label: "All States", value: "" },
                    { label: "Paid", value: "Paid" },
                    { label: "Unpaid", value: "Unpaid" },
                  ]}
                />
                <FilterSelect
                  label="Method"
                  value={paymentMethodFilter}
                  onChange={setPaymentMethodFilter}
                  options={[
                    { label: "All Methods", value: "" },
                    { label: "COD", value: "COD" },
                    { label: "Online Pay", value: "Online" },
                  ]}
                />
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white p-20 rounded-3xl shadow-sm text-center border border-white">
                <p className="text-gray-400 font-medium text-lg">No orders found matching your criteria.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-white overflow-hidden">
                  <div className="bg-gray-50/50 px-8 py-4 border-b border-white flex justify-between items-center whitespace-nowrap overflow-hidden">
                    <div className="flex gap-8 overflow-hidden items-center">
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Customer</p>
                        <p className="text-sm font-bold text-gray-700 truncate">{order.user?.name}</p>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Date</p>
                        <p className="text-sm font-bold text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Payment</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${order.paymentStatus === "Paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                            {order.paymentStatus || "Unpaid"}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium">({order.paymentMethod || "COD"})</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Seller Share</p>
                      <p className="text-sm font-bold text-[var(--color-espresso)]">₹{order.sellerTotal?.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="px-8 py-4 bg-[#E8E6E1]/50/30 border-b border-white">
                    <p className="text-[10px] text-[#C5A059] uppercase font-black tracking-widest mb-1">Shipping Address</p>
                    {order.shippingAddress ? (
                      <p className="text-xs text-indigo-900 font-medium leading-relaxed">
                        {order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.pincode} | <span className="font-bold">Mob: {order.shippingAddress.phone}</span>
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No specific address provided</p>
                    )}
                  </div>
                  <div className="p-8 space-y-6">
                    {order.items.map((item) => (
                      <div key={item._id} className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 last:pb-0 last:border-0 border-b border-white/50">
                        <div className="flex items-center gap-6 w-full">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                          <div className="flex-grow">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-[var(--color-espresso)] font-serif-lux">{item.name}</p>
                              <button
                                onClick={() => setViewingOrder({ order, item })}
                                className="text-[10px] font-black uppercase text-indigo-500 hover:text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded transition"
                              >
                                View Snapshot
                              </button>
                            </div>
                            {item.selectedVariant && Object.keys(item.selectedVariant).length > 0 && (
                              <div className="flex flex-wrap gap-2 my-1">
                                {Object.entries(item.selectedVariant).map(([k, v]) => (
                                  <span key={k} className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                                    {v}
                                  </span>
                                ))}
                              </div>
                            )}
                            <p className="text-xs text-gray-500 font-medium">Qty: {item.quantity} × ₹{item.price}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${item.status === "Delivered" ? "bg-green-100 text-green-700" :
                            item.status === "Cancelled" ? "bg-red-100 text-red-700" :
                              "bg-blue-100 text-blue-700"
                            }`}>
                            {item.status}
                          </span>
                          <select
                            value={item.status}
                            onChange={(e) => updateOrderItemStatus(order._id, item._id, e.target.value)}
                            className="text-sm border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 py-1.5 pl-3 pr-8 font-medium text-gray-600 transition"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Order Details Snapshot Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
          <div
            className="absolute inset-0 bg-[var(--color-espresso)]/40 backdrop-blur-md"
            onClick={() => setViewingOrder(null)}
          ></div>
          <div className="bg-white rounded-[3rem] shadow-2xl relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn border border-white">
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-3xl font-black text-[var(--color-espresso)] font-serif-lux tracking-tight leading-none">Order Snapshot</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Ref: {viewingOrder.order._id}</p>
                </div>
                <button
                  onClick={() => setViewingOrder(null)}
                  className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition shadow-sm"
                >
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                {/* Product Context */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-[2rem] border border-white">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-6 border-b border-gray-200 pb-2">Product Registry</p>
                    <div className="flex gap-4">
                      <img src={viewingOrder.item.image} className="w-20 h-20 object-cover rounded-2xl shadow-md border-2 border-white" alt="" />
                      <div>
                        <p className="font-bold text-[var(--color-espresso)]">{viewingOrder.item.name}</p>
                        <p className="text-sm font-bold text-indigo-600 mt-1">₹{viewingOrder.item.price} <span className="text-gray-400 font-medium">× {viewingOrder.item.quantity}</span></p>
                      </div>
                    </div>
                    {viewingOrder.item.product?.category && (
                      <div className="mt-8 pt-4 border-t border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Category Path</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-600 bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100">
                            {viewingOrder.item.product.category?.name}
                          </span>
                          {viewingOrder.item.product.subCategory && (
                            <>
                              <svg className="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg shadow-sm border border-indigo-100">
                                {viewingOrder.item.product.subCategory?.name}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Context */}
                <div className="space-y-6">
                  <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-white">
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-6 border-b border-indigo-100/50 pb-2">Client Profile</p>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-sm border-2 border-white">
                        {viewingOrder.order.user?.profilePicture ? (
                          <img src={viewingOrder.order.user.profilePicture} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <span className="text-xl font-black text-indigo-500">{viewingOrder.order.user?.name?.[0]}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-[var(--color-espresso)]">{viewingOrder.order.user?.name}</p>
                        <p className="text-xs text-gray-500 font-medium">{viewingOrder.order.user?.email}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Contact Nexus</p>
                        <p className="text-sm font-bold text-indigo-900">{viewingOrder.order.shippingAddress?.phone}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Delivery Destination</p>
                        <p className="text-xs font-medium text-gray-600 leading-relaxed">
                          {viewingOrder.order.shippingAddress?.address}, {viewingOrder.order.shippingAddress?.city} - {viewingOrder.order.shippingAddress?.pincode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Management */}
              <div className="mt-10 p-8 bg-gray-900 rounded-[2.5rem] flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Internal Status Synchronization</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${viewingOrder.item.status === 'Delivered' ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                    <span className="text-white font-bold tracking-tight">{viewingOrder.item.status}</span>
                  </div>
                </div>
                <select
                  value={viewingOrder.item.status}
                  onChange={(e) => {
                    updateOrderItemStatus(viewingOrder.order._id, viewingOrder.item._id, e.target.value);
                    setViewingOrder(prev => ({ ...prev, item: { ...prev.item, status: e.target.value } }));
                  }}
                  className="bg-white/10 border-white/20 text-white text-sm rounded-2xl focus:ring-2 focus:ring-white/20 p-4 font-bold outline-none cursor-pointer w-full sm:w-auto"
                >
                  <option value="Pending" className="text-gray-900">Pending</option>
                  <option value="Processing" className="text-gray-900">Processing</option>
                  <option value="Shipped" className="text-gray-900">Shipped</option>
                  <option value="Delivered" className="text-gray-900">Delivered</option>
                  <option value="Cancelled" className="text-gray-900">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
