import React, { useEffect, useState } from "react";
import "./ExtendedMenu.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

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
            <h3 className="menu-types-links-title">Shop By Type</h3>
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
                      {type.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          <div className="menu-types-links">
            <h3 className="menu-types-links-title">Shop By Color</h3>
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
                      {color.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          <div className="menu-types-links">
            <h3 className="menu-types-links-title">Shop By Size</h3>
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
                      {size.name}
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
                  <caption>VIEW ALL FLOWERS</caption>
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
                  <caption>BEST SELLERS</caption>
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
                  <caption>NEW IN</caption>
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
                  <caption>SALE</caption>
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
