import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectToken, selectLoading } from "../../redux/slices/authSlice";
import axios from "axios";
import ProductList from "../../components/ProductList/ProductList";
import Title from "../../ui/Title/Title";
import SubTitle from "../../ui/SubTitle/SubTitle";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const WishList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const loading = useSelector(selectLoading);
  const token = useSelector(selectToken);
  const [products, setProducts] = useState([]);

  if (!token) {
    navigate("/accounts/login/");
  }

  useEffect(() => {
    if (!loading && localStorage.getItem("wishlist") && !token) {
      let items = JSON.parse(localStorage.getItem("wishlist"));
      items.map((item) => {
        axios
          .get(`${process.env.REACT_APP_API_URL}/products/${item}/`)
          .then((response) => {
            setProducts((prevProducts) => {
              return [...prevProducts, response.data];
            });
          });
        return item;
      });
    } else if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/users/wishlist/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setProducts([]);
          response.data.map((item) => {
            setProducts((prevProducts) => {
              return [...prevProducts, item.product];
            });
            return item;
          });
        });
    }
  }, [loading, token]);

  return (
    <div>
      <Title>{t("wishlist.wishlist")}</Title>
      {products && products.length > 0 && (
        <ProductList products={products} setProducts={setProducts} />
      )}
      {products && products.length <= 0 && (
        <SubTitle>{t("wishlist.empty")}</SubTitle>
      )}
    </div>
  );
};

export default WishList;
