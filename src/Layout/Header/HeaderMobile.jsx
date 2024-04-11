import React, { useState, useEffect } from "react";
import "./Header.scss";
import { IoCloseSharp } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import { FaAngleRight, FaArrowLeftLong } from "react-icons/fa6";

const HeaderMobile = ({ isOpen, onMenu }) => {
  const [selectedItem, setSelectedItem] = useState({});
  const navigate = useNavigate();
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const user = useSelector(selectUser);
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
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/filters/${selectedItem.slug}/color/list/`
        )
        .then((response) => {
          if (response.status === 200) {
            setColors(response.data);
          }
        });
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/filters/${selectedItem.slug}/size/list/`
        )
        .then((response) => {
          if (response.status === 200) {
            setSizes(response.data);
          }
        });
    }
  }, [selectedItem]);

  const dispatch = useDispatch();

  const links = [
    {
      href: "/products/?best-sellers=true",
      className: "",
      text: "Best sellers",
      icon: "",
      straight: true,
    },
    {
      href: "/products/?new-in=true",
      className: "",
      text: "New in",
      icon: "",
      straight: true,
    },
    {
      href: "/products/?sale=true",
      className: "sale",
      text: "Sale",
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
                  onClick={() => {
                    setSelectedItem("");
                    onMenu(false);
                    window.location.reload();
                  }}
                  to={`/products/${selectedItem.slug}/`}
                >
                  VIEW ALL
                </Link>
                <Link
                  onClick={() => {
                    setSelectedItem("");
                    onMenu(false);
                    window.location.reload();
                  }}
                  to={`/products/${selectedItem.slug}/?best-sellers=true`}
                >
                  BEST SELLERS
                </Link>
                <Link
                  onClick={() => {
                    setSelectedItem("");
                    onMenu(false);
                    window.location.reload();
                  }}
                  to={`/products/${selectedItem.slug}/?new-in=true`}
                >
                  NEW IN
                </Link>
                <Link
                  to={`/products/${selectedItem.slug}/?sale=true`}
                  onClick={() => {
                    setSelectedItem("");
                    onMenu(false);
                    window.location.reload();
                  }}
                >
                  SALE
                </Link>
              </>
            )}
            <div className="header-mobile-content-extended-top-section">
              SHOP BY TYPE
            </div>
            {types.length > 0 &&
              types.map((type) => (
                <Link
                  key={type.slug}
                  to={`/products/${selectedItem.slug}/${type.slug}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.reload();
                    navigate(`/products/${selectedItem.slug}/${type.slug}/`);
                    onMenu(false);
                    setSelectedItem("");
                  }}
                >
                  {type.name}
                </Link>
              ))}
            <div className="header-mobile-content-extended-top-section">
              SHOP BY COLOR
            </div>
            {colors &&
              colors.length > 0 &&
              colors.map((color) => (
                <Link
                  key={color.slug}
                  to={`/products/${selectedItem.slug}/?colors=${color.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(
                      `/products/${selectedItem.slug}/?colors=${color.slug}`
                    );
                    window.location.reload();
                    setSelectedItem("");
                    onMenu(false);
                  }}
                >
                  {color.name}
                </Link>
              ))}
            <div className="header-mobile-content-extended-top-section">
              SHOP BY SIZE
            </div>
            {sizes &&
              sizes.length > 0 &&
              sizes.map((size) => (
                <Link
                  key={size.slug}
                  to={`/products/${selectedItem.slug}/?sizes=${size.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(
                      `/products/${selectedItem.slug}/?sizes=${size.slug}`
                    );
                    setSelectedItem("");
                    onMenu(false);
                    window.location.reload();
                  }}
                >
                  {size.name}
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
