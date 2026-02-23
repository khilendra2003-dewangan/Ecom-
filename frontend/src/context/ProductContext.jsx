import React, { createContext, useContext, useState } from "react";
import API from "../api/api";

const ProductContext = createContext();

export const ProductContextProvider = ({ children }) => {
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [product, setProduct] = useState([]);

  const CreateCategory = async (form) => {
    const { data } = await API.post("/create/category", form);
    setCategory((prev) => [...prev, data]);
    return data;
  };

  const MigrateCategories = async () => {
    const { data } = await API.post("/migrate-categories");
    await fetchCategory();
    return data;
  };

  // Create SubCategory
  const CreateSubCategory = async (form) => {
    const { data } = await API.post("/create/subcategory", form);
    setSubCategory((prev) => [...prev, data]);
  };

  // Fetch Categories
  const fetchCategory = async () => {

    const { data } = await API.get("/getcategory");
    setCategory(data);

  };
  const fetchSubCategories = async () => {
    const { data } = await API.get(`/getSubCategory`);
    setSubCategory(data);
  };

  const fetchSubCategoriesById = async (categoryId) => {
    const { data } = await API.get(`/getSubCategorybyid/${categoryId}`);
    setSubCategory(data);
  };

  const UpdateSubCategorySchema = async (id, variantSchema) => {
    console.log("Frontend sending UpdateSubCategorySchema:", { id, variantSchema });
    const { data } = await API.put(`/update/subcategory-schema/${id}`, { variantSchema });
    console.log("Frontend received UpdateSubCategorySchema response:", data);
    setSubCategory((prev) => prev.map((sub) => (sub._id === id ? data : sub)));
  };

  // Fetch Products
  const fetchProduct = async () => {
    const { data } = await API.get("/getproduct");
    setProduct(data);
  };


  return (
    <ProductContext.Provider
      value={{
        category,
        subCategory,
        product,
        fetchCategory,
        fetchProduct,
        CreateCategory,
        CreateSubCategory,
        fetchSubCategories,
        fetchSubCategoriesById,
        UpdateSubCategorySchema,
        MigrateCategories,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
