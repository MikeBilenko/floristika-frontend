import React from "react";
import "./Advertisement.scss";
import Container from "../../Container/Container";
import Button from "../../../ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../../../redux/slices/authSlice";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Advertisement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  return (
    !user && (
      <Container className="advert-wrapper">
        <div className="advertisement">
          <img src="./Advertisement/advertisement.png" alt="advertisement" />
          <div className="advertisement-text">
            <h1 className="advertisement-title">{t("addrevrtisement.text")}</h1>

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
