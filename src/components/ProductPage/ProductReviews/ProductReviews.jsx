import React, { useEffect, useState } from "react";
import Button from "../../../ui/Button/Button";
import ProductReview from "./ProductReview";
import Rating from "../../../ui/Rating/Rating";
import Icon from "./icon.svg";
import axios from "axios";
import ProductReviewCreate from "./ProductReviewCreate";
import { useTranslation } from "react-i18next";

const ProductReviews = ({ product, rate }) => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [count, setCount] = useState(0);
  const [writeReview, setWriteReview] = useState(false);

  useEffect(() => {
    fetchReviews(1);
  }, [product]);

  const fetchReviews = (page) => {
    if (product) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/products/${product}/reviews/?page=${page}`
        )
        .then((response) => {
          const newReviews = response.data.results;
          setCount(response.data.count);
          setReviews((prevState) => [...prevState, ...newReviews]);

          setHasMore(response.data.next !== null);
        });
    }
  };
  const clicked = () => {
    let spage = page + 1;
    fetchReviews(spage);
    setPage(spage);
  };

  const chunkReviews = (array, size) => {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
  };

  return (
    <div className="reviews">
      <div className="reviews-header">
        <div className="reviews-header-title">
          <div>{t("reviews.customer_reviews")}</div>
          <Button outlined onClick={() => setWriteReview(true)}>
            <img src={Icon} alt="icon" />
            {t("reviews.write_a_review")}
          </Button>
          <ProductReviewCreate
            open={writeReview}
            setOpen={setWriteReview}
            product={product}
          />
        </div>
        <div className="reviews-header-rating">
          <span>{rate}. </span>
          <Rating rating={rate} />
        </div>
        <div className="reviews-header-based-on">
          {t("reviews.based_on")} {reviews && count}{" "}
          {reviews && count === 1 ? t("reviews.review") : t("reviews.reviews")}
        </div>
      </div>
      <div className="reviews-list">
        <div className="reviews-list-column">
          {reviews.length > 0 &&
            chunkReviews(reviews, 4).map((reviews_) =>
              reviews_.map(
                (review, index) =>
                  index === 0 && (
                    <ProductReview
                      key={index}
                      rating={review.rate}
                      name={
                        review.user
                          ? `${review.user.first_name} ${review.user.last_name}`
                          : review.name
                      }
                      date={review.created_at}
                      verified={review.user ? true : false}
                      review={review.text}
                    />
                  )
              )
            )}
        </div>
        <div className="reviews-list-column">
          {reviews.length > 0 &&
            chunkReviews(reviews, 4).map((reviews_) =>
              reviews_.map(
                (review, index) =>
                  index === 1 && (
                    <ProductReview
                      key={index}
                      rating={review.rate}
                      name={
                        review.user
                          ? `${review.user.first_name} ${review.user.last_name}`
                          : review.name
                      }
                      date={review.created_at}
                      verified={review.user ? true : false}
                      review={review.text}
                    />
                  )
              )
            )}
        </div>
        <div className="reviews-list-column">
          {reviews.length > 0 &&
            chunkReviews(reviews, 4).map((reviews_) =>
              reviews_.map(
                (review, index) =>
                  index === 2 && (
                    <ProductReview
                      key={index}
                      rating={review.rate}
                      name={
                        review.user
                          ? `${review.user.first_name} ${review.user.last_name}`
                          : review.name
                      }
                      date={review.created_at}
                      verified={review.user ? true : false}
                      review={review.text}
                    />
                  )
              )
            )}
        </div>
        <div className="reviews-list-column">
          {reviews.length > 0 &&
            chunkReviews(reviews, 4).map((reviews_) =>
              reviews_.map(
                (review, index) =>
                  index === 3 && (
                    <ProductReview
                      key={index}
                      rating={review.rate}
                      name={
                        review.user
                          ? `${review.user.first_name} ${review.user.last_name}`
                          : review.name
                      }
                      date={review.created_at}
                      verified={review.user ? true : false}
                      review={review.text}
                    />
                  )
              )
            )}
        </div>
      </div>

      <div className="reviews-load-more">
        {hasMore && (
          <Button outlined onClick={() => clicked()}>
            {t("buttons.load_more")} {t("reviews.reviews")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
