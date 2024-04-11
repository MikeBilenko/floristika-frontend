import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import { selectUser } from "../../redux/slices/authSlice";
import Cart from "../../Pages/Cart/Cart";
import Checkout from "../../Pages/Cart/Checkout";
import CheckoutConfirm from "../../Pages/Cart/CheckoutConfirm";
import CheckoutSuccess from "../../components/Checkout/CheckoutSuccess/CheckoutSuccess";

const CartRouting = () => {
  return (
    <div>
      <Routes>
        <Route path="/*" element={<Cart />} />
        <Route path="/checkout/" element={<Checkout />} />
        <Route path="/checkout/confirm/" element={<CheckoutConfirm />} />
        <Route
          path="/checkout/confirm/success/:number/"
          element={<CheckoutSuccess />}
        />
      </Routes>
      <Outlet />
    </div>
  );
};

export default CartRouting;
