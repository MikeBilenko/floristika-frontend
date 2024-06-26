import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Title from "../../ui/Title/Title";
import SortHeader from "../SortHeader/SortHeader";
import ProductList from "../ProductList/ProductList";
import Filter from "../Filter/Filter";
import Pagination from "../Pagination/Pagination";
import FilterMobile from "../Filter/FilterMobile";
import { selectToken } from "../../redux/slices/authSlice";
import "./ProductsWrapper.scss";

const ProductsWrapper = ({ type: propsType }) => {
  const { t, i18n } = useTranslation();
  const token = useSelector(selectToken);
  const location = useLocation();
  const navigate = useNavigate();
  const { category } = useParams();

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);
  const [count, setCount] = useState(0);
  const [type, setType] = useState("");
  const [sort, setSort] = useState("recently_added");
  const [limitedRange, setLimitedRange] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [filterOpened, setOpenedFilter] = useState(false);
  const [filterMobileOpened, setOpenedFilterMobile] = useState(false);
  const [sale, setSale] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [newIn, setNewIn] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);

  // Function to handle popstate event
  const handlePopstate = () => {
    const state = window.history.state;
    if (state) {
      const {
        selectedColors,
        selectedSizes,
        selectedPriceRange,
        sort,
        page,
        sale,
        bestSeller,
        newIn,
      } = state;

      setSelectedColors(selectedColors || []);
      setSelectedSizes(selectedSizes || []);
      setSelectedPriceRange(selectedPriceRange || []);
      setSort(sort || "recently_added");
      setPage(page || 1);
      setSale(sale || false);
      setBestSeller(bestSeller || false);
      setNewIn(newIn || false);
    }
  };

  useEffect(() => {
    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  useEffect(() => {
    // Save current state to history state
    const state = {
      selectedColors,
      selectedSizes,
      selectedPriceRange,
      sort,
      page,
      sale,
      bestSeller,
      newIn,
    };
    window.history.replaceState(state, "");
  }, [
    selectedColors,
    selectedSizes,
    selectedPriceRange,
    sort,
    page,
    sale,
    bestSeller,
    newIn,
  ]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSelectedColors(
      params.get("color") ? params.get("color").split(",") : []
    );
    setSelectedSizes(params.get("sizes") ? params.get("sizes").split(",") : []);
    setPage(Number(params.get("page")) || 1);
    setSort(params.get("sort") || "recently_added");
    setSale(params.get("sale") === "true");
    setBestSeller(params.get("best-sellers") === "true");
    setNewIn(params.get("new-in") === "true");

    // Set default values if price_from and price_to are not provided
    const priceFrom = parseFloat(params.get("price_from"));
    const priceTo = parseFloat(params.get("price_to"));
    setSelectedPriceRange([
      !isNaN(priceFrom) ? priceFrom : undefined,
      !isNaN(priceTo) ? priceTo : undefined,
    ]);
    setIsInitialRender(false);
  }, [location.search]);

  useEffect(() => {
    if (category) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/categories/${category}`)
        .then((response) => {
          setSelectedCategory(response.data || {});
        });
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/filters/price-range/`)
      .then((response) => {
        setLimitedRange([response.data.min_price, response.data.max_price]);
      });
  }, [category]);

  useEffect(() => {
    if (!isInitialRender) {
      const params = {
        type: type ? type : "",
        sort: sort !== "recently_added" ? sort : undefined,
        color: selectedColors.length > 0 ? selectedColors.join(",") : undefined,
        size: selectedSizes.length > 0 ? selectedSizes.join(",") : undefined,
        sale: sale ? sale : undefined,
        price_from:
          selectedPriceRange[0] !== limitedRange[0]
            ? selectedPriceRange[0]
            : undefined,
        price_to:
          selectedPriceRange[1] !== limitedRange[1]
            ? selectedPriceRange[1]
            : undefined,
        auth:
          token &&
          (selectedPriceRange[1] !== limitedRange[1] ||
            selectedPriceRange[0] !== limitedRange[0])
            ? true
            : undefined,
        page: page > 1 ? page : 1,
      };

      const queryString = Object.keys(params)
        .filter((key) => params[key] !== undefined)
        .map((key) => `${key}=${params[key]}`)
        .join("&");

      const categoryQueryString = `${category ? `category=${category}&` : ""}`;

      const currentParams = new URLSearchParams(location.search);
      const newParams = new URLSearchParams(queryString);
      newParams.forEach((value, key) => {
        currentParams.set(key, value);
      });

      navigate(`?${currentParams.toString()}`);

      axios
        .get(
          `${
            process.env.REACT_APP_API_URL
          }/products/?${categoryQueryString}${currentParams.toString()}`
        )
        .then((response) => {
          if (response.status === 200) {
            setHasPrevious(response.data.previous !== null);
            setHasNext(response.data.next !== null);
            setCount(response.data.count);
            setProducts(response.data.results);

            setTimeout(() => {
              const scrollPosition = localStorage.getItem(
                "productCardScrollPosition"
              );
              if (scrollPosition) {
                window.scrollTo(0, parseInt(scrollPosition));
                localStorage.removeItem("productCardScrollPosition");
              }
            }, 400);
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
    }
  }, [
    type,
    category,
    propsType,
    sort,
    sale,
    selectedColors,
    selectedSizes,
    selectedPriceRange,
    limitedRange,
    page,
    token,
    isInitialRender,
    location.search,
  ]);

  return (
    <>
      <Title>
        {newIn && <>{`${t("categories.new_in")} `}</>}
        {selectedCategory && selectedCategory[0]?.category?.name && (
          <>
            {i18n.language === "en" && selectedCategory[0]?.category?.name}
            {i18n.language === "lv" && selectedCategory[0]?.category?.name_lv}
            {i18n.language === "ru" && selectedCategory[0]?.category?.name_ru}
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
          category={category}
          selectType={setType}
          selectedType={type}
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
          category={category}
          selectType={setType}
          selectedType={type}
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
