import React from "react";
import "./OrderItem.scss";
import { useNavigate } from "react-router-dom";
import { renderDate } from "../Helpers/helpers";
import OrderStatusText from "../Helpers/helpers";

const OrderItem = ({ orderItem }) => {
  const navigate = useNavigate();

  let images = orderItem.items.map((item) => item.product.images[0]);
  const length = images.length;
  images.length = 3;
  return (
    orderItem && (
      <div
        className="order-item"
        onClick={() => navigate(`/accounts/account/orders/${orderItem.id}/`)}
      >
        <div>{orderItem.number}</div>
        <div>{renderDate(orderItem.order_date)}</div>
        <div>€{orderItem.total}</div>
        <div className={`status ${orderItem.status}`}>
          <OrderStatusText status={orderItem.status} />
        </div>
        <div className={`order-images ${length > 3 ? "more" : ""} `}>
          {images.map((item, index) => (
            <div key={item.alt}>
              <img src={item.image} alt={item.alt} />
              {index + 1 === 3 && length > 3 && (
                <div className="hover">+{length - 3}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default OrderItem;
