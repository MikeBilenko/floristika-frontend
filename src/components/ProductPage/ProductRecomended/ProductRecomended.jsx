import React from "react";
import "./ProductRecomended.scss";
import Product from "../../../ui/Product/Product";
import { useTranslation } from "react-i18next";

const ProductRecomended = ({ products }) => {
  const { t } = useTranslation();
  if (products && products.length <= 0) return;
  return (
    <div className="product-recomended">
      <div className="product-recomended-title">{t("product.might_like")}</div>
      <div className="product-recomended-content">
        {products &&
          products.map((product) => (
            <Product key={`${product.id}_product`} product={product} />
          ))}
      </div>
    </div>
  );
};

export default ProductRecomended;
