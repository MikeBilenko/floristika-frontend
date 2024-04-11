import React, { useState, useEffect } from "react";
import "./BestSellers.scss";
import Container from "../../Container/Container";
import Title from "../../../ui/Title/Title";
import SubTitle from "../../../ui/SubTitle/SubTitle";
import ProductList from "../../ProductList/ProductList";
import Button from "../../../ui/Button/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BestSellers = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/best-sellers/`)
      .then((response) => {
        setProducts(response.data.results);
      });
  }, []);
  return (
    <Container className="best-sellers">
      <Title>{t("categories.best_sellers")}</Title>
      <SubTitle>{t("best_sellers.text")}</SubTitle>
      {products && <ProductList products={products} />}
      <Button
        uppercase
        onClick={() => navigate("/products/?best-sellers=true")}
      >
        {`${t("categories.view_all")} ${t("categories.best_sellers")}`}
      </Button>
    </Container>
  );
};

export default BestSellers;
