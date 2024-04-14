import React, { useState } from "react";
import "./MiniCart.scss";
import { LuTrash2 } from "react-icons/lu";
import Button from "../../ui/Button/Button";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectToken } from "../../redux/slices/authSlice";
import { removeFromCart, updateQuantity } from "../../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const MiniCartItem = ({ cartItem }) => {
  const { t, i18n } = useTranslation();
  const [counter, setCounter] = useState(1);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();

  return (
    <div className="minicart-item">
      <img src={cartItem.images[0].image} alt={cartItem.images[0].alt} />
      <div className="minicart-item-content">
        <div className="minicart-product-name">
          <div className="name">
            {i18n.language === "en" && cartItem.name.toUpperCase()}
            {i18n.language === "lv" && cartItem.name_lv.toUpperCase()}
            {i18n.language === "ru" && cartItem.name_ru.toUpperCase()}
            <div className="sale">
              {cartItem.sale && (
                <span className="sale">
                  {t("categories.sale").toUpperCase()} -{cartItem.sale}%
                </span>
              )}
            </div>
          </div>
          <div className={`price ${!token ? "declined" : ""}`}>
            <div>
              €{token ? cartItem.price_for_authenticated : cartItem.price}
            </div>
            {!token && <div>€{cartItem.price_for_authenticated}</div>}
          </div>
        </div>
        <div className="minicart-product-actions">
          <div className="counter">
            <div
              className="action"
              onClick={() =>
                cartItem.quantity > 0 &&
                dispatch(
                  updateQuantity({
                    slug: cartItem.slug,
                    quantity: cartItem.quantity - 1,
                    token: token,
                  })
                )
              }
            >
              -
            </div>
            <div className="number">{cartItem.quantity}</div>
            <div
              className="action"
              onClick={() =>
                cartItem.quantity < cartItem.qty &&
                dispatch(
                  updateQuantity({
                    slug: cartItem.slug,
                    quantity: cartItem.quantity + 1,
                    token: token,
                  })
                )
              }
            >
              +
            </div>
          </div>
          <LuTrash2
            onClick={() => {
              dispatch(
                removeFromCart({
                  product: cartItem,
                  qty: cartItem.quantity,
                  token,
                })
              );
              toast.success(t("messages.success.cart.remove"));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MiniCartItem;
