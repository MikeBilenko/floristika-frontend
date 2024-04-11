import React from "react";
import "./ContactsWrapper.scss";
import ContactInfo from "../ContactInfo/ContactInfo";
import ContactForm from "../ContactForm/ContactForm";

const ContactsWrapper = () => {
  return (
    <div className="contacts-wrapper">
      <ContactInfo />
      <ContactForm />
    </div>
  );
};

export default ContactsWrapper;
