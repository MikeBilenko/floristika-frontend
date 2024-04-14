import React, { useState, useEffect } from "react";
import "./Header.scss";
import Container from "../../components/Container/Container";
import Input from "../../ui/Input/Input";
import { FaChevronDown } from "react-icons/fa";
import { LuUser, LuHeart, LuShoppingCart } from "react-icons/lu";
import { TbBriefcase2 } from "react-icons/tb";
import { MdOutlineInfo } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Button from "../../ui/Button/Button";
import axios from "axios";
import ExtendedMenu from "../ExtendedMenu/ExtendedMenu";
import { selectUser } from "../../redux/slices/authSlice";
import { toggleCart } from "../../redux/slices/cartSlice";
import { FiMenu } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import HeaderMobile from "./HeaderMobile";
import { IoLanguageSharp } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";

const Header = () => {
  const [megaMenu, setMegaMenu] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [activeLang, setActiveLang] = useState(false);
  const [activeMenu, setActiveMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const user = useSelector(selectUser);
  const { t, i18n } = useTranslation();
  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setActiveLang(false);
  };

  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/categories/`)
      .then((response) => {
        setCategories(response.data);
      });
  }, []);

  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const setSearchValue = (searchValue) => {
    setSearch(searchValue);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    if (search.length > 0) {
      navigate(`/search/?search=${search}`);
      window.location.reload();
    }
  };

  const toggleMegaMenu = () => {
    setMegaMenu(!megaMenu);
  };

  useEffect(() => {
    if (megaMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.removeAttribute("style");
    }
  }, [megaMenu]);

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
    <>
      <div
        className="header"
        onClick={() => {
          setActiveLang(false);
          setActiveMenu(false);
        }}
      >
        <Container>
          <div className="top-header">
            <div className="top-header-logo">
              <div
                className="burger-button"
                onClick={() => setMobileMenu(!mobileMenu)}
              >
                <FiMenu />
              </div>
              <Link to={"/"}>
                <img src="/logo.svg" alt="" />
              </Link>
            </div>
            <form onSubmit={submitSearch}>
              <Input
                value={search}
                placeholder={t("search.placeholder")}
                icon="search"
                onChange={setSearchValue}
                type="search"
              />
            </form>

            <div className="top-links">
              <div
                className="language"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveLang(!activeLang);
                  setActiveMenu(false);
                }}
              >
                {i18n.language === "en" && t("languages.english")}
                {i18n.language === "lv" && t("languages.latvian")}
                {i18n.language === "ru" && t("languages.russian")}
                <div
                  className={[
                    "language-dropout-button",
                    activeLang ? "active" : "",
                  ].join(" ")}
                >
                  <FaChevronDown />
                </div>
                <div
                  className={[
                    "language-dropout",
                    activeLang ? "active" : "",
                  ].join(" ")}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div onClick={() => activeLang && handleChangeLanguage("en")}>
                    {t("languages.english")}
                  </div>
                  <div onClick={() => activeLang && handleChangeLanguage("lv")}>
                    {t("languages.latvian")}
                  </div>
                  <div onClick={() => activeLang && handleChangeLanguage("ru")}>
                    {t("languages.russian")}
                  </div>
                </div>
              </div>

              <div className="account-links">
                <div
                  className="search-icon"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <IoIosSearch />
                </div>
                <div className={`search-mobile ${searchOpen ? "active" : ""}`}>
                  <IoCloseSharp onClick={() => setSearchOpen(!searchOpen)} />
                  <form onSubmit={submitSearch}>
                    <Input
                      value={search}
                      placeholder={t("search.placeholder")}
                      icon="search"
                      onChange={setSearchValue}
                      type="search"
                    />
                  </form>
                </div>
                <div
                  className="account-links-user"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveLang(false);
                    setActiveMenu(!activeMenu);
                  }}
                >
                  <LuUser />
                  <div
                    className={[
                      "account-links-user-dropout",
                      activeMenu ? "active" : "",
                      user ? "auth" : "",
                    ].join(" ")}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLang(false);
                      setActiveMenu(false);
                    }}
                  >
                    <div className="account-links-user-dropout-buttons">
                      {user && (
                        <Button
                          small
                          fullWidth
                          uppercase
                          onClick={() => navigate("/accounts/logout/")}
                        >
                          {t("auth.logout")}
                        </Button>
                      )}
                      {!user && (
                        <>
                          <Button
                            small
                            uppercase
                            onClick={() => {
                              navigate("/accounts/login/");
                              setActiveMenu(!activeMenu);
                            }}
                          >
                            {t("auth.login")}
                          </Button>
                          <Button
                            outlined
                            small
                            uppercase
                            onClick={() => {
                              navigate("/accounts/register/");
                              setActiveMenu(!activeMenu);
                            }}
                          >
                            {t("auth.register")}
                          </Button>
                        </>
                      )}
                    </div>
                    {user && (
                      <div className="account-links-user-dropout-links">
                        <div
                          onClick={() => navigate("/accounts/account/details/")}
                        >
                          <LuUser /> {t("auth.my_account")}
                        </div>
                        <div
                          onClick={() => navigate("/accounts/account/orders/")}
                        >
                          <TbBriefcase2 /> {t("auth.my_orders")}
                        </div>
                        <div
                          onClick={() => navigate("/policies/delivery-return/")}
                        >
                          <MdOutlineInfo /> {t("policies.delivery_info")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {user && (
                  <Link to={"/accounts/wishlist/"}>
                    <LuHeart />
                  </Link>
                )}
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(toggleCart());
                  }}
                >
                  <LuShoppingCart />
                </a>
              </div>
            </div>
          </div>

          <div className="divider" />

          <div className="header-links">
            {categories.length > 0 &&
              categories.map((category) => (
                <span
                  onClick={() => {
                    setSelectedItem(category.slug);
                    setMegaMenu(true);
                  }}
                  key={category.slug}
                  className={selectedItem === category.slug ? "active" : ""}
                >
                  {i18n.language === "en" && category.name}
                  {i18n.language === "ru" && category.name_ru}
                  {i18n.language === "lv" && category.name_lv}
                  <FaChevronDown />
                </span>
              ))}
            {links.map((link) => (
              <span
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  setMegaMenu(false);
                  setSelectedItem("");
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
        </Container>
      </div>
      <ExtendedMenu
        selectedItem={selectedItem}
        isVisible={megaMenu}
        setIsVisible={toggleMegaMenu}
        setSelectedItem={setSelectedItem}
      />
      <HeaderMobile isOpen={mobileMenu} onMenu={setMobileMenu} />
      <div
        className={`user-side-menu ${activeMenu ? "active" : ""}`}
        onClick={() => setActiveMenu(false)}
      >
        <div className="user-side-menu-close">
          <IoCloseSharp />
        </div>
        <div
          className="user-side-menu-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="user-side-menu-content-header">
            <LuUser /> {t("auth.account")}
          </div>
          <div className="account-links-user-dropout-buttons">
            {user && (
              <Button
                uppercase
                fullWidth
                onClick={() => navigate("/accounts/logout/")}
              >
                {t("auth.logout")}
              </Button>
            )}
            {!user && (
              <>
                <Button
                  uppercase
                  onClick={() => {
                    navigate("/accounts/login/");
                    setActiveMenu(!activeMenu);
                  }}
                >
                  {t("auth.login")}
                </Button>
                <Button
                  outlined
                  uppercase
                  onClick={() => {
                    navigate("/accounts/register/");
                    setActiveMenu(!activeMenu);
                  }}
                >
                  {t("auth.register")}
                </Button>
              </>
            )}
          </div>
          {user && user.first_name && (
            <div
              className="account-links-user-dropout-links"
              onClick={() => setActiveMenu(false)}
            >
              <div
                onClick={() =>
                  user
                    ? navigate("/accounts/account/details/")
                    : navigate("/accounts/login/")
                }
              >
                <LuUser /> {t("auth.my_account")}
              </div>
              <div
                onClick={() =>
                  user
                    ? navigate("/accounts/account/orders/")
                    : navigate("/accounts/login/")
                }
              >
                <TbBriefcase2 /> {t("auth.my_orders")}
              </div>
              <div onClick={() => navigate("/policies/delivery-return/")}>
                <MdOutlineInfo /> {t("policies.delivery_info")}
              </div>
            </div>
          )}
          <div className="user-side-menu-content-header-language">
            <IoLanguageSharp /> {t("languages.language")}
          </div>
          <div className="languages">
            <div
              className={i18n.language === "en" ? "active" : ""}
              onClick={() => handleChangeLanguage("en")}
            >
              {t("languages.english")}
            </div>
            <div
              className={i18n.language === "lv" ? "active" : ""}
              onClick={() => handleChangeLanguage("lv")}
            >
              {t("languages.latvian")}
            </div>
            <div
              className={i18n.language === "ru" ? "active" : ""}
              onClick={() => handleChangeLanguage("ru")}
            >
              {t("languages.russian")}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
