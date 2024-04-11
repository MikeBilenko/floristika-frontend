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

const ContactForm = () => {
  const user = useSelector(selectUser);
  const setup = {
    name: user ? `${user.first_name} ${user.last_name}` : "",
    email: user ? user.email : "",
    message: "",
  };
  const [formData, setFormData] = useState(setup);

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

    axios
      .post(`${process.env.REACT_APP_API_URL}/contacts/create/`, {
        ...formData,
      })
      .then((response) => {
        if (response.status === 201) {
          setFormData(setup);
          toast.success("Your contacts saved we will contact you later!");
        }
      });
  };

  return (
    <form onSubmit={formSubmit} action="" className="contact-form">
      <Title>Leave us a message</Title>
      <p className="description">
        Please complete the below form and one of our dedicated faux flower
        experts will get back to you as soon as possible
      </p>
      <div className="form-inputs">
        <Input
          onChange={setName}
          value={formData.name}
          label="Name"
          type="text"
        />
        <Input
          onChange={setEmail}
          value={formData.email}
          label="Email"
          type="email"
        />
        <TextInput
          onChange={setMessage}
          label="Message"
          value={formData.message}
        />
      </div>
      <p className="confirm-message">
        By sending message you agree that the data you submit is processed and
        stored. Read <Link className="link">Privacy Policy</Link>.
      </p>
      <Button fullWidth>Send message</Button>
    </form>
  );
};

export default ContactForm;
