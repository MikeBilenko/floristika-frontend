import React, { useState, useEffect } from "react";
import "./Header.scss";
import { IoCloseSharp } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaAngleRight, FaArrowLeftLong } from "react-icons/fa6";

const HeaderMobile = ({ isOpen, onMenu }) => {
  const [selectedItem, setSelectedItem] = useState({});
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/categories/`)
      .then((response) => {
        setCategories(response.data);
      });
  }, []);

  useEffect(() => {
    if (selectedItem.slug) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/categories/${selectedItem.slug}/`
        )
        .then((response) => {
          if (response.status === 200) {
            setTypes(response.data);
          }
        });
    }
  }, [selectedItem]);

  const links = [
    {
      href: "/products/?best-sellers=true",
      className: "",
      text: t("categories.best_sellers"),
      icon: "",
      straight: true,
    },
    {
      href: "/products/?new-in=true",
      className: "",
      text: t("categories.new_in"),
      icon: "",
      straight: true,
    },
    {
      href: "/products/?sale=true",
      className: "sale",
      text: t("categories.sale"),
      icon: "",
      straight: true,
    },
  ];
  return (
    <div
      className={`header-mobile ${isOpen ? "active" : ""}`}
      onClick={() => onMenu(false)}
    >
      <div
        className={`header-mobile-content ${isOpen ? "active" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="header-mobile-content-header">
          {!selectedItem.slug && <img src="/logo.svg" alt="" />}
          {selectedItem.slug && (
            <>
              <FaArrowLeftLong onClick={() => setSelectedItem({})} />
              {i18n.language === "en" && selectedItem.name}
              {i18n.language === "lv" && selectedItem.name_lv}
              {i18n.language === "ru" && selectedItem.name_ru}
            </>
          )}
        </div>
        <div className="header-mobile-content-sections">
          <div className="header-mobile-content-links">
            {categories.length > 0 &&
              categories.map((category) => (
                <span
                  onClick={() => {
                    setSelectedItem(category);
                  }}
                  key={category.slug}
                  className={selectedItem === category.slug ? "active" : ""}
                >
                  {i18n.language === "en" && category.name}
                  {i18n.language === "ru" && category.name_ru}
                  {i18n.language === "lv" && category.name_lv}
                  <FaAngleRight />
                </span>
              ))}
            {links.map((link) => (
              <span
                onClick={() => {
                  setSelectedItem("");
                  onMenu(false);
                  window.history.replaceState({}, "", window.location.href);
                  navigate(link.href);
                  window.location.reload();
                }}
                key={link.text}
                className={link.className}
              >
                {link.text} {link.icon}
              </span>
            ))}
          </div>
          <div
            className={`header-mobile-content-extended ${
              selectedItem.slug ? "active" : ""
            }`}
          >
            {selectedItem.slug && (
              <>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedItem("");
                    onMenu(false);
                    window.history.replaceState({}, "", window.location.href);
                    navigate(`/products/${selectedItem.slug}/`);
                    window.location.reload();
                  }}
                  to={`/products/${selectedItem.slug}/`}
                >
                  {t("categories.view_all").toUpperCase()}
                </Link>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedItem("");
                    onMenu(false);
                    window.history.replaceState({}, "", window.location.href);
                    navigate(
                      `/products/${selectedItem.slug}/?best-sellers=true`
                    );
                    window.location.reload();
                  }}
                  to={`/products/${selectedItem.slug}/?best-sellers=true`}
                >
                  {t("categories.best_sellers").toUpperCase()}
                </Link>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedItem("");
                    onMenu(false);
                    window.history.replaceState({}, "", window.location.href);
                    navigate(`/products/${selectedItem.slug}/?new-in=true`);

                    window.location.reload();
                  }}
                  to={`/products/${selectedItem.slug}/?new-in=true`}
                >
                  {t("categories.new_in").toUpperCase()}
                </Link>
                <Link
                  to={`/products/${selectedItem.slug}/?sale=true`}
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.replaceState({}, "", window.location.href);
                    navigate(`/products/${selectedItem.slug}/?sale=true`);
                    setSelectedItem("");
                    onMenu(false);
                    window.location.reload();
                  }}
                >
                  {t("categories.sale").toUpperCase()}
                </Link>
              </>
            )}
            <div className="header-mobile-content-extended-top-section">
              {t("shop_by.by_type").toUpperCase()}
            </div>
            {types.length > 0 &&
              types.map((type) => (
                <Link
                  key={type.slug}
                  to={`/products/${selectedItem.slug}/${type.slug}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.replaceState({}, "", window.location.href);
                    window.location.reload();
                    navigate(`/products/${selectedItem.slug}/${type.slug}/`, {
                      replace: false,
                    });
                    onMenu(false);
                    setSelectedItem("");
                  }}
                >
                  {i18n.language === "en" && type.name}
                  {i18n.language === "lv" && type.name_lv}
                  {i18n.language === "ru" && type.name_ru}
                </Link>
              ))}
          </div>
        </div>
      </div>
      <div className="header-mobile-close">
        <IoCloseSharp />
      </div>
    </div>
  );
};

export default HeaderMobile;
