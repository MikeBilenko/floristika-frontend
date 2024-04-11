import React, { useState } from "react";
import "./ProductDescription.scss";
import Carousel from "../../../ui/Carousel/Carousel";
import { useTranslation } from "react-i18next";

const ProductDescription = ({ description, delivery, care }) => {
  const { t, i18n } = useTranslation();
  const [active, setActive] = useState(0);
  return (
    <div className="product-description">
      <div className="product-description-header">
        <div
          className={active === 0 ? "active" : ""}
          onClick={() => setActive(0)}
        >
          {t("product.description")}
        </div>
        <div
          className={active === 1 ? "active" : ""}
          onClick={() => setActive(1)}
        >
          {t("product.delivery_and_return")}
        </div>
        <div
          className={active === 2 ? "active" : ""}
          onClick={() => setActive(2)}
        >
          {t("product.care_instruction")}
        </div>
      </div>

      <Carousel currentSlide={active}>
        <div className="product-description-step">
          {description && (
            <>
              <p>{description.text}</p>
              <ul>
                {description.list.map((item) => (
                  <li key={item.slug}>
                    {i18n.language === "en" && item.text}
                    {i18n.language === "ru" && item.text_ru}
                    {i18n.language === "lv" && item.text_lv}
                  </li>
                ))}
              </ul>
              <p>{description.additional_text}</p>
            </>
          )}
        </div>
        <div className="product-description-step">
          <p>{t("product.delivery.latvian")}</p>
          <p>{t("product.delivery.standart")}</p>
          <div>
            {delivery &&
              delivery.inside_delivery[0].text.map((item, index) => (
                <span let={item.slug}>
                  {i18n.language === "en" && item.text}
                  {i18n.language === "ru" && item.text_ru}
                  {i18n.language === "lv" && item.text_lv}{" "}
                  {delivery.inside_delivery[0].text.length > index && <br />}
                </span>
              ))}
          </div>
          <br />
          <p>{t("product.delivery.internal")}</p>

          {delivery &&
            delivery.internal_delivery[0].text.map((item) => (
              <p key={item.slug}>
                {i18n.language === "en" && item.text}
                {i18n.language === "ru" && item.text_ru}
                {i18n.language === "lv" && item.text_lv}
              </p>
            ))}

          <p>{t("product.delivery.returns")}</p>
          {delivery &&
            delivery.returns[0].text.map((item) => (
              <p key={item.slug}>
                {i18n.language === "en" && item.text}
                {i18n.language === "ru" && item.text_ru}
                {i18n.language === "lv" && item.text_lv}
              </p>
            ))}
        </div>
        <div className="product-description-step">
          {care &&
            care.text.map((care_item) => (
              <p key={care_item.slug}>
                {i18n.language === "en" && care_item.text}
                {i18n.language === "ru" && care_item.text_ru}
                {i18n.language === "lv" && care_item.text_lv}
              </p>
            ))}
        </div>
      </Carousel>
    </div>
  );
};

export default ProductDescription;
