import React, { useState, useEffect } from "react";
import "./ContactInfo.scss";
import Title from "../../../ui/Title/Title";
import { LuPhone } from "react-icons/lu";
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
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/contacts/info/`)
      .then((response) => {
        setInfo(response.data);
      });
  }, []);
  return (
    <div className="contact-info">
      <Title>Our Contacts</Title>
      <p className="description">
        We are always delighted to answer questions about our artificial flowers
        and other products.
      </p>
      <ul className="contact-info-list">
        <li>
          <CiPhone />
          <div className="info">
            <div className="info-title">Call us</div>
            <div className="data">{info && info.phone}</div>
          </div>
        </li>
        <li>
          <CiMail />
          <div className="info">
            <div className="info-title">Write us</div>
            <div className="data">{info && info.email}</div>
          </div>
        </li>
        <li>
          <CiLocationOn />
          <div className="info">
            <div className="info-title">Our address</div>
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
            <div className="info-title">Working hours</div>
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
            <div className="info-title">Company details</div>
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
