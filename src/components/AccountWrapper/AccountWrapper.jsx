import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./AccountWrapper.scss";
import Title from "../../ui/Title/Title";
import { MdOutlineKey } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { selectToken, logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const AccountWrapper = ({ children }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = React.useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/accounts/login/");
      dispatch(logout());
    }
  }, [token]);

  return (
    <div className="account-wrapper">
      <Title>{t("auth.account").toUpperCase()}</Title>
      <div className="account-content">
        <div
          className="account-sidebar-selected"
          onClick={() => setActiveMenu(!activeMenu)}
        >
          <FiMenu className="menu" />
          {pathname.includes("orders") && (
            <>
              <img src="/accounts/icons/orders.svg" alt="" />
              {t("auth.my_orders")}
            </>
          )}
          {pathname.includes("details") && (
            <>
              <img src="/accounts/icons/details.svg" alt="" />
              {t("auth.my_details")}
            </>
          )}
          {pathname.includes("company") && (
            <>
              <img src="/accounts/icons/company.svg" alt="" />
              {t("company.company")}
            </>
          )}
          {pathname.includes("address-book") && (
            <>
              <img src="/accounts/icons/book.svg" alt="" />
              {t("auth.address_book")}
            </>
          )}
          {pathname.includes("change-password") && (
            <>
              <MdOutlineKey />
              {t("auth.change_password")}
            </>
          )}
        </div>

        <div
          className={`accounts-sidebar-mobile ${activeMenu ? "active" : ""}`}
        >
          <Link
            to={"/accounts/account/orders/"}
            className={pathname.includes("orders") ? "active" : ""}
          >
            <img src="/accounts/icons/orders.svg" alt="" />
            {t("auth.my_orders")}
          </Link>
          <Link
            to={"/accounts/account/details/"}
            className={pathname.includes("details") ? "active" : ""}
          >
            <img src="/accounts/icons/details.svg" alt="" />
            {t("auth.my_details")}
          </Link>
          <Link
            to={"/accounts/account/company/"}
            className={pathname.includes("company") ? "active" : ""}
          >
            <img src="/accounts/icons/company.svg" alt="" />
            {t("company.company")}
          </Link>
          <Link
            to={"/accounts/account/address-book/"}
            className={pathname.includes("address-book") ? "active" : ""}
          >
            <img src="/accounts/icons/book.svg" alt="" />
            {t("auth.address_book")}
          </Link>
          <Link
            to={"/accounts/account/change-password/"}
            className={pathname.includes("change-password") ? "active" : ""}
          >
            <MdOutlineKey />
            {t("auth.change_password")}
          </Link>
          <Link to={"/accounts/logout/"}>
            <img src="/accounts/icons/logout.svg" alt="" />
            {t("auth.logout")}
          </Link>
        </div>

        <div className="accounts-sidebar">
          <Link
            to={"/accounts/account/orders/"}
            className={pathname.includes("orders") ? "active" : ""}
          >
            <img src="/accounts/icons/orders.svg" alt="" />
            {t("auth.my_orders")}
          </Link>
          <Link
            to={"/accounts/account/details/"}
            className={pathname.includes("details") ? "active" : ""}
          >
            <img src="/accounts/icons/details.svg" alt="" />
            {t("auth.my_details")}
          </Link>
          <Link
            to={"/accounts/account/company/"}
            className={pathname.includes("company") ? "active" : ""}
          >
            <img src="/accounts/icons/company.svg" alt="" />
            {t("company.company")}
          </Link>
          <Link
            to={"/accounts/account/address-book/"}
            className={pathname.includes("address-book") ? "active" : ""}
          >
            <img src="/accounts/icons/book.svg" alt="" />
            {t("auth.address_book")}
          </Link>
          <Link
            to={"/accounts/account/change-password/"}
            className={pathname.includes("change-password") ? "active" : ""}
          >
            <MdOutlineKey />
            {t("auth.change_password")}
          </Link>
          <Link to={"/accounts/logout/"}>
            <img src="/accounts/icons/logout.svg" alt="" />
            {t("auth.logout")}
          </Link>
        </div>
        <div className="account-container">{children}</div>
      </div>
    </div>
  );
};

export default AccountWrapper;
