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
import Categories from "../Filter/Categories";
import { selectToken } from "../../redux/slices/authSlice";
import "./ProductsWrapper.scss";
import { Helmet } from "react-helmet";

const ProductsWrapper = ({ type: propsType }) => {
  const { t, i18n } = useTranslation();
  const token = useSelector(selectToken);
  const { category, subcategory } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Component state
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([null, null]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("recently_added");
  const [sale, setSale] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [newIn, setNewIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [count, setCount] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [limitedRange, setLimitedRange] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [filterOpened, setOpenedFilter] = useState(true);
  const [filterMobileOpened, setOpenedFilterMobile] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);

  // Initialize state from URL parameters
  useEffect(() => {
    const initialParams = new URLSearchParams(window.location.search);
    const initialColors = initialParams.get("color")
      ? initialParams.get("color").split(",")
      : [];
    const initialPriceFrom =
      parseFloat(initialParams.get("price_from")) || null;
    const initialPriceTo = parseFloat(initialParams.get("price_to")) || null;
    const initialPage = Number(initialParams.get("page")) || 1;
    const initialSort = initialParams.get("sort") || "recently_added";
    const initialSale = initialParams.get("sale") === "true";
    const initialBestSeller = initialParams.get("best-sellers") === "true";
    const initialNewIn = initialParams.get("new-in") === "true";
    setSelectedColors(initialColors);
    setSelectedPriceRange([initialPriceFrom, initialPriceTo]);
    setPage(initialPage);
    setSort(initialSort);
    setSale(initialSale);
    setBestSeller(initialBestSeller);
    setNewIn(initialNewIn);
  }, []);

  const fetchProducts = async () => {
    try {
      console.log("triggered");

      let params = {};
      if (sort?.length > 0) {
        params["sort"] = sort;
      }
      if (selectedColors?.length > 0) {
        params["color"] = selectedColors.join(",");
      }
      if (selectedSizes?.length > 0) {
        params["size"] = selectedSizes.join(",");
      }
      if (sale) {
        params["sale"] = sale;
      }
      if (selectedPriceRange[0]) {
        params["price_from"] = selectedPriceRange[0];
      }
      if (selectedPriceRange[1]) {
        params["price_to"] = selectedPriceRange[1];
      }
      if (page > 1) {
        params["page"] = page;
      }

      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined)
      );

      let mainFilters = {};
      if (category) {
        mainFilters["category"] = category;
      }
      if (subcategory) {
        mainFilters["type"] = subcategory;
      }

      console.log(filteredParams, mainFilters, "aslasa");

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/products/`,
        {
          params: {
            ...filteredParams,
            ...mainFilters,
          },
        }
      );

      if (response.status === 200) {
        setHasPrevious(response.data.previous !== null);
        setHasNext(response.data.next !== null);
        setCount(response.data.count);
        setProducts(response.data.results);

        const scrollPosition = localStorage.getItem(
          "productCardScrollPosition"
        );
        if (scrollPosition) {
          window.scrollTo(0, parseInt(scrollPosition));
          localStorage.removeItem("productCardScrollPosition");
        }
      } else if (response.status === 401 && page !== 1) {
        setPage(1);
      } else {
        setProducts([]);
        setCount(0);
        setHasPrevious(false);
        setHasNext(false);
      }
    } catch (error) {
      setPage(1);
      setProducts([]);
      console.error("Error fetching products:", error);
    }
    update();
  };

  // Effect to update URL when state changes
  const update = () => {
    const params = new URLSearchParams(location.search);

    selectedColors.length > 0
      ? params.set("color", selectedColors.join(","))
      : params.delete("color");
    !isNaN(selectedPriceRange[0])
      ? params.set("price_from", selectedPriceRange[0])
      : params.delete("price_from");
    !isNaN(selectedPriceRange[1])
      ? params.set("price_to", selectedPriceRange[1])
      : params.delete("price_to");
    page > 1 ? params.set("page", page) : params.delete("page");
    sort !== "recently_added"
      ? params.set("sort", sort)
      : params.delete("sort");
    sale ? params.set("sale", "true") : params.delete("sale");
    bestSeller
      ? params.set("best-sellers", "true")
      : params.delete("best-sellers");
    newIn ? params.set("new-in", "true") : params.delete("new-in");

    console.log(params);

    const originalParams = new URLSearchParams(location.search);
    originalParams.forEach((value, key) => {
      if (!params.has(key)) {
        params.set(key, value);
      }
    });

    console.log(originalParams);

    const queryString = params.toString();
    const url = `?${queryString}`;

    navigate(url, { replace: true });
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchProducts();
    // eslint-disable-next-line
  }, [
    category,
    subcategory,
    sort,
    sale,
    selectedColors,
    selectedSizes,
    selectedPriceRange,
    limitedRange,
    page,
    token,
    isInitialRender,
  ]);

  useEffect(() => {
    const loadInitialData = async () => {
      if (category) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/categories/${category}`
          );
          setSelectedCategory(response.data || {});
        } catch (error) {
          console.error("Error fetching category:", error);
        }
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/filters/price-range/`
        );
        setLimitedRange([response.data.min_price, response.data.max_price]);
      } catch (error) {
        console.error("Error fetching price range:", error);
      }
    };

    loadInitialData();
  }, [category]);

  useEffect(() => {
    setIsInitialRender(false);
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {selectedCategory
            ? selectedCategory[0]?.category?.name
            : "Floristika Products"}
        </title>
      </Helmet>
      <Title>
        {newIn && <>{`${t("categories.new_in")} `}</>}
        {selectedCategory && selectedCategory[0]?.category?.name && (
          <>
            {i18n.language === "en" && selectedCategory[0]?.category?.name}
            {i18n.language === "lv" && selectedCategory[0]?.category?.name_lv}
            {i18n.language === "ru" && selectedCategory[0]?.category?.name_ru}
          </>
        )}
        {!selectedCategory && `${t("categories.list")}`}
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
      <div className={["products-page-content"].join(" ")}>
        <div>
          <Categories active={true} />

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
        </div>
        <div>
          <ProductList products={products} />
          {(hasNext || hasPrevious) && (
            <Pagination
              next={hasNext}
              previous={hasPrevious}
              page={page}
              setPage={setPage}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsWrapper;
