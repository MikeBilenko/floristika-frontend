import React, { useEffect, useState } from "react";
import "./ExtendedMenu.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useTranslation } from "react-i18next";

const ExtendedMenu = ({
  isVisible,
  selectedItem,
  setSelectedItem,
  setIsVisible,
}) => {
  const navigate = useNavigate();
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [types, setTypes] = useState([]);
  const [image, setImage] = useState("");
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setTypes([]);
    setSizes([]);
    setColors([]);

    if (selectedItem) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/categories/${selectedItem}/`)
        .then((response) => {
          if (response.status === 200) {
            setTypes(response.data);
          }
        });
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/filters/${selectedItem}/color/list/`
        )
        .then((response) => {
          if (response.status === 200) {
            setColors(response.data);
          }
        });
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/filters/${selectedItem}/size/list/`
        )
        .then((response) => {
          if (response.status === 200) {
            setSizes(response.data);
          }
        });

      axios
        .get(`${process.env.REACT_APP_API_URL}/categories/`)
        .then((response) => {
          if (response.status === 200) {
            let some_image = response.data.find(
              (item) => item.slug === selectedItem
            ).image;
            setImage(some_image);
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
            <h3 className="menu-types-links-title">{t("shop_by.by_type")}</h3>
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
          <div className="menu-types-links">
            <h3 className="menu-types-links-title">{t("shop_by.by_color")}</h3>
            <ul className="menu-types-links-list">
              {colors.length > 0 &&
                colors.map((color) => (
                  <li key={color.slug}>
                    <Link
                      to={`/products/${selectedItem}/?colors=${color.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(
                          `/products/${selectedItem}/?colors=${color.slug}`
                        );
                        setSelectedItem("");
                        setIsVisible();
                        window.location.reload();
                      }}
                    >
                      {i18n.language === "en" && color.name}
                      {i18n.language === "ru" && color.name_ru}
                      {i18n.language === "lv" && color.name_lv}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          <div className="menu-types-links">
            <h3 className="menu-types-links-title">{t("shop_by.by_size")}</h3>
            <ul className="menu-types-links-list">
              {sizes.length > 0 &&
                sizes.map((size) => (
                  <li key={size.slug}>
                    <Link
                      to={`/products/${selectedItem}/?sizes=${size.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(
                          `/products/${selectedItem}/?sizes=${size.slug}`
                        );
                        setSelectedItem("");
                        setIsVisible();
                        window.location.reload();
                      }}
                    >
                      {i18n.language === "en" && size.name}
                      {i18n.language === "ru" && size.name_ru}
                      {i18n.language === "lv" && size.name_lv}
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
                  <img src={image.image} alt="" />
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
                  <img src={image.image} alt="" />
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
                  <img src={image.image} alt="" />
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
