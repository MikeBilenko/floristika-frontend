import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import Product from "../../Pages/Products/Product";
import Products from "../../Pages/Products/Products";
import NotFound from "Pages/NotFound";

const ProductRouting = () => {
  return (
    <div>
      <Routes>
        <Route path="/*" element={<Products />} />
        <Route path="/:category/*" element={<Products />} />
        <Route path="/:category/:subcategory/*" element={<Products />} />
        <Route path=":category/:subcategory/:slug/" element={<Product />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default ProductRouting;
