import React from "react";
import "./Footer.scss";
import { BiCopyright } from "react-icons/bi";
import Container from "../../components/Container/Container";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

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
              <Link to="policies/delivery-return/">
                {t("policies.delivery_and_returns")}
              </Link>
              <Link to="policies/privacy-policy/">
                {t("policies.privacy_policy")}
              </Link>
              <Link to="policies/terms-conditions/">
                {t("policies.terms_and_conditions")}
              </Link>
            </div>
          </div>
          <div className="footer-container">
            <h3 className="footer-container-title">{t("footer.shop")}</h3>
            <div className="footer-container-links">
              <Link to={`/products/`}>{t("categories.list")}</Link>
              <Link to={`/products/?best-sellers=true`}>
                {t("categories.best_sellers")}
              </Link>
              <Link to={`/products/?new-in=true`}>
                {t("categories.new_in")}
              </Link>
              <Link to={`/products/?sale=true`}>{t("categories.sale")}</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <BiCopyright /> {t("footer.copy")}
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
