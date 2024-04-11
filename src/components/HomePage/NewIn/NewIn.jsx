import React, { useState, useEffect } from "react";
import "./NewIn.scss";
import Container from "../../Container/Container";
import Title from "../../../ui/Title/Title";
import ProductList from "../../ProductList/ProductList";
import Button from "../../../ui/Button/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NewIn = () => {
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
    <Container className="new-in">
      <Title>{t("categories.new_in")}</Title>
      {products && <ProductList products={products} />}
      <Button uppercase onClick={() => navigate("/products/?new-in=true")}>
        {`${t("categories.view_all")} ${t("categories.new_in")}`}
      </Button>
    </Container>
  );
};

export default NewIn;
