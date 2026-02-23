import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./context/userContext.jsx";
import { ProductContextProvider } from "./context/ProductContext.jsx";
import { SellerProvider } from "./context/SellerContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <UserContextProvider>

      <CartProvider>
        <ProductContextProvider>
<SellerProvider>

        <App />
</SellerProvider>
        </ProductContextProvider>
      </CartProvider>
    </UserContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
