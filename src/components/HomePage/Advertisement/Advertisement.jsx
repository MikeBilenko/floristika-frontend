import React from "react";
import "./Advertisement.scss";
import Container from "../../Container/Container";
import Button from "../../../ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { selectToken } from "../../../redux/slices/authSlice";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Advertisement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  return (
    !token && (
      <Container className="floristika-ad-wrapper">
        <div className="floristika-ad">
          <img src="./Advertisement/advertisement.png" alt="floristika-ad" />
          <div className="floristika-ad-text">
            <h1 className="floristika-ad-title">{t("addrevrtisement.text")}</h1>

            <Button
              onClick={() => {
                navigate("/accounts/register/");
              }}
            >
              {t("auth.register")}
            </Button>
          </div>
        </div>
      </Container>
    )
  );
};

export default Advertisement;
