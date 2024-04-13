import React, { useState, useEffect } from "react";
import "./CartWrapper.scss";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
import { selectToken } from "../../redux/slices/authSlice";
import { updateQuantity, removeFromCart } from "../../redux/slices/cartSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

const CartItem = ({ cartItem }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  console.log(cartItem);
  const [wishlist, setWishlist] = useState(false);

  const addToWishlist = (slug) => {
    if (token && !wishlist) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/users/wishlist/${slug}/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 201 || response.status === 200) {
            toast.success(t("messages.success.wishlist.add"));
            setWishlist(true);
          }
        });
    }
  };

  const removeFromWishlist = (slug) => {
    if (token && wishlist) {
      axios
        .delete(`${process.env.REACT_APP_API_URL}/users/wishlist/${slug}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 204) {
            setWishlist(false);
            toast.success(t("messages.success.wishlist.remove"));
          }
        });
    }
  };

  useEffect(() => {
    if (token) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/users/wishlist/${cartItem.slug}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.data) {
            setWishlist(true);
          }
        });
    }
  }, [token]);

  return (
    <div className="cart-products-list-item">
      <div className="cart-products-list-item-intro">
        <img src={cartItem.images[0].image} alt={cartItem.images[0].alt} />
        <div className="cart-products-list-item-intro-name">
          <div>
            {i18n.language === "en" && cartItem.name}
            {i18n.language === "ru" && cartItem.name_ru}
            {i18n.language === "lv" && cartItem.name_lv}
          </div>

          <div className="cart-products-list-item-qty">
            <div
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
            <span>{cartItem.quantity}</span>
            <div
              className="available"
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

          {!token && <div className="cart-item-wishlist"></div>}
          {token && (
            <div
              className="cart-item-wishlist"
              onClick={() =>
                wishlist
                  ? removeFromWishlist(cartItem.slug)
                  : addToWishlist(cartItem.slug)
              }
            >
              {wishlist ? <IoMdHeart /> : <IoIosHeartEmpty />}
            </div>
          )}
        </div>
      </div>
      <div className="cart-products-list-item-price">
        €
        {!token
          ? cartItem.price.toFixed(2)
          : (
              cartItem.price -
              (cartItem.price * cartItem.auth_percent.percent) / 100
            ).toFixed(2)}
      </div>
      <div className="cart-products-list-item-qty">
        <div
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
        <span>{cartItem.quantity}</span>
        <div
          className="available"
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
      <div className="cart-products-list-item-total">
        €
        {!token
          ? (cartItem.quantity * cartItem.price).toFixed(2)
          : (
              (cartItem.price -
                (cartItem.price * cartItem.auth_percent.percent) / 100) *
              cartItem.quantity
            ).toFixed(2)}
        <IoTrashOutline
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
  );
};

export default CartItem;
