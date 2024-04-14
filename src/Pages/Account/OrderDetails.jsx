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

const OrderDetails = () => {
  const options = useMemo(() => countryList().getData(), []);
  const { t, i18n } = useTranslation();
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
          if (response.status === 200) {
            setOrder(response.data);
            if (response.data.discount) {
              const discount_ =
                (response.data.total * response.data.discount.discount) / 100;
              setDiscount(discount_.toFixed(2));
            }
            if (response.data.company) {
              const company_discount = parseFloat(
                response.data.company_total_auth
              );
              setCompanyDiscount(company_discount);
            }
          }
        });
    }
  }, [token]);

  return (
    <AccountWrapper>
      <div className="account-header">
        <img src="/accounts/icons/orders.svg" />
        {t("cart.order_number")}
        {": "}
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
              <div>{t("order.item")}</div>
              <div>{t("order.price")}</div>
              <div>{t("order.quantity")}</div>
              <div>{t("order.total_cost")}</div>
            </div>
            <div className="order-details-items-list">
              {order.items.map(
                ({
                  product,
                  quantity,
                  sale,
                  price_for_authenticated,
                  price,
                }) => (
                  <div className="order-details-items-list-item">
                    <div className="order-details-items-list-item-main-info">
                      <img
                        src={product.images[0].image}
                        alt={product.images[0].alt}
                      />
                      <div className="order-details-items-list-item-main-info-details">
                        <div className="order-details-items-list-item-main-info-details-name">
                          {i18n.language === "en" && product.name}
                          {i18n.language === "lv" && product.name_lv}
                          {i18n.language === "ru" && product.name_ru}
                        </div>
                        <div className="order-details-items-list-item-main-info-details-attr">
                          {t("order.color")}: {product.color.name}{" "}
                        </div>
                        <div className="order-details-items-list-item-main-info-details-attr">
                          {t("order.size")}: {product.size.name}
                        </div>
                      </div>
                    </div>
                    <div>€{price_for_authenticated}</div>
                    <div>{quantity}</div>
                    <div>€{price_for_authenticated * quantity}</div>
                  </div>
                )
              )}
            </div>
            <div className="order-details-total">
              <div>
                <div>
                  {t("order.total")}: <span>€{order.total}</span>
                </div>
                <div>
                  {t("order.delivery")} (Omniva): <span>€3.00</span>
                </div>
                {order.discount && (
                  <div className="sale">
                    {t("order.discount")}: <span>-€{discount}</span>
                  </div>
                )}
                {order.company_total_auth && (
                  <div className="sale">
                    {t("order.comapny_discount")}:{" "}
                    <span>
                      -€{parseFloat(order.company_total_auth).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="total">
                  {t("order.total_cost")}:{" "}
                  <span>
                    €
                    {(order.total - companyDiscount - discount + 3.0).toFixed(
                      2
                    )}
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
            <div className="order-title">{t("order.billing_address")}</div>
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
              <div className="order-title">{t("order.shipping")}</div>
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
              <div className="order-title">{t("order.store")}</div>
              <div>{order.store.name}</div>
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
            <div className="order-title">{t("order.payment")}</div>
            <div>
              <div>{t("order.invoice")}</div>
            </div>
          </div>
        </div>
      )}
    </AccountWrapper>
  );
};

export default OrderDetails;
