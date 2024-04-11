import React from "react";
import { useTranslation } from "react-i18next";
import { MdCheck } from "react-icons/md";

const FilterSizeSection = ({ sizes, show, selectedSizes, selectSizes }) => {
  const { i18n } = useTranslation();
  return (
    <div
      className={["filter-expanded-item-content", show ? "active" : ""].join(
        " "
      )}
    >
      {sizes &&
        sizes.map((size) => (
          <div
            className={`checkbox ${
              selectedSizes.find((item) => item === size.slug) ? "checked" : ""
            }`}
            onClick={() => {
              if (!selectedSizes.find((item) => item === size.slug)) {
                selectSizes((prevState) => {
                  return [...prevState, size.slug];
                });
              } else {
                selectSizes((prevState) => {
                  return [...prevState.filter((item) => item !== size.slug)];
                });
              }
            }}
          >
            <div className="checkbox-inner">
              <MdCheck />
            </div>

            {i18n.language === "en" && size.name}
            {i18n.language === "ru" && size.name_ru}
            {i18n.language === "lv" && size.name_lv}
          </div>
        ))}
    </div>
  );
};

export default FilterSizeSection;
