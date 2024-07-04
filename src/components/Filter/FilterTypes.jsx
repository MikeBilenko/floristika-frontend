import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const FilterTypes = ({ types, show, category, setActive = false }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  return (
    <div
      className={["filter-expanded-item-content", show ? "active" : ""].join(
        " "
      )}
    >
      {types &&
        types.map((type) => (
          <div
            onClick={() => {
              navigate(`/products/${category}/${type.slug}/`);
              if (setActive) {
                setActive(false);
              }
            }}
            key={type.slug}
            className={[
              "subcategory",
              window.location.pathname.includes(type.slug) ? "active" : "",
            ].join(" ")}
          >
            {i18n.language === "en" ? type.name : ""}{" "}
            {i18n.language === "ru" ? type.name_ru : ""}
            {i18n.language === "lv" ? type.name_lv : ""}
            {/* <Radio
              label={`
              `}
              onChange={selectType}
              checkedValue={selectedType}
              value={type.slug}
            /> */}
          </div>
        ))}
    </div>
  );
};

export default FilterTypes;
