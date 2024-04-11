import React from "react";

import "./ProductGallery.scss";

const ProductGalleryCarousel = ({ children, currentSlide }) => {
  return (
    <div>
      <div className="cart-carousel">
        {children.map((slide, index) => (
          <div
            className="cart-carousel__slide"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            key={index}
          >
            {slide}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGalleryCarousel;
