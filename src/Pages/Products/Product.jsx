import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BreadCrumbs from "../../components/BreadCrumbs/BreadCrumbs";
import ProductIntro from "../../components/ProductPage/ProductIntro/ProductIntro";
import ProductDescription from "../../components/ProductPage/ProductDescription/ProductDescription";
import ProductRecomended from "../../components/ProductPage/ProductRecomended/ProductRecomended";
import ProductReviews from "../../components/ProductPage/ProductReviews/ProductReviews";
import axios from "axios";
import Loader from "../../Layout/Loader/Loader";

const Product = () => {
  const [product, setProduct] = useState({});
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/${slug}/`)
      .then((response) => {
        setProduct(response.data);
      });
  }, [slug]);

  useEffect(() => {
    const handleLoadingComplete = () => {
      setTimeout(() => {
        setLoading(false);
      }, [500]);
    };

    if (document.readyState === "complete") {
      handleLoadingComplete();
    } else {
      const handleLoad = () => {
        handleLoadingComplete();
        window.removeEventListener("load", handleLoad);
      };
      window.addEventListener("load", handleLoad);
    }

    return () => {
      document.body.removeAttribute("style");
    };
  }, []);

  return (
    <>
      <Loader loading={loading} />

      {!loading && (
        <div>
          <BreadCrumbs />
          {product && (
            <>
              <ProductIntro
                product={product}
                images={product.images}
                name={product.name}
                name_lv={product.name_lv}
                name_ru={product.name_ru}
                slug={product.slug}
                qty={product.qty}
                rate={product.rate}
                price={product.price}
                reviews={product.reviews}
              />
              <ProductDescription
                description={product.description}
                delivery={product.delivery}
                care={product.care}
              />
              <ProductRecomended products={product.related_products} />
              <ProductReviews product={product.slug} rate={product.rate} />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Product;
