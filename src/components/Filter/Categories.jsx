import React, { useEffect, useState } from "react";
import "./Filter.scss";
import axios from "axios";
import { useTranslation } from "react-i18next";
import CategoryItem from "./CategoryItem";

const Categories = ({ active, selectType, selectedType }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${process.env.REACT_APP_API_URL}/categories/`)
      .then(async (response) => {
        let categories = response.data;
        let finalCategories = await Promise.all(
          categories.map(async (category) => {
            let _inCategory = { ...category };
            try {
              const subcategoryResponse = await axios.get(
                `${process.env.REACT_APP_API_URL}/categories/${category.slug}/`
              );
              if (subcategoryResponse.status === 200) {
                _inCategory["subcategories"] = subcategoryResponse.data;
              }
            } catch (error) {
              console.error(
                `Error fetching subcategories for ${category.slug}:`,
                error
              );
            }
            return _inCategory;
          })
        );

        setCategories(finalCategories);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });
  }, []);

  return (
    !loading && (
      <div className={["filter-expanded", active ? "active" : ""].join(" ")}>
        <div className="filter-expanded-header">
          {t("categories.categories")}
        </div>
        {categories.map((item) => (
          <CategoryItem
            key={item.slug}
            category={item}
            selectedType={selectedType}
            selectType={selectType}
          />
        ))}
      </div>
    )
  );
};

export default Categories;
