import React from "react";
import "./AuthWrapper.scss";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AuthWrapper = ({ children }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  return (
    <div className="auth-wrapper">
      <div>
        <img src="/logo.svg" alt="" />
      </div>
      <div className="auth-form">
        {(pathname.includes("register") || pathname.includes("login")) && (
          <div className="links">
            <Link
              to={"/accounts/login/"}
              className={pathname.includes("login") && "active"}
            >
              {t("auth.login")}
            </Link>
            <Link
              to={"/accounts/register/"}
              className={pathname.includes("register") && "active"}
            >
              {t("auth.register")}
            </Link>
          </div>
        )}
        {(pathname.includes("register") || pathname.includes("login")) && (
          <h2 className="form-title">{t("auth.welcome_to")} Floristika!</h2>
        )}
        {!(
          pathname.includes("register") ||
          pathname.includes("login") ||
          pathname.includes("verify") ||
          pathname.includes("reset-password-confirm")
        ) && (
          <>
            <h2 className="form-title">
              {t("auth.reset_password").toUpperCase()}
            </h2>
            <p>{t("auth.reset_password_text")}</p>
          </>
        )}
        {pathname.includes("reset-password-confirm") && (
          <>
            <h2 className="form-title">
              {t("auth.reset_password").toUpperCase()}
            </h2>
            <p>{t("auth.reset_password_text_confirm")}</p>
          </>
        )}
        {pathname.includes("verify") && (
          <>
            <h2 className="form-title">
              {t("auth.verify_title").toUpperCase()}
            </h2>
          </>
        )}

        <div className="form-control-wrapper">{children}</div>
      </div>
    </div>
  );
};

export default AuthWrapper;
