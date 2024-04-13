import React, { useState, useEffect } from "react";
import AccountWrapper from "../../components/AccountWrapper/AccountWrapper";
import Button from "../../ui/Button/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/slices/authSlice";
import OrdersList from "../../components/Orders/OrdersList/OrdersList";
import Pagination from "../../components/Pagination/Pagination";
import { useTranslation } from "react-i18next";

const Orders = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const token = useSelector(selectToken);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/orders/orders/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setOrders(response.data.results);
          setHasNext(!!response.data.next);
          setHasPrevious(!!response.data.previous);
          console.log(response.data);
        });
    }
  }, [token]);

  useEffect(() => {
    if (page > 1) {
      updateOrders(page);
    } else {
      updateOrders(1);
    }
  }, [page]);

  const updateOrders = (ppage) => {
    let new_page = ppage;
    if (token) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/orders/orders/?page=${new_page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setOrders(response.data.results);
          setHasNext(!!response.data.next);
          setHasPrevious(!!response.data.previous);
        });
    }
  };
  return (
    <AccountWrapper>
      <div className="account-header">
        <img src="/accounts/icons/orders.svg" />
        {t("auth.my_orders")}
      </div>
      {orders.length > 0 && (
        <>
          <OrdersList orders={orders} />
          <Pagination
            next={hasNext}
            previous={hasPrevious}
            page={page}
            setPage={setPage}
          />
        </>
      )}
      {orders.length <= 0 && (
        <div className="no-orders">
          <img src="/accounts/icons/noOrders.svg" />
          <div className="no-orders-message">{t("cart.empty_orders")}</div>
          <Button fullWidth onClick={() => navigate(`/`)}>
            {t("cart.start_shopping")}
          </Button>
        </div>
      )}
    </AccountWrapper>
  );
};

export default Orders;
