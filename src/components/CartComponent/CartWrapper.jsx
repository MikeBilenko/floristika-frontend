import React, { useEffect, useState } from "react";
import "./CartWrapper.scss";
import Title from "../../ui/Title/Title";
import CartItem from "./CartItem";
import Button from "../../ui/Button/Button";
import CartCarousel from "./CartCarousel";
import Product from "../../ui/Product/Product";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import SubTitle from "../../ui/SubTitle/SubTitle";

const CartWrapper = () => {
  const navigate = useNavigate();
  const { items, totalAmount, totalAuthenticatedAmount, productsNumber } =
    useSelector((state) => state.cart);
  const token = useSelector((state) => state.auth.token);

  return (
    <>
      <Title>{t("cart.cart").toUpperCase()}</Title>
      <Link to={"/"} className="back-to-shop-link">
        {t("cart.back_to_shop")}
      </Link>

      {productsNumber > 0 && (
        <div classNames="cart-products-list">
          <div className="cart-products-list-title">
            <div>{t("cart.product")}</div>
            <div className="price">{t("cart.price")}</div>
            <div className="quantity">{t("cart.quantity")}</div>
            <div>{t("cart.total")}</div>
          </div>
          {items &&
            items.length > 0 &&
            items.map((item) => <CartItem cartItem={item} />)}
        </div>
      )}
      {productsNumber <= 0 && <SubTitle>{t("cart.empty_cart")}</SubTitle>}
      {productsNumber > 0 && (
        <div className="cart-total-container">
          <div className="cart-total">
            <div className="cart-total-total">
              <div>{t("cart.sub_total")}</div>
              <span>
                €
                {token
                  ? totalAuthenticatedAmount.toFixed(2)
                  : totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="cart-total-info">{t("cart.tax_calc")}</div>
            <Button
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/cart/checkout/`);
              }}
            >
              {t("buttons.checkout")}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default CartWrapper;
