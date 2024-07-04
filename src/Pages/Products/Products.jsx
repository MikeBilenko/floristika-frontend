import React, { useState, useEffect } from "react";
import BreadCrumbs from "../../components/BreadCrumbs/BreadCrumbs";
import ProductsWrapper from "../../components/ProductsWrapper/ProductsWrapper";
import { useParams } from "react-router-dom";
import Loader from "../../Layout/Loader/Loader";

const Products = () => {
  const { category, subcategory } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoadingComplete = () => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
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
      <>
        <BreadCrumbs />
        <ProductsWrapper category={category} type={subcategory} />
      </>
    </>
  );
};

export default Products;
