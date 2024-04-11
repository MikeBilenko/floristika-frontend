import React, { useState, useEffect } from "react";
import "./ProductIntro.scss";
import ProductGallery from "../ProductGallery/ProductGallery";
import { PiShareFatLight } from "react-icons/pi";
import { GoHeartFill, GoHeart } from "react-icons/go";
import { TbTruckDelivery, TbFileDescription } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import Rating from "../../../ui/Rating/Rating";
import Button from "../../../ui/Button/Button";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, selectToken } from "../../../redux/slices/authSlice";
import { addToCart, removeFromCart } from "../../../redux/slices/cartSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { FiUser } from "react-icons/fi";

const ProductIntro = ({
  product,
  name,
  name_lv,
  name_ru,
  images,
  qty,
  slug,
  rate,
  price,
  reviews,
}) => {
  const [productDiscount, setProductDiscount] = useState(0);
  const [authPrice, setAuthPrice] = useState(0);
  const [authPriceDiscount, setAuthPriceDiscount] = useState(0);
  const [inCart, setInCart] = useState(false);
  const cart = useSelector((state) => state.cart.items);
  const { i18n, t } = useTranslation();
  const [wishlist, setWishlist] = useState(false);
  const user = useSelector(selectUser);
  const [selectedQty, setSelectedQTY] = useState(1);
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  useEffect(() => {
    if (
      cart &&
      cart.length > 0 &&
      cart.filter((item) => item.slug === slug).length > 0
    ) {
      setInCart(true);
    } else {
      setInCart(false);
    }
  }, [cart, product]);
  useEffect(() => {
    if (product.name) {
      const product_discount = price - (price * product.sale_percent) / 100;
      const auth_price = price - (price * product.auth_percent.percent) / 100;
      const auth_price_discount =
        auth_price - (auth_price * product.sale_percent) / 100;
      setProductDiscount(product_discount);
      setAuthPrice(auth_price);
      setAuthPriceDiscount(auth_price_discount);
    }
  }, [product]);

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
        .catch((e) => {
          if (e.response.data === 401) {
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
          }
        });
    }
  };

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/users/wishlist/${slug}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data) {
            setWishlist(true);
          }
        });
    }
  }, [token, product, slug]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success(t("messages.success.copying_url"));
    });
  };
  return (
    <div className="product-intro">
      <ProductGallery images={images} />
      <div className="product-info">
        <div className="product-info-title">
          <div>
            {i18n.language === "en" && name}
            {i18n.language === "lv" && name_lv}
            {i18n.language === "ru" && name_ru}
          </div>
          <PiShareFatLight onClick={handleCopyUrl} />
        </div>
        <div className="product-info-price">
          <div className="price">
            {!user && <div>€{price}</div>}
            <div>
              <FiUser />€{authPrice}
            </div>
          </div>

          {product.sale && (
            <div className="sale">
              {`${t("categories.sale")}! ${t("save")} ${
                product.sale_percent
              }:%`}
              <div className="price">
                {!user && <div>€{productDiscount}</div>}
                <div>
                  <FiUser />€{authPriceDiscount}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* rating */}
        <div className="product-info-rating">
          <Rating rating={rate} />
          <span>
            {rate ? parseInt(rate) : 0.0}. ({reviews})
          </span>
        </div>
        {/* new here */}
        {!user && (
          <div className="product-info-new-here">
            <div>
              <span>{t("product.new_here_1")}</span>
              {t("product.new_here_2")}
            </div>
            <Button
              outlined
              fullWidth
              onClick={() => navigate("/accounts/register/")}
            >
              {t("auth.register")}
            </Button>
          </div>
        )}
        {/* qty */}
        {!inCart && (
          <div className="product-info-qty">
            <div className="product-info-qty-name">
              {t("product.quantity")}:
            </div>
            <div className="product-info-qty-qty">
              <div
                onClick={() =>
                  selectedQty > 1 && setSelectedQTY(selectedQty - 1)
                }
              >
                -
              </div>
              <span>{selectedQty}</span>
              <div
                className="available"
                onClick={() =>
                  selectedQty < qty && setSelectedQTY(selectedQty + 1)
                }
              >
                +
              </div>
            </div>
          </div>
        )}
        {/* actions */}
        <div className="product-info-actions">
          <Button
            fullWidth
            onClick={() => {
              if (!inCart) {
                dispatch(addToCart({ product, qty: selectedQty, token }));
                toast.success(t("messages.success.cart.add"));
              } else {
                dispatch(removeFromCart({ product, token }));
                toast.success(t("messages.success.cart.remove"));
              }
            }}
          >
            {!inCart ? t("cart.add_to_cart") : t("cart.remove_from_cart")}
          </Button>
          {user && (
            <div
              onClick={() => {
                if (wishlist) {
                  removeFromWishlist(slug);
                } else {
                  addToWishlist(slug);
                }
              }}
            >
              {!wishlist && <GoHeart />}
              {wishlist && <GoHeartFill />}
            </div>
          )}
        </div>
        {/* delivery */}
        <div className="product-info-delivery">
          <div>
            <TbTruckDelivery />
            {t("product.free_delivery")}
          </div>
          <div>
            <TbFileDescription />
            <Link to="/policies/return-and-delivery/">
              {t("product.return")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductIntro;
