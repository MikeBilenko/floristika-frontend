import React, { useEffect, useState } from "react";
import "./CheckoutSuccess.scss";
import { useParams } from "react-router-dom";
import Title from "../../../ui/Title/Title";
import { useDispatch } from "react-redux";
import Button from "../../../ui/Button/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../../redux/slices/cartSlice";
import { useTranslation } from "react-i18next";

const CheckoutSuccess = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const [order, setOrder] = useState({});
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (number) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/orders/order/guest/${number}/`)
        .then((response) => {
          if (response.status === 200) {
            dispatch(clearCart());
            setOrder({
              number: response.data.number,
              total: response.data.total,
              total_auth: response.data.total_auth,
              items: response.data.items.length,
            });
          }
        });
    }
  }, [number, dispatch]);

  return (
    <div className="checkout-success-wrapper">
      <Title>{t("checkout.thanks")}</Title>
      {order && (
        <div className="checkout-success-wrapper-content">
          <div className="checkout-success-title">{t("checkout.detail")}</div>
          <div className="checkout-success-subtitle">
            {t("checkout.subtitle")}
          </div>
          <div className="checkout-success-data">
            <div>
              <div>{t("checkout.ordernumber")}</div>
              {/* <div>{t("checkout.total_cost")}</div>
              <div>{t("checkout.items")}</div> */}
            </div>
            <div>
              <div>{order.number}</div>
            </div>
          </div>
          <div>{t("checkout.manager")}</div>
          <Button
            fullWidth
            onClick={() => {
              navigate("/");
              window.scrollTo(0, 0);
            }}
          >
            {t("checkout.continue")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CheckoutSuccess;
