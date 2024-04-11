import React from "react";
import { MdCheck } from "react-icons/md";
import { useTranslation } from "react-i18next";

const FilterColorSection = ({ colors, show, selectedColors, selectColors }) => {
  const { i18n } = useTranslation();
  return (
    <div
      className={["filter-expanded-item-content", show ? "active" : ""].join(
        " "
      )}
    >
      {colors &&
        colors.map((color) => (
          <div
            className={`checkbox ${
              selectedColors.find((item) => item === color.slug)
                ? "checked"
                : ""
            }`}
            onClick={() => {
              if (!selectedColors.find((item) => item === color.slug)) {
                selectColors((prevState) => {
                  return [...prevState, color.slug];
                });
              } else {
                selectColors((prevState) => {
                  return [...prevState.filter((item) => item !== color.slug)];
                });
              }
            }}
          >
            <div className="checkbox-inner">
              <MdCheck />
            </div>
            <div
              className={[
                "filter-expanded-item-content-color",
                color.slug === "white" ? "white" : "",
              ].join(" ")}
              style={{ backgroundColor: color.color }}
            ></div>
            {i18n.language === "en" && color.name}
            {i18n.language === "ru" && color.name_ru}
            {i18n.language === "lv" && color.name_lv}
          </div>
        ))}
    </div>
  );
};

export default FilterColorSection;
