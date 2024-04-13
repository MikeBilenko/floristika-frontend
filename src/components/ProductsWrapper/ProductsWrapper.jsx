import React, { useState, useEffect } from "react";
import Title from "../../ui/Title/Title";
import "./ProductsWrapper.scss";
import SortHeader from "../SortHeader/SortHeader";
import ProductList from "../ProductList/ProductList";
import Filter from "../Filter/Filter";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../../redux/slices/authSlice";
import Pagination from "../Pagination/Pagination";
import { useNavigate } from "react-router-dom";
import FilterMobile from "../Filter/FilterMobile";
import { useTranslation } from "react-i18next";

const ProductsWrapper = ({ category, type }) => {
  const { t, i18n } = useTranslation();
  const token = useSelector(selectToken);
  const location = useLocation();

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [products, setProducts] = useState([]);
  const [sale, setSale] = useState(false);
  const [newIn, setNewIn] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [filterOpened, setOpenedFilter] = useState(false);
  const [filterMobileOpened, setOpenedFilterMobile] = useState(false);
  const [selectedColors, setSelectedColors] = useState(
    new URLSearchParams(location.search).get("colors")
      ? new URLSearchParams(location.search).get("colors").split(",")
      : []
  );
  const [selectedSizes, setSelectedSizes] = useState(
    new URLSearchParams(location.search).get("sizes")
      ? new URLSearchParams(location.search).get("sizes").split(",")
      : []
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);
  const [count, setCount] = useState(0);
  const [sort, setSort] = useState("recently_added");
  const [limitedRange, setLimitedRange] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  useEffect(() => {
    let isSale = new URLSearchParams(location.search).get("sale") === "true";

    let isBestSeller =
      new URLSearchParams(location.search).get("best-sellers") === "true";
    let isNewin = new URLSearchParams(location.search).get("new-in") === "true";
    setSale(isSale);
    setBestSeller(isBestSeller);
    setNewIn(isNewin);
  }, [location.search, location]);
  useEffect(() => {
    setPage(1);
  }, [selectedColors, selectedSizes, selectedPriceRange, sort]);
  useEffect(() => {
    setPage(1);
    axios
      .get(`${process.env.REACT_APP_API_URL}/categories/`)
      .then((response) => {
        setSelectedCategory(
          response.data.find((item) => item.slug === category) || {}
        );
      });
  }, [category]);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/filters/price-range/`)
      .then((response) => {
        setLimitedRange([response.data.min_price, response.data.max_price]);
      });
  }, []);
  const navigate = useNavigate();

  useEffect(() => {
    let otherParams = [
      category ? `category=${category}` : "",
      type ? `type=${type}` : "",
      sort && sort !== "recently_added" ? `sort=${sort}` : "",
      selectedColors.length > 0 ? `color=${selectedColors.join(",")}` : "",
      selectedSizes.length > 0 ? `size=${selectedSizes.join(",")}` : "",
      sale ? `sale=${sale}` : "",
      limitedRange.length > 0 &&
      selectedPriceRange.length > 0 &&
      selectedPriceRange[0] !== limitedRange[0]
        ? `price-from=${selectedPriceRange[0]}`
        : "",
      limitedRange.length > 0 &&
      selectedPriceRange.length > 0 &&
      selectedPriceRange[1] !== limitedRange[1]
        ? `price-to=${selectedPriceRange[1]}`
        : "",
      token &&
      (selectedPriceRange[1] !== limitedRange[1] ||
        selectedPriceRange[0] !== limitedRange[0])
        ? `auth=true`
        : "",
      page > 1 ? `page=${page}` : "",
    ];
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/products/?${otherParams
          .filter((param) => param !== "")
          .join("&")}`
      )
      .then((response) => {
        if (response.status === 200) {
          setHasPrevious(response.data.previous !== null);
          setHasNext(response.data.next !== null);
          setCount(response.data.count);
          console.log(response.data.results);
          if (response.data.results.length === 0) {
            setProducts([]);
          } else {
            setProducts((prevProducts) => {
              return [...response.data.results];
            });
          }
        } else if (response.status === 401 && page !== 1) {
          setPage(1);
        } else {
          setProducts([]);
          setCount(0);
          setHasPrevious(false);
          setHasNext(false);
        }
      })
      .catch((error) => {
        setPage(1);
        setProducts([]);
      });
  }, [
    location,
    sort,
    category,
    type,
    sale,
    selectedColors,
    selectedSizes,
    selectedPriceRange,
    limitedRange,
    newIn,
    bestSeller,
    page,
  ]);
  useEffect(() => {}, []);

  return (
    <>
      <Title>
        {newIn && <>{`${t("categories.new_in")} `}</>}
        {category && (
          <>
            {i18n.language === "en" && selectedCategory.name}
            {i18n.language === "lv" && selectedCategory.name_lv}
            {i18n.language === "ru" && selectedCategory.name_ru}
          </>
        )}
        {sale && <>{` ${t("categories.sale")}`}</>}
        {bestSeller && <>{` ${t("categories.best_sellers")}`}</>}
      </Title>
      <SortHeader
        products
        count={count}
        sort={sort}
        onChange={setSort}
        filterOpened={filterOpened}
        setOpenedFilter={setOpenedFilter}
        filterOpenedMobile={filterMobileOpened}
        setOpenedFilterMobile={setOpenedFilterMobile}
      />
      <div
        className={["products-page-content", filterOpened ? "active" : ""].join(
          " "
        )}
      >
        <Filter
          active={filterOpened}
          selectedPriceRange={selectedPriceRange}
          selectPriceRange={setSelectedPriceRange}
          selectedSizes={selectedSizes}
          selectSizes={setSelectedSizes}
          selectColors={setSelectedColors}
          selectedColors={selectedColors}
        />
        <FilterMobile
          active={filterMobileOpened}
          setActive={setOpenedFilterMobile}
          selectedPriceRange={selectedPriceRange}
          selectPriceRange={setSelectedPriceRange}
          selectedSizes={selectedSizes}
          selectSizes={setSelectedSizes}
          selectColors={setSelectedColors}
          selectedColors={selectedColors}
        />
        <div>
          <ProductList products={products} />
          <Pagination
            next={hasNext}
            previous={hasPrevious}
            page={page}
            setPage={setPage}
          />
        </div>
      </div>
    </>
  );
};

export default ProductsWrapper;
