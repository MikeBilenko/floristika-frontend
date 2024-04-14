import React from "react";
import "./ProductReviews.scss";
import Rating from "../../../ui/Rating/Rating";
import { useTranslation } from "react-i18next";

const ProductReview = ({ rating, date, name, review, verified }) => {
  const { t } = useTranslation();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  };
  return (
    <div className="review">
      <div className="review-top">
        <div className="review-rating">
          <Rating rating={rating} />
        </div>
        <time dateTime="05.09.2023">{formatDate(date)}</time>
      </div>
      <div className="review-text">{review}</div>
      <div className="review-name">
        <b>{name && name.slice(0, 6)}.</b>
        {verified && <span>{t("reviews.verified")}!</span>}
      </div>
    </div>
  );
};

export default ProductReview;
