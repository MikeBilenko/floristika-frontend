import React from "react";
import "./Carousel.scss";

const Carousel = ({ children, currentSlide }) => {
  return (
    <>
      <div className="carousel">
        {children.map((slide, index) => (
          <div
            className="carousel__slide"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            key={index}
          >
            {slide}
          </div>
        ))}
      </div>
    </>
  );
};

export default Carousel;
