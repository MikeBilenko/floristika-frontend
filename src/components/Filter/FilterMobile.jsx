import React, { useEffect, useState } from "react";
import "./Filter.scss";
import axios from "axios";
import FilterPriceSection from "./FilterPriceSection";
import FilterSizeSection from "./FilterSizeSection";
import FilterColorSection from "./FilterColorSection";
import { IoCloseSharp } from "react-icons/io5";
import Button from "ui/Button/Button";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
// import FilterTypes from "./FilterTypes";
// import Categories from "./Categories";
import CategoryItem from "./CategoryItem";

const FilterMobile = ({
  active,
  setActive,
  selectedPriceRange,
  selectPriceRange,
  selectedSizes,
  selectSizes,
  selectColors,
  selectedColors,
  selectType,
  selectedType,
}) => {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [colors, setColors] = useState([]);
  const [size, setSize] = useState([]);
  // const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [min, setMin] = useState([]);
  const [max, setMax] = useState([]);

  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.removeAttribute("style");
    }
  }, [active]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/filters/color/list/`)
      .then((response) => {
        setColors(response.data);
      });
    axios
      .get(`${process.env.REACT_APP_API_URL}/filters/size/list/`)
      .then((response) => {
        setSize(response.data);
      });
    axios
      .get(`${process.env.REACT_APP_API_URL}/filters/price-range/`)
      .then((response) => {
        selectPriceRange([response.data.min_price, response.data.max_price]);
        setMin(response.data.min_price);
        setMax(response.data.max_price);
      });

    axios
      .get(`${process.env.REACT_APP_API_URL}/categories/`)
      .then(async (response) => {
        let categories = response.data;
        let finalCategories = await Promise.all(
          categories.map(async (category) => {
            let _inCategory = { ...category };
            try {
              const subcategoryResponse = await axios.get(
                `${process.env.REACT_APP_API_URL}/categories/${category.slug}/`
              );
              if (subcategoryResponse.status === 200) {
                _inCategory["subcategories"] = subcategoryResponse.data;
              }
            } catch (error) {
              console.error(
                `Error fetching subcategories for ${category.slug}:`,
                error
              );
            }
            return _inCategory;
          })
        );

        setCategories(finalCategories);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });
  }, [selectPriceRange]);

  return (
    !loading && (
      <div className={`filter-mobile ${active ? "active" : ""}`}>
        <div className="filter-mobile-wrapper">
          <div className="filter-mobile-wrapper-header">
            <img src="/logo.svg" alt="" />
            <div
              className="header-mobile-close"
              onClick={() => setActive(!active)}
            >
              <IoCloseSharp />
            </div>
          </div>

          <div className="header-mobile-content-extended-top-section">
            {t("categories.categories")}{" "}
          </div>
          {categories.map((item) => (
            <CategoryItem
              key={item.slug}
              category={item}
              selectedType={selectedType}
              selectType={selectType}
              setActive={setActive}
            />
          ))}

          <div className="header-mobile-content-extended-top-section">
            {t("filters.price")}{" "}
          </div>

          <div className={``}>
            <FilterPriceSection
              show={true}
              min={min}
              max={max}
              selectedPriceRange={selectedPriceRange}
              selectPriceRange={selectPriceRange}
              setSelectedFilter={setSelectedFilter}
              selectedFilter={selectedFilter}
            />
          </div>

          <div className="header-mobile-content-extended-top-section">
            {t("filters.colors")}{" "}
          </div>
          <div>
            <FilterColorSection
              colors={colors}
              show={true}
              selectedColors={selectedColors}
              selectColors={selectColors}
            />
          </div>
          <div className="header-mobile-content-extended-top-section">
            {t("filters.sizes")}{" "}
          </div>
          <div>
            <FilterSizeSection
              sizes={size}
              show={true}
              selectedSizes={selectedSizes}
              selectSizes={selectSizes}
            />
          </div>
          <Button
            fullWidth
            onClick={() => {
              setActive(!active);
              toast.success(t("filters.applied"));
            }}
          >
            {t("filters.apply")}
          </Button>
        </div>
      </div>
    )
  );
};

export default FilterMobile;
