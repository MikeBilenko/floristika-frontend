import "./Pagination.scss";
import React from "react";
import Button from "../../ui/Button/Button";
import { useTranslation } from "react-i18next";

const Pagination = ({ next, previous, setPage, page }) => {
  const { t } = useTranslation();
  return (
    <div className="pagination">
      <Button
        outlined
        type="button"
        disabled={previous ? false : true}
        onClick={(e) => {
          e.preventDefault();
          if (previous && page > 1) {
            setPage(page - 1);
          } else {
            setPage(1);
          }
        }}
      >
        {"< "}
        {t("pagination.prev")}
      </Button>
      <Button
        outlined={true}
        type="button"
        disabled={next ? false : true}
        onClick={(e) => {
          e.preventDefault();
          setPage(page + 1);
        }}
      >
        {t("pagination.next")} {" >"}
      </Button>
    </div>
  );
};

export default Pagination;
