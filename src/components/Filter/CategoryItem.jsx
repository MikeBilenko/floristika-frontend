import React, { useState } from "react";
import "./Filter.scss";
import { FaChevronDown } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import FilterTypes from "./FilterTypes";
import { useNavigate } from "react-router-dom";

const CategoryItem = ({ category, setActive = null }) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(
    window.location.pathname.includes(category.slug) ? true : false
  );
  const navigate = useNavigate();
  return (
    <div className="filter-expanded-item category">
      <div
        className="filter-expanded-item-header"
        onClick={() => setOpen(!open)}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/products/${category.slug}/`);
            if (setActive) {
              setActive(false);
            }
            window.location.reload();
          }}
          className={`filter-expanded-item-header-title ${
            window.location.pathname.includes(category.slug) ? "active" : ""
          }`}
        >
          {i18n.language === "en" && category.name}
          {i18n.language === "ru" && category.name_ru}
          {i18n.language === "lv" && category.name_lv}
        </div>
        <div className={[open ? "active" : ""].join(" ")}>
          <FaChevronDown />
        </div>
      </div>
      <FilterTypes
        category={category.slug}
        types={category.subcategories}
        show={open}
        setActive={setActive}
      />
    </div>
  );
};

export default CategoryItem;
