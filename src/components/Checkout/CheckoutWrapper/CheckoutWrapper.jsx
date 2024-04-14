import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import "./CheckoutWrapper.scss";
import { selectToken } from "../../../redux/slices/authSlice";
import Title from "../../../ui/Title/Title";
import Button from "../../../ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";

const CheckoutWrapper = () => {
  const { t } = useTranslation();
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const { productsNumber } = useSelector((state) => state.cart);

  useEffect(() => {
    if (productsNumber <= 0) {
      navigate("/cart/");
    }
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/users/user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            const {
              country,
              city,
              postal_code,
              address_books,
              address_book_phone,
              address,
            } = response.data;
            if (
              !country &&
              !city &&
              !postal_code &&
              !address &&
              !address_book_phone
            ) {
              toast.info(t("messages.info.auth.address_book"));
              navigate(`/accounts/account/address-book/`);
            }
          }
        });
      navigate("/cart/checkout/confirm/");
    }
  }, [token, productsNumber]);

  return (
    <div>
      <Title>{t("buttons.checkout")}</Title>
      <div className="continue-guest">
        <img src="/logo.svg" alt="" />
        <p>{t("auth.guest")}</p>
        <Button outlined fullWidth onClick={() => navigate(`/accounts/login/`)}>
          {t("auth.login").toUpperCase()}
        </Button>
        <Button
          fullWidth
          onClick={() => {
            navigate("/cart/checkout/confirm/");
          }}
        >
          {t("buttons.as_guest")}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutWrapper;
