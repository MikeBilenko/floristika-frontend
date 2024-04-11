import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleCart } from "../../../redux/slices/cartSlice";
import "./CheckoutWrapper.scss";
import { selectToken } from "../../../redux/slices/authSlice";
import Title from "../../../ui/Title/Title";
import Button from "../../../ui/Button/Button";
import { useNavigate } from "react-router-dom";
import Input from "../../../ui/Input/Input";

const CheckoutWrapper = () => {
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const { productsNumber } = useSelector((state) => state.cart);

  useEffect(() => {
    if (productsNumber <= 0) {
      navigate("/cart/");
    }
    if (token) {
      navigate("/cart/checkout/confirm/");
    }
  }, [token, productsNumber]);

  return (
    <div>
      <Title>Checkout</Title>
      <div className="continue-guest">
        <img src="/logo.svg" alt="" />
        <p>Please login to continue to checkout or continue as a guest.</p>
        <Button outlined fullWidth onClick={() => navigate(`/accounts/login/`)}>
          LOGIN
        </Button>
        <Button
          fullWidth
          onClick={() => {
            navigate("/cart/checkout/confirm/");
          }}
        >
          CONTINUE AS A GUEST
        </Button>
      </div>
    </div>
  );
};

export default CheckoutWrapper;
