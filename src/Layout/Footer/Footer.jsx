import React, { useEffect, useState } from "react";
import "./Footer.scss";
import { BiCopyright } from "react-icons/bi";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaTiktok,
} from "react-icons/fa";
import Container from "../../components/Container/Container";
import { Link } from "react-router-dom";
// import { Routes } from '../../Routes';
import axios from "axios";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/categories/`)
      .then((response) => {
        if (response.status === 200) {
          setCategories(response.data);
        }
      });
  }, []);

  return (
    <footer className="footer">
      <Container>
        <div className="footer-top">
          <div className="footer-text">
            <img src="/logo-white.svg" alt="white logo" />
            <p>{t("footer.text")}</p>
          </div>
          <div className="footer-container">
            <h3 className="footer-container-title">{t("footer.more_info")}</h3>

            <div className="footer-container-links">
              <Link to={"contacts/"}>{t("contacts.contacts")}</Link>
              <Link to="">{t("policies.delivery_and_returns")}</Link>
              <Link to="">{t("policies.privacy_policy")}</Link>
              <Link to="">{t("policies.terms_and_conditions")}</Link>
            </div>
          </div>
          <div className="footer-container">
            <h3 className="footer-container-title">{t("footer.shop")}</h3>
            <div className="footer-container-links">
              {categories.map((category) => (
                <Link
                  to={`/products/${category.slug}/`}
                  key={`footer_${category.slug}`}
                >
                  {i18n.language === "en" && category.name}
                  {i18n.language === "ru" && category.name_ru}
                  {i18n.language === "lv" && category.name_lv}
                </Link>
              ))}
              <Link to={`/products/?best-sellers=true`}>
                {t("categories.best_sellers")}
              </Link>
              <Link to={`/products/?new-in=true`}>
                {t("categories.new_in")}
              </Link>
              <Link to={`/products/?sale=true`}>{t("categories.sale")}</Link>
            </div>
          </div>
          {/* <div className="footer-container">
            <h3 className="footer-container-title">SOCIAL</h3>
            <div className="footer-container-socials">
              <a href="">
                <FaFacebookF />
              </a>
              <a href="">
                <FaInstagram />
              </a>
              <a href="">
                <FaPinterestP />
              </a>
              <a href="">
                <FaTiktok />
              </a>
            </div>
          </div> */}
        </div>
        <div className="footer-bottom">
          <BiCopyright /> {t("footer.copy")}
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
