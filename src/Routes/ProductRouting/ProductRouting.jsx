import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import Product from "../../Pages/Products/Product";
import Products from "../../Pages/Products/Products";

const ProductRouting = () => {
  return (
    <div>
      <Routes>
        <Route path="/*" element={<Products />} />
        <Route path="/:category/*" element={<Products />} />
        <Route path="/:category/:type/*" element={<Products />} />
        <Route path=":category/:type/:slug/" element={<Product />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default ProductRouting;
