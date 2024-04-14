import React, { useState } from "react";
import "./SortHeader.scss";
import Select from "../../ui/Select/Select";
import Sort from "./control.svg";
import { useTranslation } from "react-i18next";

const SortHeader = ({
  products,
  setOpenedFilter,
  filterOpened,
  count,
  sort,
  onChange,
  filterOpenedMobile,
  setOpenedFilterMobile,
}) => {
  const { t } = useTranslation();
  const options = [
    {
      key: "recently_added",
      value: "sort.recent",
    },
    {
      key: "price_high_to_low",
      value: "sort.price_desc",
    },
    {
      key: "price_low_to_high",
      value: "sort.price_asc",
    },
    {
      key: "discount_percent",
      value: "sort.discount",
    },
    {
      key: "stock_level",
      value: "sort.stock_level",
    },
  ];
  const [openSortMobile, setOpenSortMobile] = useState(false);
  const setSelectedValue = (val) => onChange(val);
  return (
    <div className="sort-header">
      {products && (
        <div className="items-number">
          <span className="bold">{count}</span>{" "}
          {count === 1 ? t("filters.item") : t("filters.items")}
        </div>
      )}
      {products && (
        <div
          className="sort-header-filter"
          onClick={() => setOpenedFilter(!filterOpened)}
        >
          <img src={Sort} alt="" />
          {!filterOpened && t("filters.show")}
          {filterOpened && t("filters.hide")}
        </div>
      )}
      {products && (
        <>
          <div className="sort-header-mobile">
            <div onClick={() => setOpenedFilterMobile(!filterOpenedMobile)}>
              {t("filters.filter")}
            </div>
            <div onClick={() => setOpenSortMobile(true)}>
              {t("sort.sort_by")}
            </div>
          </div>
          <div
            className={`select-mobile ${openSortMobile ? "active" : ""}`}
            onClick={() => setOpenSortMobile(false)}
          >
            <div className="select-mobile-content">
              {options.map((option) => (
                <div
                  className={`option ${sort === option.key ? "active" : ""}`}
                  onClick={() => setSelectedValue(option.key)}
                  key={option.key}
                >
                  {t(option.value)}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      <div className="sort-header-wrapper products-sort">
        <div className="items-number">
          <span className="bold">{count}</span>{" "}
          {count === 1 ? t("filters.item") : t("filters.items")}
        </div>
        <div className="sort-by">
          <span className="bold">{t("sort.sort_by")}:</span>
          <Select options={options} value={sort} setValue={setSelectedValue} />
        </div>
      </div>
    </div>
  );
};

export default SortHeader;
