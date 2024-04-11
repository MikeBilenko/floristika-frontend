import React, { useEffect, useState } from "react";
import "./Filter.scss";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import FilterPriceSection from "./FilterPriceSection";
import FilterSizeSection from "./FilterSizeSection";
import FilterColorSection from "./FilterColorSection";
import { useTranslation } from "react-i18next";

const Filter = ({
  active,
  selectedPriceRange,
  selectPriceRange,
  selectedSizes,
  selectSizes,
  selectColors,
  selectedColors,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [priceActive, setPriceActive] = useState(true);
  const [colorActive, setColorActive] = useState(true);
  const [sizeActive, setSizeActive] = useState(true);
  const [colors, setColors] = useState([]);
  const [size, setSize] = useState([]);

  const [min, setMin] = useState([]);
  const [max, setMax] = useState([]);

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
        setLoading(false);
        console.log(response.data);
      });
  }, []);

  return (
    !loading && (
      <div className={["filter-expanded", active ? "active" : ""].join(" ")}>
        <div className="filter-expanded-item ">
          <div
            className="filter-expanded-item-header first"
            onClick={() => setPriceActive(!priceActive)}
          >
            {t("filters.price")}{" "}
            <div className={[priceActive ? "active" : ""].join(" ")}>
              <FaChevronDown />
            </div>
          </div>
          {max && min && selectedPriceRange && (
            <FilterPriceSection
              show={priceActive}
              min={min}
              max={max}
              selectedPriceRange={selectedPriceRange}
              selectPriceRange={selectPriceRange}
            />
          )}
        </div>

        <div className="filter-expanded-item">
          <div
            className="filter-expanded-item-header"
            onClick={() => setColorActive(!colorActive)}
          >
            {t("filters.colors")}{" "}
            <div className={[colorActive ? "active" : ""].join(" ")}>
              <FaChevronDown />
            </div>
          </div>
          <FilterColorSection
            colors={colors}
            show={colorActive}
            selectedColors={selectedColors}
            selectColors={selectColors}
          />
        </div>

        <div className="filter-expanded-item">
          <div
            className="filter-expanded-item-header"
            onClick={() => setSizeActive(!sizeActive)}
          >
            {t("filters.sizes")}{" "}
            <div className={[sizeActive ? "active" : ""].join(" ")}>
              <FaChevronDown />
            </div>
          </div>
          <FilterSizeSection
            sizes={size}
            show={sizeActive}
            selectedSizes={selectedSizes}
            selectSizes={selectSizes}
          />
        </div>
      </div>
    )
  );
};

export default Filter;
