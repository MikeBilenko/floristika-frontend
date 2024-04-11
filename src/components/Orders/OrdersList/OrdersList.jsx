import React from "react";
import OrderItem from "../OrderItem/OrderItem";
import "./OrdersList.scss";

const OrdersList = ({ orders }) => {
  return (
    <div className="orders-table">
      <div className="orders-header">
        <div className="order-number">Order nr.</div>
        <div className="order-date">Order date</div>
        <div className="order-status">Cost</div>
        <div className="order-total">Status</div>
      </div>
      {orders.map((order) => (
        <OrderItem orderItem={order} key={`${order.id}_order`} />
      ))}
    </div>
  );
};

export default OrdersList;
