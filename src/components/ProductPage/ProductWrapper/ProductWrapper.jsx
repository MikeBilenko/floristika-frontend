import React, { useEffect, useState } from "react";
import "./ProductWrapper.scss";
import Container from "../../Container/Container";
import ProductIntro from "../ProductIntro/ProductIntro";
import ProductReviews from "../ProductReviews/ProductReviews";
import ProductRecomended from "../ProductRecomended/ProductRecomended";
import ProductDescription from "../ProductDescription/ProductDescription";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductWrapper = () => {
  const [product, setProduct] = useState({});
  const { slug } = useParams();

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    axios.get(`${apiUrl}/products/${slug}/`).then((response) => {
      setProduct(response.data);
    });
  }, []);
  return (
    <Container className="product-wrapper">
      {product && (
        <>
          <ProductIntro
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
    </Container>
  );
};

export default ProductWrapper;
