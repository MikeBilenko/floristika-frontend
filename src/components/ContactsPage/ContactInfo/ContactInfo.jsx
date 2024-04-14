import React, { useState, useEffect } from "react";
import "./ContactInfo.scss";
import Title from "../../../ui/Title/Title";
import { useTranslation } from "react-i18next";
import {
  CiMail,
  CiLocationOn,
  CiPhone,
  CiClock1,
  CiHome,
} from "react-icons/ci";
import axios from "axios";

const ContactInfo = () => {
  const [info, setInfo] = useState();
  const { t } = useTranslation();
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/contacts/info/`)
      .then((response) => {
        setInfo(response.data);
      });
  }, []);
  return (
    <div className="contact-info">
      <Title>{t("contacts.contacts")}</Title>
      <p className="description">{t("contacts.text")}</p>
      <ul className="contact-info-list">
        <li>
          <CiPhone />
          <div className="info">
            <div className="info-title">{t("contacts.call_us")}</div>
            <div className="data">{info && info.phone}</div>
          </div>
        </li>
        <li>
          <CiMail />
          <div className="info">
            <div className="info-title">{t("contacts.write_us")}</div>
            <div className="data">{info && info.email}</div>
          </div>
        </li>
        <li>
          <CiLocationOn />
          <div className="info">
            <div className="info-title">{t("contacts.our_address")}</div>
            <div className="data">
              {info &&
                info.address &&
                info.address.map((address, key) => (
                  <span key={address.text}>
                    {address.text}
                    {key < info.address.length - 1 && <br />}
                  </span>
                ))}
            </div>
          </div>
        </li>
        <li>
          <CiClock1 />
          <div className="info">
            <div className="info-title">{t("contacts.working_hours")}</div>
            <div className="data">
              {info &&
                info.working_hours &&
                info.working_hours.map((working_hour, key) => (
                  <span key={working_hour.text}>
                    {working_hour.text}
                    {key < info.working_hours.length - 1 && <br />}
                  </span>
                ))}
            </div>
          </div>
        </li>
        <li>
          <CiHome />
          <div className="info">
            <div className="info-title">{t("contacts.company_details")}</div>
            <div className="data">
              {info &&
                info.details &&
                info.details.map((detail, key) => (
                  <span key={detail.text}>
                    {detail.text}
                    {key < info.details.length - 1 && <br />}
                  </span>
                ))}
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ContactInfo;
