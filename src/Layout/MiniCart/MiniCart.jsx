import React, { useEffect } from "react";
import "./MiniCart.scss";
import { LuShoppingCart, LuX } from "react-icons/lu";
import Button from "../../ui/Button/Button";
import { Link } from "react-router-dom";
import MiniCartItem from "./MiniCartItem";
import { useSelector, useDispatch } from "react-redux";
import { closeMenu, fetchCartItems } from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MiniCart = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isVisible = useSelector((state) => state.cart.isVisible);
  const token = useSelector((state) => state.auth.token);
  const { items, productsNumber } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      if (token) {
        dispatch(fetchCartItems({ token: token }));
      }
    }, 1000);
  }, [token]);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.removeAttribute("style");
    }
  }, [isVisible]);

  return (
    <div className={`minicart ${isVisible ? "active" : ""} `}>
      <div className="minicart-wrapper">
        <header className="minicart-header">
          <div className="minicart-header-items">
            <LuShoppingCart />
            <span>
              {productsNumber}{" "}
              {productsNumber === 1 ? t("cart.item") : t("cart.items")}
            </span>
          </div>
          <LuX onClick={() => dispatch(closeMenu())} />
        </header>
        <div className="line"></div>
        <div className="minicart-content">
          {items &&
            items.length > 0 &&
            items.map((item) => (
              <MiniCartItem
                cartItem={item}
                key={`minicart_item_${item.slug}`}
              />
            ))}
        </div>
        <footer className="minicart-footer">
          {t("cart.tax_calc")}
          <div className="cart-buttons">
            {items.length > 0 && (
              <Button
                disabled={!items}
                onClick={() => {
                  if (items.length > 0) {
                    navigate(`/cart/checkout/`);
                    dispatch(closeMenu());
                  }
                }}
              >
                {t("buttons.checkout")}
              </Button>
            )}
            <Link to={`/cart/`} onClick={() => dispatch(closeMenu())}>
              {t("buttons.view_cart")}
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MiniCart;
