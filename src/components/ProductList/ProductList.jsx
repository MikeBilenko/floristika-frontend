import React from "react";
import Product from "../../ui/Product/Product";
import "./ProductList.scss";
import SubTitle from "../../ui/SubTitle/SubTitle";
import { useTranslation } from "react-i18next";

const ProductList = ({ products, setProducts = null }) => {
  const { t } = useTranslation();
  return (
    <>
      {products.length <= 0 && <SubTitle>{t("product.empty")}</SubTitle>}
      <div className={`product-list ${products.length <= 0 ? "empty" : ""}`}>
        {products &&
          products.length > 0 &&
          products.map((product) => (
            <Product
              product={product}
              key={`product_list_${product.slug}`}
              setProducts={setProducts}
            />
          ))}
      </div>
    </>
  );
};

export default ProductList;
