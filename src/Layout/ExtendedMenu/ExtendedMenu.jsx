import React, { useEffect, useState } from "react";
import "./ExtendedMenu.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

const ExtendedMenu = ({
  isVisible,
  selectedItem,
  setSelectedItem,
  setIsVisible,
}) => {
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
  const [image, setImage] = useState("");
  const [imageBestSeller, setImageBestSeller] = useState("");
  const [imageNewIn, setImageNewIn] = useState("");
  const [imageSale, setImageSale] = useState("");
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setTypes([]);

    if (selectedItem) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/categories/${selectedItem}/`)
        .then((response) => {
          if (response.status === 200) {
            setTypes(response.data);
          }
        });
      axios
        .get(`${process.env.REACT_APP_API_URL}/categories/`)
        .then((response) => {
          if (response.status === 200) {
            let _image = response.data.find(
              (item) => item.slug === selectedItem
            ).image;
            setImage(_image);

            let best_image = response.data.find(
              (item) => item.slug === selectedItem
            ).image_best_sellers;
            setImageBestSeller(best_image);
            let sale_image = response.data.find(
              (item) => item.slug === selectedItem
            ).image_sale;
            setImageSale(sale_image);
            let new_image = response.data.find(
              (item) => item.slug === selectedItem
            ).image_new_in;
            setImageNewIn(new_image);
          }
        });
    }
  }, [selectedItem]);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.removeAttribute("style");
    }
  }, [isVisible]);

  return (
    <div
      className={["extended-menu", isVisible ? "active" : ""].join(" ")}
      onClick={() => {
        setIsVisible();
        setSelectedItem("");
      }}
    >
      <div className="extended-wrapper">
        <div
          className="extended-menu-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="menu-types-links">
            <ul className="menu-types-links-list">
              {types.length > 0 &&
                types.map((type) => (
                  <li key={type.slug}>
                    <Link
                      to={`/products/${selectedItem}/${type.slug}/`}
                      onClick={(e) => {
                        e.preventDefault();

                        navigate(`/products/${selectedItem}/${type.slug}/`);
                        setIsVisible();
                        setSelectedItem("");
                        window.location.reload();
                      }}
                    >
                      {i18n.language === "en" && type.name}
                      {i18n.language === "lv" && type.name_lv}
                      {i18n.language === "ru" && type.name_ru}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          {image && (
            <div className="gallary-view">
              <Link
                onClick={() => {
                  setIsVisible();
                  setSelectedItem("");
                  window.location.reload();
                }}
                to={`/products/${selectedItem}/`}
              >
                <picture>
                  <img src={image.image} alt="" />
                  <caption>{t("categories.view_all").toUpperCase()}</caption>
                </picture>
              </Link>
              <Link
                onClick={() => {
                  setIsVisible();
                  setSelectedItem("");
                  window.location.reload();
                }}
                to={`/products/${selectedItem}/?best-sellers=true`}
              >
                <picture>
                  <img src={imageBestSeller.image} alt="" />
                  <caption>
                    {t("categories.best_sellers").toUpperCase()}
                  </caption>
                </picture>
              </Link>
              <Link
                onClick={() => {
                  setIsVisible();
                  setSelectedItem("");
                  window.location.reload();
                }}
                to={`/products/${selectedItem}/?new-in=true`}
              >
                <picture>
                  <img src={imageNewIn.image} alt="" />
                  <caption>{t("categories.new_in").toUpperCase()}</caption>
                </picture>
              </Link>
              <Link
                to={`/products/${selectedItem}/?sale=true`}
                onClick={() => {
                  setIsVisible();
                  setSelectedItem("");
                  window.location.reload();
                }}
              >
                <picture>
                  <img src={imageSale.image} alt="" />
                  <caption>{t("categories.sale").toUpperCase()}</caption>
                </picture>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExtendedMenu;
