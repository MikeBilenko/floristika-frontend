import React, { useState, useEffect } from "react";
import Title from "../../ui/Title/Title";
import SubTitle from "../../ui/SubTitle/SubTitle";
import ProductList from "../../components/ProductList/ProductList";
import axios from "axios";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination/Pagination";
import { useTranslation } from "react-i18next";

const Search = () => {
  const { t } = useTranslation();
  const [searchParam, setSearchParam] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchValue = searchParams.get("search");
    axios
      .post(`${process.env.REACT_APP_API_URL}/search/`, {
        search: searchValue,
      })
      .then((response) => {
        if (response.status === 200) {
          setProducts(response.data.results);
        }
      })
      .catch((e) => {
        setProducts([]);
        toast.info(t("search.no_results"));
      });
    setSearchParam(searchValue);
  }, []);

  return (
    <div>
      <Title>{t("search.results_header")}</Title>
      <SubTitle>
        {t("search.result_subheader")}
        <b>{searchParam}</b>
      </SubTitle>
      <ProductList products={products} />
      <Pagination />
    </div>
  );
};

export default Search;
