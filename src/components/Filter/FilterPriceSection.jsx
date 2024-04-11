import React, { useState } from "react";
import "rc-slider/assets/index.css";
import Checkbox from "../../ui/Checkbox/Checkbox";
import Slider from "rc-slider";
import { useTranslation } from "react-i18next";

const FilterPriceSection = ({
  show,
  min,
  max,
  selectedPriceRange,
  selectPriceRange,
}) => {
  const { t } = useTranslation();
  const handleSliderChange = (value) => {
    selectPriceRange(value);
  };
  return (
    <div
      className={["filter-expanded-item-content", show ? "active" : ""].join(
        " "
      )}
    >
      <div className="filter-expanded-item-content-description">
        {t("filters.price_range")}
      </div>
      <div className="filter-expanded-item-content-range">
        €{selectedPriceRange[0]}-€{selectedPriceRange[1]}
      </div>
      <div className="filter-expanded-item-content-slider">
        <div className="filter-expanded-item-content-slider-range">
          <div>€{parseInt(min)}</div>
          <div>€{parseInt(max)}</div>
        </div>
        {max && min && selectedPriceRange && (
          <Slider
            range
            controll
            onChange={handleSliderChange}
            value={selectedPriceRange}
            min={min}
            max={max}
          />
        )}
      </div>
    </div>
  );
};

export default FilterPriceSection;

// (
//           //
//         )}
