import React, { useEffect, useState } from "react";
import "./CheckoutSuccess.scss";
import { useParams } from "react-router-dom";
import Title from "../../../ui/Title/Title";
import { useDispatch, useSelector } from "react-redux";
import { selectToken } from "../../../redux/slices/authSlice";
import Button from "../../../ui/Button/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../../redux/slices/cartSlice";

const CheckoutSuccess = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [order, setOrder] = useState({});
  const navigate = useNavigate();
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
  }, [number]);

  return (
    <div className="checkout-success-wrapper">
      <Title>THANKS FOR YOUR ORDER</Title>
      {order && (
        <div className="checkout-success-wrapper-content">
          <div className="checkout-success-title">Order detail</div>
          <div className="checkout-success-subtitle">
            You’ll receive your order confirmation in your email
          </div>
          <div className="checkout-success-data">
            <div>
              <div>Order number:</div>
              <div>Total Cost:</div>
              <div>Items:</div>
            </div>
            <div>
              <div>{order.number}</div>
              <div>€{token ? order.total_auth : order.total}</div>
              <div>{order.items}</div>
            </div>
          </div>
          <Button
            fullWidth
            onClick={() => {
              navigate("/");
              window.scrollTo(0, 0);
            }}
          >
            CONTINUE SHOPPING
          </Button>
        </div>
      )}
    </div>
  );
};

export default CheckoutSuccess;