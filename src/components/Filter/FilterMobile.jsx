import React, { useEffect, useState } from "react";
import "./Filter.scss";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import FilterPriceSection from "./FilterPriceSection";
import FilterSizeSection from "./FilterSizeSection";
import FilterColorSection from "./FilterColorSection";

const FilterMobile = ({
  active,
  selectedPriceRange,
  selectPriceRange,
  selectedSizes,
  selectSizes,
  selectColors,
  selectedColors,
}) => {
  const [selectedFilter, setSelectedFilter] = useState("");
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
      });
  }, []);

  return (
    !loading && (
      <div className="filter-mobile">
        <div className="filter-mobile-wrapper">
          <div className="filter-mobile-wrapper-header">
            <div>Filter</div>
          </div>

          <div>Price range color size</div>

          <div className={``}>
            <FilterPriceSection
              show={priceActive}
              min={min}
              max={max}
              selectedPriceRange={selectedPriceRange}
              selectPriceRange={selectPriceRange}
              setSelectedFilter={setSelectedFilter}
              selectedFilter={selectedFilter}
            />
          </div>
          <div>
            <FilterColorSection
              colors={colors}
              show={colorActive}
              selectedColors={selectedColors}
              selectColors={selectColors}
            />
          </div>
          <div>
            <FilterSizeSection
              sizes={size}
              show={sizeActive}
              selectedSizes={selectedSizes}
              selectSizes={selectSizes}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default FilterMobile;
