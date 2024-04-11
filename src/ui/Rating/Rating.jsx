import React from "react";
import { IoMdStarOutline, IoMdStar, IoMdStarHalf } from "react-icons/io";

const Rating = ({ rating = 0 }) => {
  const renderRatingStars = (rating) => {
    if (rating === 0) {
      return Array(5)
        .fill()
        .map((_, index) => <IoMdStarOutline key={index} />);
    }

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<IoMdStar key={i} />);
    }

    if (hasHalfStar) {
      stars.push(<IoMdStarHalf key={fullStars} />);
    }

    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <IoMdStarOutline key={fullStars + (hasHalfStar ? 1 : 0) + i} />
      );
    }

    return stars;
  };

  return renderRatingStars(rating);
};

export default Rating;
