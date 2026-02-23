import React, { useEffect, useState } from "react";
import { useSeller } from "../context/SellerContext";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../context/ProductContext";
import { FiCheckCircle, FiImage } from "react-icons/fi";

const AddProduct = () => {
  const {
    createProduct
  } = useSeller();
  const { fetchCategory, category, subCategory, fetchSubCategoriesById } = useProduct();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    category: "",
    subCategory: "",
    images: [],
    isActive: true,
    variants: [],
  });

  const [selectedSubObj, setSelectedSubObj] = useState(null);
  const [selectedPath, setSelectedPath] = useState([]); // Dynamic path of selected category IDs
  const [currentVariantOptions, setCurrentVariantOptions] = useState({});
  const [variantStock, setVariantStock] = useState("");
  const [variantImageFile, setVariantImageFile] = useState(null);

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleAddVariant = () => {
    // Check if all schema fields are selected
    const requiredFields = selectedSubObj?.variantSchema?.map(f => f.name) || [];
    const missingFields = requiredFields.filter(f => !currentVariantOptions[f]);

    if (!variantStock || missingFields.length > 0) {
      return alert("Please select all variation options and enter stock");
    }

    const newVariant = {
      options: { ...currentVariantOptions },
      stock: Number(variantStock),
      imageFile: variantImageFile,
      imagePreview: variantImageFile ? URL.createObjectURL(variantImageFile) : null,
    };

    const updatedVariants = [...(form.variants || []), newVariant];
    const newTotalStock = updatedVariants.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0);

    setForm({
      ...form,
      variants: updatedVariants,
      stock: newTotalStock,
    });

    // Reset inputs
    setCurrentVariantOptions({});
    setVariantStock("");
    setVariantImageFile(null);
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setForm({ ...form, category: categoryId, subCategory: "" });
    fetchSubCategoriesById(categoryId);
  };

  const handleImageChange = (e) => {
    setForm({ ...form, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProduct(form);
    navigate("/sellerdashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-3xl"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Add New Product</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="col-span-2">
            <label className="block mb-1 font-medium">Product Name</label>
            <input
              type="text"
              className="w-full border px-4 py-2 rounded-lg"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              rows="3"
              className="w-full border px-4 py-2 rounded-lg"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input
              type="number"
              className="w-full border px-4 py-2 rounded-lg"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>

          {/* Discount Price */}
          <div>
            <label className="block mb-1 font-medium">Discount Price</label>
            <input
              type="number"
              className="w-full border px-4 py-2 rounded-lg"
              value={form.discountPrice}
              onChange={(e) =>
                setForm({
                  ...form,
                  discountPrice: e.target.value,
                })
              }
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block mb-1 font-medium">Stock</label>
            <input
              type="number"
              className="w-full border px-4 py-2 rounded-lg"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
            />
          </div>

          {/* Dynamic Multi-Level Category Selection */}
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-1.5 h-6 bg-[var(--color-espresso)] rounded-full"></span>
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Catalog Path Registry</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Recursive Level Selectors */}
              {(() => {
                const selectors = [];
                // Level 1: Roots
                selectors.push(
                  <div key="level-0" className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Level 1: Domain</label>
                    <select
                      className="w-full bg-gray-50 border border-white rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-indigo-100 outline-none appearance-none"
                      value={selectedPath[0] || ""}
                      onChange={(e) => {
                        const id = e.target.value;
                        const newPath = id ? [id] : [];
                        setSelectedPath(newPath);
                        const cat = category.find(c => c._id === id);
                        setForm({ ...form, category: id, subCategory: id, variants: [] });
                        setSelectedSubObj(cat);
                      }}
                      required
                    >
                      <option value="">Select Domain...</option>
                      {category?.filter(cat => !cat.parent).map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                );

                // Levels 2+ based on selectedPath
                selectedPath.forEach((parentId, index) => {
                  const children = category.filter(c => String(c.parent?._id || c.parent) === parentId);
                  if (children.length > 0) {
                    selectors.push(
                      <div key={`level-${index + 1}`} className="space-y-2 animate-fadeIn">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Level {index + 2}: Specialization</label>
                        <select
                          className="w-full bg-gray-50 border border-white rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-indigo-100 outline-none appearance-none"
                          value={selectedPath[index + 1] || ""}
                          onChange={(e) => {
                            const id = e.target.value;
                            const newPath = selectedPath.slice(0, index + 1);
                            if (id) newPath.push(id);
                            setSelectedPath(newPath);
                            const cat = category.find(c => c._id === id);
                            setForm({ ...form, subCategory: id, variants: [] });
                            setSelectedSubObj(cat);
                          }}
                        >
                          <option value="">Select Branch...</option>
                          {children.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                });

                return selectors;
              })()}
            </div>

            {/* Visual Indicator of Selected Node */}
            {selectedSubObj && (
              <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center justify-between animate-fadeIn">
                <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em]">Target Node Synchronized: {selectedSubObj.name}</p>
                {selectedSubObj.variantSchema?.length > 0 && (
                  <p className="text-[8px] font-bold text-green-500 uppercase">Variants Unlocked</p>
                )}
              </div>
            )}
          </div>

          {/* Variant Management Section */}
          {selectedSubObj?.variantSchema?.length > 0 && (
            <div className="col-span-2 bg-indigo-50/50 p-8 rounded-[2rem] border border-indigo-100 mt-6 animate-fadeIn">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Variation Registry</h3>
              </div>

              {/* Variant Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {selectedSubObj.variantSchema.map((field) => (
                  <div key={field.name}>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{field.name}</label>
                    <select
                      className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-indigo-100 outline-none appearance-none"
                      value={currentVariantOptions[field.name] || ""}
                      onChange={(e) => setCurrentVariantOptions({ ...currentVariantOptions, [field.name]: e.target.value })}
                    >
                      <option value="">Select {field.name}...</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Stock Units</label>
                  <input
                    type="number"
                    className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-indigo-100 outline-none"
                    placeholder="Enter stock..."
                    value={variantStock}
                    onChange={(e) => setVariantStock(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Variation Visual (Optional)</label>
                  <div className="flex items-center gap-4">
                    <div className="shrink-0">
                      {variantImageFile ? (
                        <img
                          src={URL.createObjectURL(variantImageFile)}
                          className="w-16 h-16 rounded-xl object-cover border border-indigo-100 shadow-sm"
                          alt="Preview"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-white border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-200">
                          <FiImage size={20} />
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      onChange={(e) => setVariantImageFile(e.target.files[0])}
                      className="text-[10px] font-bold text-indigo-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddVariant}
                className="w-full py-4 bg-white border-2 border-dashed border-indigo-200 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition duration-300"
              >
                + Register Variation Pair
              </button>

              {/* Variations Table */}
              {form.variants?.length > 0 && (
                <div className="mt-8 overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-indigo-50/30">
                      <tr>
                        <th className="px-6 py-4 text-[8px] font-black text-indigo-400 uppercase tracking-widest">Preview</th>
                        <th className="px-6 py-4 text-[8px] font-black text-indigo-400 uppercase tracking-widest">Configuration</th>
                        <th className="px-6 py-4 text-[8px] font-black text-indigo-400 uppercase tracking-widest text-center">Batch Stock</th>
                        <th className="px-6 py-4 text-[8px] font-black text-indigo-400 uppercase tracking-widest text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-50">
                      {form.variants.map((v, idx) => (
                        <tr key={idx} className="hover:bg-indigo-50/10 transition">
                          <td className="px-6 py-4">
                            {v.imagePreview ? (
                              <img src={v.imagePreview} className="w-10 h-10 rounded-lg object-cover" alt="v" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300">
                                <FiImage size={14} />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(v.options).map(([key, val]) => (
                                <span key={key} className="px-2 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-600 uppercase">
                                  {key}: {val}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-xs font-black text-indigo-600">{v.stock}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                const newVariants = form.variants.filter((_, i) => i !== idx);
                                setForm({
                                  ...form,
                                  variants: newVariants,
                                  stock: newVariants.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0)
                                });
                              }}
                              className="text-red-500 hover:text-red-700 transition"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Images */}
          <div className="col-span-2 mt-4">
            <label className="block mb-2 font-medium">Product Visuals</label>
            <div className="p-10 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 flex flex-col items-center justify-center text-center group hover:border-indigo-200 hover:bg-indigo-50/30 transition duration-500 cursor-pointer relative overflow-hidden">
              <input
                type="file"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={handleImageChange}
              />
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition duration-500">
                <FiCheckCircle className="text-indigo-600" size={24} />
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Deploy Product Imagery</p>
              <p className="text-[10px] font-bold text-gray-300 mt-1 uppercase tracking-tighter">Support Multi-upload sequence</p>
            </div>
          </div>

          {/* Active Toggle */}
          <div className="col-span-2 flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm({
                  ...form,
                  isActive: e.target.checked,
                })
              }
            />
            <label>Product is Active</label>
          </div>
        </div>

        <button className="w-full mt-8 bg-green-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-green-700 transition">
          Create Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
