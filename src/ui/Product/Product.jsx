import React, { useEffect, useState } from "react";
import "./Product.scss";
import Button from "../Button/Button";
import { HiHeart, HiOutlineHeart } from "react-icons/hi2";
import { useNavigate } from "react-router";
import { FiUser } from "react-icons/fi";
import { IoInformationCircle } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, selectToken } from "../../redux/slices/authSlice";
import { addToCart, removeFromCart } from "../../redux/slices/cartSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Product = ({ product, setProducts = null }) => {
  const [inCart, setInCart] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const navigate = useNavigate();
  const link = `/products/${product.category.slug}/${product.subcategory.slug}/${product.slug}/`;
  const product_discount = product.price - (product.price * product.sale) / 100;
  const auth_price = product.price_for_authenticated;
  const auth_price_discount = (auth_price * product.sale) / 100;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const cart = useSelector((state) => state.cart.items);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (
      cart &&
      cart.length > 0 &&
      cart.filter((item) => item.slug === product.slug).length > 0
    ) {
      setInCart(true);
    } else {
      setInCart(false);
    }
  }, [cart, product, product.slug]);

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
        })
        .catch((data) => {
          if (data.response.status === 401) {
            console.log("Authenticate");
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
            if (setProducts !== null) {
              setProducts((prevProducts) => {
                return [
                  ...prevProducts.filter((product) => product.slug !== slug),
                ];
              });
            }
          }
        });
    }
  };

  useEffect(() => {
    if (token) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/users/wishlist/${product.slug}/`,
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
        })
        .catch((data) => {
          if (data.response.status === 401) {
            setWishlist(false);
            console.log("Authenticate");
          }
        });
    }
  }, [token, product.slug]);

  return (
    <div
      className="product"
      onClick={() => {
        navigate(link, { replace: true });
        window.location.reload();
      }}
    >
      <div className="product-top-section">
        <img src={product.images[0].image} alt={product.images[0].alt} />
        {product.sale && (
          <div className="product-sale">
            {t("save")} {product.sale}%
          </div>
        )}

        <div className="product-hover">
          {!user && <div></div>}
          {user && (
            <div
              className="product-add-wishlist"
              onClick={(e) => {
                e.stopPropagation();
                if (!wishlist) {
                  addToWishlist(product.slug);
                } else {
                  removeFromWishlist(product.slug);
                }
              }}
            >
              {!wishlist && <HiOutlineHeart />}
              {wishlist && <HiHeart />}
            </div>
          )}
          <Button
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              if (!inCart) {
                dispatch(addToCart({ product, qty: 1, token }));
                toast.success(t("messages.success.cart.add"));
              } else {
                dispatch(removeFromCart({ product, token }));
                toast.success(t("messages.success.cart.remove"));
              }
            }}
          >
            {!inCart ? t("cart.add_to_cart") : t("cart.remove_from_cart")}
          </Button>
        </div>
      </div>
      <div className="product-bottom-section">
        <h4 className="product-title">
          {i18n.language === "en" && product.name}
          {i18n.language === "lv" && product.name_lv}
          {i18n.language === "ru" && product.name_ru}
        </h4>
        {!user && (
          <h3 className="product-price">
            <span className={`first-price ${product.sale ? "sale" : ""}`}>
              €{product.price}
            </span>
            {product.sale && (
              <span className="sale-price">€{product_discount.toFixed(2)}</span>
            )}
          </h3>
        )}
        <h3
          className={`product-price-for-customers ${
            user ? "product-price" : ""
          }`}
        >
          <FiUser className="user-icon-helper" />
          {user && (
            <div className="small-helper">{t("product.for_registered")}</div>
          )}
          <span className={`${product.sale ? "sale" : ""}`}>€{auth_price}</span>
          {product.sale && (
            <span className="sale-price">
              €{(auth_price - auth_price_discount).toFixed(2)}
            </span>
          )}
          {!user && (
            <div className="info-message">
              <IoInformationCircle className="info" />
              <div className="helper-message">{t("product.lower_price")}</div>
            </div>
          )}
        </h3>
      </div>
    </div>
  );
};

export default Product;
