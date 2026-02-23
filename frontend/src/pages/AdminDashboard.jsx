import React, { useEffect, useState } from "react";
import { useProduct } from "../context/ProductContext";
import API from "../api/api";
import {
  FiUsers, FiPackage, FiShoppingBag, FiCheckCircle, FiXCircle,
  FiPieChart, FiSettings, FiGrid, FiList, FiTrendingUp, FiArrowRight, FiX, FiPlus
} from "react-icons/fi";

const AdminDashboard = () => {
  const {
    category,
    subCategory,
    fetchCategory,
    CreateCategory,
    CreateSubCategory,
    fetchSubCategories,
    UpdateSubCategorySchema,
    MigrateCategories,
  } = useProduct();

  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [adminProducts, setAdminProducts] = useState([]);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewingSellerProducts, setViewingSellerProducts] = useState(null);
  const [sellerStats, setSellerStats] = useState(null);
  const [sellerStatsLoading, setSellerStatsLoading] = useState(false);
  const [productModerationFilter, setProductModerationFilter] = useState('all'); // 'all', 'live', 'pending'

  // Category Form State
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryImage, setSubCategoryImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [architectFields, setArchitectFields] = useState([]); // [{ name: "", options: "" }]
  const [selectedSchemaSubId, setSelectedSchemaSubId] = useState("");
  const [selectedArchitectCategory, setSelectedArchitectCategory] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [statsRes, sellersRes, productsRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/getallsellers"),
        API.get("/admin/getallproducts")
      ]);
      setStats(statsRes.data);
      setSellers(sellersRes.data);
      setAdminProducts(productsRes.data);
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    fetchCategory();
    fetchSubCategories();
  }, []);

  const filteredAdminProducts = adminProducts.filter(prod =>
    prod.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    prod.seller?.name?.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  const toggleSellerStatus = async (id) => {
    try {
      await API.put(`/admin/toggle-seller/${id}`);
      fetchStats();
    } catch (error) {
      alert("Error toggling seller status");
    }
  };

  const handleFetchSellerStats = async (seller) => {
    setViewingSellerProducts(seller);
    setSellerStatsLoading(true);
    try {
      const res = await API.get(`/admin/seller-stats/${seller._id}`);
      setSellerStats(res.data);
    } catch (error) {
      console.error("Error fetching seller stats:", error);
    }
    setSellerStatsLoading(false);
  };

  const toggleProductStatus = async (id) => {
    try {
      await API.put(`/admin/toggle-product/${id}`);
      fetchStats();
    } catch (error) {
      alert("Error toggling product status");
    }
  };

  const handleMigrateCategories = async () => {
    if (window.confirm("This will merge all SubCategories into the Category network. Continue?")) {
      try {
        await MigrateCategories();
        alert("Categories successfully merged and synchronized 🚀");
        fetchStats();
      } catch (error) {
        alert("Migration failed: " + error.message);
      }
    }
  };

  const handleAddCategoryUnified = async (isSub = false) => {
    const name = isSub ? subCategoryName : categoryName;
    const parent = isSub ? selectedCategory : null;
    const image = isSub ? subCategoryImage : categoryImage;

    if (!name) return alert("Enter descriptor name");

    const formData = new FormData();
    formData.append("name", name);
    if (parent) formData.append("parentId", parent);
    if (image) formData.append("image", image);

    await CreateCategory(formData);

    if (isSub) {
      setSubCategoryName("");
      setSubCategoryImage(null);
    } else {
      setCategoryName("");
      setCategoryImage(null);
    }
    fetchCategory();
  };

  const handleUpdateSchema = async () => {
    if (!selectedSchemaSubId) return alert("Select a subcategory");

    const variantSchema = architectFields
      .map(field => ({
        name: field.name.trim(),
        options: field.options.split(",").map(opt => opt.trim()).filter(opt => opt)
      }))
      .filter(field => field.name && field.options.length > 0);

    if (variantSchema.length === 0) return alert("Add at least one field");

    await UpdateSubCategorySchema(selectedSchemaSubId, variantSchema);
    setArchitectFields([]);
    setSelectedSchemaSubId("");
    alert("Schema updated successfully");
  };

  const handleAddField = () => {
    setArchitectFields([...architectFields, { name: "", options: "" }]);
  };

  const handleRemoveField = (index) => {
    setArchitectFields(architectFields.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index, key, value) => {
    const newFields = [...architectFields];
    newFields[index][key] = value;
    setArchitectFields(newFields);
  };

  const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-white hover:shadow-md transition group overflow-hidden relative">
      <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-[0.03] rounded-bl-[4rem] group-hover:scale-110 transition-transform`}></div>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className="text-[10px] font-black bg-green-50 text-green-600 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
            <FiTrendingUp size={10} /> {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-3xl font-black text-[var(--color-espresso)] font-serif-lux">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex font-sans-lux relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply z-0" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/stardust.png')` }}></div>
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-white p-8 flex flex-col fixed h-full z-10 transition-all">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-[var(--color-espresso)] rounded-2xl flex items-center justify-center shadow-lg shadow-[var(--color-espresso)]/5">
            <FiShoppingBag className="text-white" size={20} />
          </div>
          <h2 className="text-xl font-black text-[var(--color-espresso)] font-serif-lux tracking-tight">KD Dashboard</h2>
        </div>

        <nav className="space-y-2 flex-grow">
          {[
            { id: "overview", label: "Overview", icon: FiGrid },
            { id: "sellers", label: "Sellers", icon: FiUsers },
            { id: "products", label: "Moderation", icon: FiPackage },
            { id: "settings", label: "Catalog", icon: FiSettings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === tab.id
                ? "bg-[var(--color-espresso)] text-white shadow-xl shadow-[var(--color-espresso)]/5 translate-x-1"
                : "text-gray-400 hover:bg-gray-50 hover:text-[var(--color-espresso)]"
                }`}
            >
              <tab.icon size={20} />
              <span className="text-sm tracking-wide">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto p-6 bg-gray-50 rounded-3xl border border-white">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] font-bold text-gray-600 uppercase">All Systems Operational</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-[var(--color-espresso)] font-serif-lux tracking-tight">Admin Console</h1>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Centralized Marketplace Command</p>
          </div>
          <button
            onClick={fetchStats}
            className="p-3 bg-white border border-white rounded-2xl shadow-sm hover:shadow-md transition text-gray-500"
            title="Refresh Data"
          >
            <FiTrendingUp size={20} className="rotate-90" />
          </button>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest animate-pulse">Syncing Network Data</p>
          </div>
        ) : (
          <div className="animate-fadeIn">
            {/* Overview Tab */}
            {activeTab === "overview" && stats && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <StatCard icon={FiPackage} label="Total Products" value={stats.overview.totalProducts} color="bg-[#E8E6E1]/500" trend="12% Up" />
                  <StatCard icon={FiUsers} label="Active Sellers" value={stats.overview.totalSellers} color="bg-blue-500" trend="5% Up" />
                  <StatCard icon={FiShoppingBag} label="Gross Sales" value={`₹${stats.overview.totalSales.toLocaleString()}`} color="bg-green-500" trend="24% Up" />
                  <StatCard icon={FiPieChart} label="Conversion" value="14.2%" color="bg-purple-500" trend="3% Up" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-white/50">
                    <h3 className="text-xl font-black text-[var(--color-espresso)] font-serif-lux mb-8 flex items-center gap-3">
                      <span className="w-2 h-8 bg-[var(--color-espresso)] rounded-full"></span>
                      Order Fulfillment Pipeline
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                      {Object.entries(stats.statusCounts).map(([status, count]) => (
                        <div key={status} className="p-6 bg-white/40 rounded-3xl border border-white text-center group hover:bg-white hover:border-indigo-100 transition shadow-sm hover:shadow-lg">
                          <p className={`text-xl font-black mb-1 ${status === 'Delivered' ? 'text-green-600' :
                            status === 'Cancelled' ? 'text-red-500' : 'text-gray-700'
                            }`}>{count}</p>
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-tight">{status}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[var(--color-espresso)] p-10 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Network Health</p>
                      <h4 className="text-2xl font-black mb-6">Marketplace Analytics</h4>
                      <div className="space-y-6">
                        {[
                          { label: 'Seller Growth', val: '88%' },
                          { label: 'User Retention', val: '92%' },
                          { label: 'Approval Latency', val: '4.2h' }
                        ].map(i => (
                          <div key={i.label}>
                            <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                              <span>{i.label}</span>
                              <span>{i.val}</span>
                            </div>
                            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                              <div className="h-full bg-white rounded-full" style={{ width: i.val.includes('%') ? i.val : '60%' }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setActiveTab('sellers')} className="mt-10 flex items-center gap-2 text-xs font-black uppercase tracking-widest group/btn">
                        Manage Marketplace <FiArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sellers Tab */}
            {activeTab === "sellers" && (
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-white/50 overflow-hidden animate-slideUp">
                <div className="p-10 border-b border-white/50 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black text-[var(--color-espresso)] font-serif-lux">
                      {viewingSellerProducts ? `Products by ${viewingSellerProducts.name}` : "Seller Network"}
                    </h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                      {viewingSellerProducts ? "Review and authorize this vendor's listings" : "Manage and moderate vendor accounts"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {viewingSellerProducts ? (
                      <>
                        <span className="text-[10px] font-black bg-[#E8E6E1]/50 text-[var(--color-espresso)] px-4 py-2 rounded-xl uppercase">Total: {adminProducts.filter(p => p.seller?._id === viewingSellerProducts._id).length}</span>
                        <span className="text-[10px] font-black bg-green-50 text-green-600 px-4 py-2 rounded-xl uppercase">Live: {adminProducts.filter(p => p.seller?._id === viewingSellerProducts._id && p.isApproved).length}</span>
                        <span className="text-[10px] font-black bg-orange-50 text-orange-600 px-4 py-2 rounded-xl uppercase">Pending: {adminProducts.filter(p => p.seller?._id === viewingSellerProducts._id && !p.isApproved).length}</span>
                        <button
                          onClick={() => setViewingSellerProducts(null)}
                          className="text-[10px] font-black bg-gray-100 text-gray-600 px-4 py-2 rounded-xl uppercase hover:bg-gray-200 transition"
                        >
                          Back to Sellers
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] font-black bg-[#E8E6E1]/50 text-[var(--color-espresso)] px-4 py-2 rounded-xl uppercase">Total Sellers: {sellers.length}</span>
                    )}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  {!viewingSellerProducts ? (
                    <table className="w-full text-left">
                      <thead className="bg-white/40">
                        <tr>
                          <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Seller Identity</th>
                          <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Intel</th>
                          <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Operational Status</th>
                          <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Admin Control</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {sellers.map((seller) => (
                          <tr key={seller._id} className="hover:bg-gray-50/50 transition group">
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#E8E6E1]/50 rounded-2xl flex items-center justify-center text-[var(--color-espresso)] font-black text-lg">
                                  {seller.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-[var(--color-espresso)] font-serif-lux">{seller.name}</p>
                                  <p className="text-[10px] font-black text-gray-400 uppercase">Joined {new Date(seller.createdAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-6">
                              <p className="text-sm font-bold text-gray-600">{seller.email}</p>
                              <p className="text-[10px] font-black text-gray-400">{seller.phone || 'No Phone Registered'}</p>
                            </td>
                            <td className="px-10 py-6">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${seller.isApproved ? "bg-green-50 border-green-100 text-green-600" : "bg-orange-50 border-orange-100 text-orange-600"
                                }`}>
                                {seller.isApproved ? "Verified & Active" : "Pending Oversight"}
                              </span>
                            </td>
                            <td className="px-10 py-6 text-right flex items-center justify-end gap-3 font-sans">
                              <button
                                onClick={() => handleFetchSellerStats(seller)}
                                className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition bg-[#E8E6E1]/50 text-[var(--color-espresso)] hover:bg-indigo-100"
                              >
                                View Products
                              </button>
                              <button
                                onClick={() => toggleSellerStatus(seller._id)}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition shadow-sm ${seller.isApproved ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-[var(--color-espresso)] text-white hover:bg-[#2A2321] shadow-[var(--color-espresso)]/5 shadow-lg"
                                  }`}
                              >
                                {seller.isApproved ? "Deactivate" : "Approve Seller"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-10 space-y-10">
                      {/* Detailed Seller Profile Header */}
                      <div className="bg-white p-8 rounded-[2.5rem] border border-white shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <div className="w-24 h-24 bg-[var(--color-espresso)] rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-[var(--color-espresso)]/5 overflow-hidden">
                              {viewingSellerProducts.profilePicture ? (
                                <img src={viewingSellerProducts.profilePicture} alt={viewingSellerProducts.name} className="w-full h-full object-cover" />
                              ) : (
                                viewingSellerProducts.name.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
                          </div>
                          <div>
                            <h2 className="text-3xl font-black text-[var(--color-espresso)] font-serif-lux tracking-tight">{viewingSellerProducts.name}</h2>
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Authorized Seller Profile</p>
                            <div className="flex items-center gap-2 mt-3">
                              <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-lg uppercase tracking-wider">
                                {viewingSellerProducts.isApproved ? "Verified & Active" : "Pending Oversight"}
                              </span>
                              <span className="text-gray-300">|</span>
                              <p className="text-[10px] font-black text-gray-400 uppercase">Member since {new Date(viewingSellerProducts.createdAt).getFullYear()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Information</p>
                            <p className="text-sm font-bold text-gray-700">{viewingSellerProducts.email}</p>
                            <p className="text-xs font-medium text-gray-500">{viewingSellerProducts.phone || "No phone registered"}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Office Address</p>
                            <p className="text-sm font-bold text-gray-700 leading-tight">
                              {viewingSellerProducts.address ? (
                                <>
                                  {viewingSellerProducts.address}<br />
                                  <span className="text-xs text-gray-500">{viewingSellerProducts.city}, {viewingSellerProducts.pincode}</span>
                                </>
                              ) : (
                                <span className="text-gray-400 italic">No address provided</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Seller Stats Cards */}
                      {sellerStatsLoading ? (
                        <div className="flex gap-8">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="flex-1 h-32 bg-gray-50 rounded-3xl animate-pulse"></div>
                          ))}
                        </div>
                      ) : sellerStats && (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                          <div className="bg-white/40 p-6 rounded-3xl border border-white flex flex-col justify-between">
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Sales</p>
                              <p className="text-2xl font-black text-[var(--color-espresso)]">₹{sellerStats.totalRevenue.toLocaleString()}</p>
                            </div>
                            <div className="h-1 bg-indigo-100 rounded-full mt-4 overflow-hidden">
                              <div className="h-full bg-[var(--color-espresso)] w-2/3"></div>
                            </div>
                          </div>
                          <div className="bg-white/40 p-6 rounded-3xl border border-white flex flex-col justify-between">
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Products</p>
                              <p className="text-2xl font-black text-[var(--color-espresso)] font-serif-lux">{sellerStats.totalProducts}</p>
                            </div>
                            <div className="h-1 bg-gray-100 rounded-full mt-4 overflow-hidden">
                              <div className="h-full bg-gray-400 w-1/2"></div>
                            </div>
                          </div>
                          <div className="bg-white/40 p-6 rounded-3xl border border-white flex flex-col justify-between">
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Stock Added</p>
                              <p className="text-2xl font-black text-[var(--color-espresso)] font-serif-lux">{sellerStats.totalStockAdded}</p>
                            </div>
                            <div className="h-1 bg-indigo-100 rounded-full mt-4 overflow-hidden">
                              <div className="h-full bg-indigo-400 w-full"></div>
                            </div>
                          </div>
                          <div className="bg-white/40 p-6 rounded-3xl border border-white flex flex-col justify-between">
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Remaining Stock</p>
                              <p className="text-2xl font-black text-orange-600">{sellerStats.remainingStock}</p>
                            </div>
                            <div className="h-1 bg-orange-100 rounded-full mt-4 overflow-hidden">
                              <div className="h-full bg-orange-500 w-3/4"></div>
                            </div>
                          </div>
                          <div className="bg-white/40 p-6 rounded-3xl border border-white flex flex-col justify-between">
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Units Sold</p>
                              <p className="text-2xl font-black text-green-600">{sellerStats.unitsSold}</p>
                            </div>
                            <div className="h-1 bg-green-100 rounded-full mt-4 overflow-hidden">
                              <div className="h-full bg-green-500 w-1/2"></div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="border-t border-white/50 pt-10">
                        <div className="flex items-center gap-3 mb-8">
                          <span className="w-2 h-8 bg-[var(--color-espresso)] rounded-full"></span>
                          <h3 className="text-xl font-black text-[var(--color-espresso)] font-serif-lux">Inventory Catalog</h3>
                        </div>
                        <div className="overflow-x-auto border border-white/50 rounded-3xl">
                          <table className="w-full text-left">
                            <thead className="bg-white/40">
                              <tr>
                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Listing Detail</th>
                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Availability</th>
                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {adminProducts.filter(p => p.seller?._id === viewingSellerProducts._id).length === 0 ? (
                                <tr>
                                  <td colSpan="4" className="px-10 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                                    No products found for this seller
                                  </td>
                                </tr>
                              ) : (
                                adminProducts.filter(p => p.seller?._id === viewingSellerProducts._id).map((prod) => {
                                  // Total Added = Current Stock + Sold
                                  const soldCount = sellerStats?.productSales?.[prod._id] || 0;
                                  const totalAdded = prod.stock + soldCount;

                                  return (
                                    <tr key={prod._id} className="hover:bg-gray-50/50 transition">
                                      <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                          <img src={prod.images?.[0] || 'https://via.placeholder.com/150'} className="w-12 h-12 rounded-xl object-cover shadow-sm bg-gray-100" alt="" />
                                          <div>
                                            <p className="font-bold text-[var(--color-espresso)] font-serif-lux">{prod.name}</p>
                                            <div className="flex items-center gap-2">
                                              <p className="text-[10px] font-black text-[var(--color-espresso)] uppercase font-mono">₹{prod.price.toLocaleString()}</p>
                                              <span className="text-[10px] font-black text-gray-300">|</span>
                                              <div className="flex items-center gap-1">
                                                {prod.isApproved ? <FiCheckCircle className="text-green-500 w-2.5 h-2.5" /> : <FiXCircle className="text-orange-500 w-2.5 h-2.5" />}
                                                <span className={`text-[10px] font-black uppercase ${prod.isApproved ? 'text-green-600' : 'text-orange-600'}`}>
                                                  {prod.isApproved ? 'Live' : 'Pending'}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-10 py-6">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{prod.category?.name || 'N/A'}</p>
                                      </td>
                                      <td className="px-10 py-6">
                                        <div className="flex flex-col gap-1.5 w-32">
                                          <div className="flex justify-between items-end">
                                            <p className="text-xs font-black text-[var(--color-espresso)] font-serif-lux">
                                              {prod.stock}
                                              <span className="text-gray-300 font-normal mx-1">/</span>
                                              <span className="text-gray-400">{totalAdded}</span>
                                            </p>
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Available</p>
                                          </div>
                                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                              className={`h-full transition-all duration-500 ${prod.stock < 5 ? 'bg-red-500' : prod.stock < 15 ? 'bg-orange-400' : 'bg-green-500'
                                                }`}
                                              style={{ width: `${(prod.stock / totalAdded) * 100}%` }}
                                            ></div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-10 py-6 text-right">
                                        <button
                                          onClick={() => toggleProductStatus(prod._id)}
                                          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition ${prod.isApproved ? "text-red-500 hover:bg-red-50" : "bg-[var(--color-espresso)] text-white hover:bg-[#2A2321] shadow-lg shadow-[var(--color-espresso)]/5"
                                            }`}
                                        >
                                          {prod.isApproved ? "Unlist" : "Approve"}
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && (
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-white/50 overflow-hidden animate-slideUp">
                <div className="p-10 border-b border-white/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h3 className="text-2xl font-black text-[var(--color-espresso)] font-serif-lux">Product Moderation</h3>
                    <div className="flex flex-wrap gap-4 mt-4">
                      <button
                        onClick={() => setProductModerationFilter('all')}
                        className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${productModerationFilter === 'all'
                          ? 'bg-gray-800 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-200 border border-transparent'
                          }`}
                      >
                        Inventory: {adminProducts.length}
                      </button>
                      <button
                        onClick={() => setProductModerationFilter('live')}
                        className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${productModerationFilter === 'live'
                          ? 'bg-green-600 text-white shadow-lg shadow-green-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                      >
                        Live: {adminProducts.filter(p => p.isApproved).length}
                      </button>
                      <button
                        onClick={() => setProductModerationFilter('pending')}
                        className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${productModerationFilter === 'pending'
                          ? 'bg-orange-500 text-white shadow-lg shadow-orange-100'
                          : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                          }`}
                      >
                        Pending: {adminProducts.filter(p => !p.isApproved).length}
                      </button>
                    </div>
                  </div>
                  <div className="w-full md:w-64">
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      className="w-full bg-gray-50 border border-white rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-indigo-100 focus:bg-white transition"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-white/40">
                      <tr>
                        <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Listing Detail</th>
                        <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vendor</th>
                        <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredAdminProducts
                        .filter(p => {
                          if (productModerationFilter === 'live') return p.isApproved;
                          if (productModerationFilter === 'pending') return !p.isApproved;
                          return true;
                        })
                        .map((prod) => (
                          <tr key={prod._id} className="hover:bg-gray-50/50 transition">
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                <img src={prod.images?.[0] || 'https://via.placeholder.com/150'} className="w-12 h-12 rounded-xl object-cover shadow-sm bg-[#E8E6E1]/50" alt="" />
                                <div>
                                  <p className="font-bold text-[var(--color-espresso)] font-serif-lux">{prod.name}</p>
                                  <p className="text-[10px] font-black text-[var(--color-espresso)] uppercase">₹{prod.price.toLocaleString()}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-6">
                              <div className="flex flex-col">
                                <p className="text-sm font-black text-gray-700">{prod.seller?.name || 'Unknown'}</p>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Verified Merchant</p>
                              </div>
                            </td>
                            <td className="px-10 py-6 text-right">
                              <button
                                onClick={() => toggleProductStatus(prod._id)}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition ${prod.isApproved ? "text-red-500 hover:bg-red-50" : "bg-[var(--color-espresso)] text-white hover:bg-[#2A2321] shadow-lg shadow-[var(--color-espresso)]/5"
                                  }`}
                              >
                                {prod.isApproved ? "Unlist" : "Approve"}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Settings/Catalog Tab */}
            {activeTab === "settings" && (
              <div className="space-y-8 animate-slideUp">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white/50 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h3 className="text-xl font-black text-[var(--color-espresso)] font-serif-lux">Atelier Architecture</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Manage recursive nodes and legacy synchronization</p>
                  </div>
                  <button
                    onClick={handleMigrateCategories}
                    className="px-8 py-3 bg-[var(--color-espresso)] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2A2321] transition shadow-xl shadow-[var(--color-espresso)]/5"
                  >
                    Sync & Migrate Legacy Sub-Nodes
                  </button>
                </div>
                {/* Dynamic Category Tree Architect */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-white/50">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#E8E6E1]/50 rounded-2xl flex items-center justify-center text-[var(--color-espresso)]"><FiGrid size={22} /></div>
                      <h3 className="text-2xl font-black text-[var(--color-espresso)] font-serif-lux">Atelier Tree Architect</h3>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCategory("");
                        setCategoryName("");
                        setCategoryImage(null);
                        // Add Root node flow
                        document.getElementById('node-form-modal')?.classList.remove('hidden');
                      }}
                      className="px-6 py-2.5 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-100 transition border border-green-100"
                    >
                      + Initialize Root Category
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Recursive Category Tree Rendering */}
                    {(() => {
                      const buildTree = (parentId = null) => {
                        return category
                          .filter(cat => {
                            const pId = cat.parent?._id || cat.parent;
                            return parentId === null ? !pId : String(pId) === String(parentId);
                          })
                          .map(node => ({
                            ...node,
                            children: buildTree(node._id)
                          }));
                      };

                      const treeData = buildTree();

                      const RenderNode = ({ node, depth = 0 }) => {
                        const isLeaf = node.children.length === 0;
                        return (
                          <div className="mb-2">
                            <div className={`flex items-center justify-between p-4 rounded-2xl border border-white/60 bg-gray-50/30 hover:bg-white hover:shadow-md transition-all group`} style={{ marginLeft: `${depth * 2}rem` }}>
                              <div className="flex items-center gap-3">
                                {node.image && <img src={node.image} className="w-8 h-8 rounded-lg object-cover bg-white" alt="" />}
                                <span className="text-sm font-bold text-gray-700">{node.name}</span>
                                {isLeaf && (
                                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-500 text-[8px] font-black uppercase rounded-lg tracking-widest">Leaf Node</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => {
                                    setSelectedCategory(node._id);
                                    setCategoryName("");
                                    setCategoryImage(null);
                                    document.getElementById('node-form-modal')?.classList.remove('hidden');
                                  }}
                                  title="Add Child"
                                  className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition"
                                >
                                  <FiPlus size={14} />
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedSchemaSubId(node._id);
                                    if (node.variantSchema?.length > 0) {
                                      setArchitectFields(node.variantSchema.map(f => ({ name: f.name, options: f.options.join(", ") })));
                                    } else {
                                      setArchitectFields([]);
                                    }
                                    // Scroll to Variation Architect
                                    document.getElementById('variation-architect-anchor')?.scrollIntoView({ behavior: 'smooth' });
                                  }}
                                  title="Manage Variants"
                                  className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-600 hover:text-white transition"
                                >
                                  <FiGrid size={14} />
                                </button>
                              </div>
                            </div>
                            {node.children.map(child => (
                              <RenderNode key={child._id} node={child} depth={depth + 1} />
                            ))}
                          </div>
                        );
                      };

                      return treeData.length > 0 ? (
                        treeData.map(rootNode => <RenderNode key={rootNode._id} node={rootNode} />)
                      ) : (
                        <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
                          <p className="text-xs font-black text-gray-300 uppercase tracking-[0.2em]">Architecture is currently empty.</p>
                          <p className="text-[10px] font-bold text-gray-300 mt-2 uppercase">Initialize a root node above.</p>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Unified Node Creation Modal/Overlay */}
                <div id="node-form-modal" className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm hidden flex items-center justify-center p-6">
                  <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-scaleUp">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-2xl font-black text-[var(--color-espresso)] font-serif-lux">
                        {selectedCategory ? 'Add Child Node' : 'Initialize Root Node'}
                      </h3>
                      <button onClick={() => document.getElementById('node-form-modal')?.classList.add('hidden')} className="text-gray-400 hover:text-gray-600 transition">
                        <FiX size={24} />
                      </button>
                    </div>

                    <div className="space-y-6">
                      {selectedCategory && (
                        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                          <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Parent Association</p>
                          <p className="text-xs font-bold text-indigo-600">{category.find(c => c._id === selectedCategory)?.name}</p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Node Descriptor</label>
                        <input
                          type="text"
                          placeholder="Enter node name (e.g. Shirts, Cotton...)"
                          value={selectedCategory ? subCategoryName : categoryName}
                          onChange={(e) => selectedCategory ? setSubCategoryName(e.target.value) : setCategoryName(e.target.value)}
                          className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none transition"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Node Visual Identity</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => selectedCategory ? setSubCategoryImage(e.target.files[0]) : setCategoryImage(e.target.files[0])}
                          className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white file:text-[var(--color-espresso)] hover:file:bg-indigo-50 cursor-pointer"
                        />
                      </div>

                      <button
                        onClick={async () => {
                          await handleAddCategoryUnified(!!selectedCategory);
                          document.getElementById('node-form-modal')?.classList.add('hidden');
                          setSelectedCategory("");
                          setSubCategoryName("");
                          setCategoryName("");
                        }}
                        className="w-full bg-[var(--color-espresso)] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#2A2321] shadow-xl shadow-[var(--color-espresso)]/5 transition mt-4"
                      >
                        Materialize Node
                      </button>
                    </div>
                  </div>
                </div>

                <div id="variation-architect-anchor" className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-white/50">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-[#E8E6E1]/50 rounded-2xl flex items-center justify-center text-[var(--color-espresso)]"><FiList size={22} /></div>
                    <h3 className="text-2xl font-black text-[var(--color-espresso)] font-serif-lux">Variation Architect</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Step 1 — Confirm Target Node</label>
                      <div className="w-full bg-gray-50 rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-espresso)] border border-white flex items-center justify-between">
                        <span>{selectedSchemaSubId ? category.find(c => c._id === selectedSchemaSubId)?.name : "No node selected (Pick from Tree above)"}</span>
                        {selectedSchemaSubId && <FiCheckCircle className="text-green-500" />}
                      </div>
                    </div>

                    {selectedSchemaSubId && (
                      <div className="px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-[11px] font-bold text-indigo-600">
                        Registry unlocked for leaf node. Add or edit fields below.
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Registry Definition</label>
                        <button
                          onClick={handleAddField}
                          className="bg-[#E8E6E1]/50 text-[var(--color-espresso)] px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-100 transition"
                        >
                          + Add Field
                        </button>
                      </div>

                      {architectFields.map((field, idx) => (
                        <div key={idx} className="p-6 bg-white/40 rounded-2xl border border-white space-y-4 relative">
                          <button
                            onClick={() => handleRemoveField(idx)}
                            className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition"
                          >
                            <FiXCircle size={16} />
                          </button>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Descriptor (e.g. Color)</label>
                            <input
                              type="text"
                              placeholder="Enter descriptor..."
                              value={field.name}
                              onChange={(e) => handleFieldChange(idx, "name", e.target.value)}
                              className="w-full bg-white border-none rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-indigo-100 outline-none transition"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Permitted Options (comma separated)</label>
                            <input
                              type="text"
                              placeholder="Value A, Value B..."
                              value={field.options}
                              onChange={(e) => handleFieldChange(idx, "options", e.target.value)}
                              className="w-full bg-white border-none rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-indigo-100 outline-none transition"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <button onClick={handleUpdateSchema} className="w-full bg-[var(--color-espresso)] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#2A2321] shadow-xl shadow-[var(--color-espresso)]/5 transition">
                      Seal Registry Schema
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
