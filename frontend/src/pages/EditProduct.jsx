import React, { useEffect, useState } from "react";
import { useSeller } from "../context/SellerContext";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../context/ProductContext";
import API from "../api/api";

const EditProduct = () => {
    const { updateProduct } = useSeller();
    const { fetchCategory, category, subCategory, fetchSubCategoriesById } = useProduct();
    const { id } = useParams();
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
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchCategory();
                const { data } = await API.get(`/getproduct/${id}`);
                setForm({
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    discountPrice: data.discountPrice || "",
                    stock: data.stock,
                    category: data.category?._id || data.category,
                    subCategory: data.subCategory?._id || data.subCategory,
                    isActive: data.isActive,
                    images: [], // Reset images for new upload
                });
                if (data.category) {
                    fetchSubCategoriesById(data.category._id || data.category);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

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
        await updateProduct(id, form);
        navigate("/sellerdashboard");
    };

    if (loading) return <div className="text-center mt-20">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-10">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-3xl"
            >
                <h2 className="text-3xl font-bold mb-8 text-center">Edit Product</h2>

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

                    {/* Category */}
                    <div>
                        <label className="block mb-1 font-medium">Category</label>
                        <select
                            className="w-full border px-4 py-2 rounded-lg"
                            value={form.category}
                            onChange={handleCategoryChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {category?.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* SubCategory */}
                    <div>
                        <label className="block mb-1 font-medium">SubCategory</label>
                        <select
                            className="w-full border px-4 py-2 rounded-lg"
                            value={form.subCategory}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    subCategory: e.target.value,
                                })
                            }
                            required
                        >
                            <option value="">Select SubCategory</option>
                            {subCategory?.map((sub) => (
                                <option key={sub._id} value={sub._id}>
                                    {sub.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Images */}
                    <div className="col-span-2">
                        <label className="block mb-1 font-medium">Product Images (Leave blank to keep current)</label>
                        <input
                            type="file"
                            multiple
                            className="w-full"
                            onChange={handleImageChange}
                        />
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

                <button className="w-full mt-8 bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition">
                    Update Product
                </button>
            </form>
        </div>
    );
};

export default EditProduct;
