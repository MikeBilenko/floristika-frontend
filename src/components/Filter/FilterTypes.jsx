import React from "react";
import { useTranslation } from "react-i18next";
import Radio from "ui/Radio/Radio";

const FilterTypes = ({ types, show, selectedType, selectType }) => {
  const { i18n } = useTranslation();
  return (
    <div
      className={["filter-expanded-item-content", show ? "active" : ""].join(
        " "
      )}
    >
      {types &&
        types.map((type) => (
          <div>
            <Radio
              label={`${i18n.language === "en" ? type.name : ""} ${
                i18n.language === "ru" ? type.name_ru : ""
              }
                ${i18n.language === "lv" ? type.name_lv : ""}
              `}
              onChange={selectType}
              checkedValue={selectedType}
              value={type.slug}
            />
          </div>
        ))}
    </div>
  );
};

export default FilterTypes;
