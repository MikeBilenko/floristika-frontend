import React from "react";
import "./Overlay.scss"; // Assuming you have a separate SCSS file for styling
import { useSelector, useDispatch } from "react-redux";
import { toggleCart } from "../../redux/slices/cartSlice";

const Overlay = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.isVisible);

  return (
    <div
      className={`overlay ${cart ? "active" : ""}`}
      onClick={() => dispatch(toggleCart())}
    ></div>
  );
};

export default Overlay;
