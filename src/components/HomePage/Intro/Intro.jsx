import React, { useEffect, useState } from "react";
import "./Intro.scss";
import Container from "../../Container/Container";
import Button from "../../../ui/Button/Button";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const Intro = () => {
  const [intro, setIntro] = useState({});
  const { i18n } = useTranslation();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/discounts/intro-discount/`)
      .then((res) => {
        setIntro(res.data);
      });
  }, []);
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success("Code copied to clipboard");
    });
  };
  return (
    <Container className="intro-wrapper">
      {intro.name && (
        <div className="intro">
          <img src={intro.image.image} alt={intro.image.alt} />
          <div className="intro-text">
            <h1 className="intro-title">
              {i18n.language === "en" && intro.description}
              {i18n.language === "lv" && intro.description_lv}
              {i18n.language === "ru" && intro.description_ru}
            </h1>
            <Button onClick={() => handleCopyCode(intro.code)}>
              {intro.code.toUpperCase()}
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Intro;
