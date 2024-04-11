import React, { useState } from "react";
import "./ProductGallery.scss";
import ProductGalleryCarousel from "./ProductGalleryCarousel";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const ProductGallery = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    images && (
      <div className="product-gallery">
        {images.length > 1 && (
          <div className="product-gallery-select">
            {images.map((image, index) => (
              <div
                key={image.image}
                className={index === currentSlide && "active"}
                onClick={() => setCurrentSlide(index)}
              >
                <img src={image.image} alt={image.alt} />
              </div>
            ))}
          </div>
        )}
        <div className="product-gallery-main">
          {images && (
            <ProductGalleryCarousel currentSlide={currentSlide}>
              {images.map((image) => (
                <img
                  key={image.image}
                  src={image.image}
                  className="product-gallery-main-img"
                  alt={image.alt}
                />
              ))}
            </ProductGalleryCarousel>
          )}
          {images.length > 1 && (
            <div className="product-gallery-main-buttons">
              <div
                onClick={() =>
                  currentSlide > 0 && setCurrentSlide(currentSlide - 1)
                }
              >
                <FaAngleLeft />
              </div>
              <div
                onClick={() =>
                  currentSlide < images.length - 1 &&
                  setCurrentSlide(currentSlide + 1)
                }
              >
                <FaAngleRight />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default ProductGallery;
