import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import ProductDetails from "./pages/ProductDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AdminDashboard from "./pages/AdminDashboard";
import SellerDashboard from "./pages/SellerDeshboard";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";

const App = () => {
  return (
    <div>
      <Routes>
        <Route>
          <Route path="/" element={<Layout></Layout>}>
            <Route index element={<Home></Home>}></Route>
            <Route path="/product" element={<Product />}></Route>

            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart></Cart>
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/order"
              element={
                <ProtectedRoute>
                  <Order></Order>
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            ></Route>

            <Route
              path="/product/:id"
              element={<ProductDetails></ProductDetails>}
            ></Route>
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            ></Route>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            ></Route>

            <Route
              path="/admindashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/sellerdashboard"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <SellerDashboard />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/addproduct"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <AddProduct />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/edit-product/:id"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <EditProduct />
                </ProtectedRoute>
              }
            ></Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
