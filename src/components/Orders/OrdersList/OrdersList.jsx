import React from "react";
import OrderItem from "../OrderItem/OrderItem";
import "./OrdersList.scss";
import { useTranslation } from "react-i18next";

const OrdersList = ({ orders }) => {
  const { t } = useTranslation();
  return (
    <div className="orders-table">
      <div className="orders-header">
        <div className="order-number">{t("cart.order_number")}</div>
        <div className="order-date">{t("cart.order_date")}</div>
        <div className="order-status">{t("cart.cost")}</div>
        <div className="order-total">{t("status.status")}</div>
      </div>
      {orders.map((order) => (
        <OrderItem orderItem={order} key={`${order.id}_order`} />
      ))}
    </div>
  );
};

export default OrdersList;
