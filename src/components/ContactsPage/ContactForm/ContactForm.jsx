import React, { useState } from "react";
import "./ContactForm.scss";
import Title from "../../../ui/Title/Title";
import Input from "../../../ui/Input/Input";
import TextInput from "../../../ui/TextInput/TextInput";
import { Link } from "react-router-dom";
import Button from "../../../ui/Button/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/slices/authSlice";
import { useTranslation } from "react-i18next";

const ContactForm = () => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const setup = {
    name: user ? `${user.first_name} ${user.last_name}` : "",
    email: user ? user.email : "",
    message: "",
  };
  const [formData, setFormData] = useState(setup);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [messageError, setMessageError] = useState(false);

  const setName = (name) => {
    setFormData((prevState) => {
      return {
        ...prevState,
        name: name,
      };
    });
  };

  const setEmail = (email) => {
    setFormData((prevState) => {
      return {
        ...prevState,
        email: email,
      };
    });
  };

  const setMessage = (message) => {
    setFormData((prevState) => {
      return {
        ...prevState,
        message: message,
      };
    });
  };

  const formSubmit = (e) => {
    e.preventDefault();
    let error = false;
    if (formData.name.length <= 0) {
      setNameError(true);
      error = true;
    } else {
      setNameError(false);
    }
    if (formData.message.length <= 0) {
      setMessageError(true);
      error = true;
    } else {
      setMessage(false);
    }
    if (!validateEmail(formData.email)) {
      setEmailError(true);
      error = true;
    } else {
      setEmailError(false);
    }
    if (error) return;

    axios
      .post(`${process.env.REACT_APP_API_URL}/contacts/create/`, {
        ...formData,
      })
      .then((response) => {
        if (response.status === 201) {
          setFormData(setup);
          toast.success(t("messages.success.contacts"));
        }
      });
  };

  return (
    <form onSubmit={formSubmit} action="" className="contact-form">
      <Title>{t("contacts.leave_message")}</Title>
      <p className="description">{t("contacts.message_text")}</p>
      <div className="form-inputs">
        <Input
          onChange={setName}
          value={formData.name}
          label="Name"
          type="text"
          error={nameError}
          error_message={t("messages.errors.auth.required")}
        />
        <Input
          onChange={setEmail}
          value={formData.email}
          label="Email"
          type="email"
          error={emailError}
          error_message={t("messages.errors.auth.email")}
        />
        <TextInput
          onChange={setMessage}
          label="Message"
          value={formData.message}
          error={messageError}
          error_message={t("messages.errors.auth.required")}
        />
      </div>
      <p className="confirm-message">
        {t("contacts.sub_text")}{" "}
        <Link className="link" to="policies/privacy-policy/">
          Privacy Policy
        </Link>
        .
      </p>
      <Button fullWidth>{t("contacts.send_message")}</Button>
    </form>
  );
};

export default ContactForm;
