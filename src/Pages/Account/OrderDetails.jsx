import React, { useEffect, useState, useMemo } from "react";
import AccountWrapper from "../../components/AccountWrapper/AccountWrapper";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectToken } from "../../redux/slices/authSlice";
import axios from "axios";
import { renderDate } from "../../components/Orders/Helpers/helpers";
import OrderStatusText from "../../components/Orders/Helpers/helpers";
import { useTranslation } from "react-i18next";
import countryList from "react-select-country-list";
// TODO: finish translations

const OrderDetails = () => {
  const options = useMemo(() => countryList().getData(), []);
  const { t } = useTranslation();
  const [order, setOrder] = useState({});
  const [discount, setDiscount] = useState(0.0);
  const [companyDiscount, setCompanyDiscount] = useState(0.0);
  const { id } = useParams();
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/orders/order/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response, "ORDER");
          if (response.status === 200) {
            setOrder(response.data);
            if (response.data.discount) {
              const discount_ =
                (response.data.total_auth * response.data.discount.discount) /
                100;
              setDiscount(discount_.toFixed(2));
            }
            if (response.data.company) {
              const company_discount =
                (response.data.total_auth *
                  response.data.company.sale_percent) /
                100;
              console.log(response.data.company, "COMPANY");
              setCompanyDiscount(company_discount);
            }
            console.log(response.data);
          }
        });
    }
  }, [token]);

  return (
    <AccountWrapper>
      <div className="account-header">
        <img src="/accounts/icons/orders.svg" />
        {t("cart.order_number")}
        {order && order.number}
      </div>
      {order && order.number && (
        <div className="order-details">
          <div className="order-details-header">
            <div>
              <div className="order-number">
                {t("cart.order_number")}: {order.number}
              </div>
              <div>
                {t("cart.order_date")}: {renderDate(order.order_date)}
              </div>
              <div>
                {t("status.status")}:{" "}
                <span className={`status ${order.status}`}>
                  <OrderStatusText status={order.status} />
                </span>
              </div>
            </div>
          </div>
          <div className="order-details-items">
            <div className="order-details-items-header">
              <div>Item</div>
              <div>Price</div>
              <div>Quantity</div>
              <div>Total Cost</div>
            </div>
            <div className="order-details-items-list">
              {order.items.map(({ product, quantity }) => (
                <div className="order-details-items-list-item">
                  <div className="order-details-items-list-item-main-info">
                    <img
                      src={product.images[0].image}
                      alt={product.images[0].alt}
                    />
                    <div className="order-details-items-list-item-main-info-details">
                      <div className="order-details-items-list-item-main-info-details-name">
                        {product.name}
                      </div>
                      <div className="order-details-items-list-item-main-info-details-attr">
                        Color: {product.color.name}{" "}
                      </div>
                      <div className="order-details-items-list-item-main-info-details-attr">
                        Size: {product.size.name}
                      </div>
                    </div>
                  </div>
                  <div>
                    €
                    {product.price -
                      (product.price * product.auth_percent.percent) / 100}
                  </div>
                  <div>{quantity}</div>
                  <div>
                    €
                    {(product.price -
                      (product.price * product.auth_percent.percent) / 100) *
                      quantity}
                  </div>
                </div>
              ))}
            </div>
            <div className="order-details-total">
              <div>
                <div>
                  Total: <span>€{order.total_auth}</span>
                </div>
                <div>
                  Delivery (Omniva): <span>€3.00</span>
                </div>
                {order.discount && (
                  <div className="sale">
                    Discount: <span>-€{discount}</span>
                  </div>
                )}
                {order.company && (
                  <div className="sale">
                    Company Discount:{" "}
                    <span>-€{companyDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="total">
                  Total cost:{" "}
                  <span>
                    €
                    {(
                      order.total_auth -
                      companyDiscount -
                      discount +
                      3.0
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {order && order.number && (
        <div className="order-details-delivery">
          <div>
            <div className="order-title">Billing address</div>
            <div>
              {order.guest
                ? `${order.guest.first_name} ${order.guest.last_name}`
                : `${order.user.first_name} ${order.user.last_name}`}
            </div>
            <div>{order.billing.address}</div>
            <div>{order.billing.city}</div>
            <div>{order.billing.postal_code}</div>
            <div>
              {
                options.find((item) => item.value === order.billing.country)
                  .label
              }
            </div>
            <div>{order.billing.phone}</div>
          </div>
          {order.shipping && (
            <div>
              <div className="order-title">Shipping</div>
              <div>
                {order.guest
                  ? `${order.guest.first_name} ${order.guest.last_name}`
                  : `${order.user.first_name} ${order.user.last_name}`}
              </div>
              <div>{order.billing.address}</div>
              <div>{order.billing.city}</div>
              <div>{order.billing.postal_code}</div>
              <div>
                {
                  options.find((item) => item.value === order.billing.country)
                    .label
                }
              </div>
              <div>{order.billing.phone}</div>
            </div>
          )}
          {order.store && (
            <div>
              <div className="order-title">Store: {order.store.name}</div>
              <div>{order.store.address}</div>
              <div>{order.store.city}</div>
              <div>{order.store.postal_code}</div>
              <div>
                {
                  options.find((item) => item.value === order.store.country)
                    .label
                }
              </div>
              <div>{order.store.phone_number}</div>
            </div>
          )}
          <div>
            <div className="order-title">Payment</div>
            <div>
              <div>Invoice</div>
            </div>
          </div>
        </div>
      )}
    </AccountWrapper>
  );
};

export default OrderDetails;
