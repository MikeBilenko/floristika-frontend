import React, { useState, useEffect } from "react";
import "./ProductReviews.scss";
import Title from "../../../ui/Title/Title";
import axios from "axios";
import { selectToken, selectUser } from "../../../redux/slices/authSlice";
import { useSelector } from "react-redux";
import { IoMdStarOutline, IoMdStar } from "react-icons/io";
import TextInput from "../../../ui/TextInput/TextInput";
import Input from "../../../ui/Input/Input";
import Button from "../../../ui/Button/Button";
import { toast } from "react-toastify";
import { LuX } from "react-icons/lu";
import { useTranslation } from "react-i18next";

const ProductReviewCreate = ({ product, open, setOpen }) => {
  const { t } = useTranslation();
  const [rate, setRate] = useState(0);
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const [emailError, setEmailError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [messageError, setMessageError] = useState(false);

  useEffect(() => {
    if (user) {
      setName(`${user.first_name} ${user.last_name}`);
      setEmail(user.email);
    }
  }, [user]);

  const renderRatingStars = (rating) => {
    if (rating === 0) {
      return Array(5)
        .fill()
        .map((_, index) => (
          <IoMdStarOutline onClick={() => setRate(index + 1)} key={index} />
        ));
    }

    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 1; i < fullStars + 1; i++) {
      stars.push(<IoMdStar onClick={() => setRate(i)} key={i} />);
    }

    const remainingStars = 5 - fullStars;
    for (let i = 1; i < remainingStars + 1; i++) {
      stars.push(
        <IoMdStarOutline
          onClick={() => setRate(rating + i)}
          key={fullStars + i}
        />
      );
    }

    return stars;
  };

  const submit = (e) => {
    e.preventDefault();
    let error = false;
    if (name.length <= 0) {
      setNameError(true);
      error = true;
    } else {
      setNameError(false);
    }
    if (!validateEmail(email)) {
      setEmailError(true);
      error = true;
    } else {
      setEmailError(false);
    }
    if (text.length <= 0) {
      setMessageError(true);
      error = true;
    } else {
      setMessageError(false);
    }

    if (error) return;

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/reviews/create/`,
        {
          name,
          email,
          text,
          rate,
          product,
        },
        token && {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        toast.success(t("messages.success.reviews.add"));
        setOpen(false);
        window.location.reload();
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.removeAttribute("style");
    }
  }, [open]);

  return (
    <div
      className={`product-review-create ${open ? "active" : ""}`}
      onClick={() => setOpen(false)}
    >
      <form
        className="product-review-create-content"
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="product-review-create-content-header">
          <Title>{t("reviews.write_a_review").toUpperCase()}</Title>
          <LuX onClick={() => setOpen(false)} />
        </div>
        <div>
          <div className="rating-label">{t("reviews.rate")}</div>
          <div className="star-rating">{renderRatingStars(rate)}</div>
        </div>
        <TextInput
          value={text}
          onChange={(e) => setText(e)}
          label={t("reviews.tell_us_more")}
          error={messageError}
          error_message={t("messages.errors.auth.required")}
        />
        <div className="product-review-create-content-inputs">
          <Input
            value={name}
            onChange={(e) => setName(e)}
            type="text"
            label={t("reviews.name")}
            error={nameError}
            error_message={t("messages.errors.auth.required")}
          />

          <Input
            type="email"
            label={t("reviews.email")}
            value={email}
            onChange={(e) => setEmail(e)}
            error={emailError}
            error_message={t("messages.errors.auth.email")}
          />
        </div>
        <div className="product-review-create-content-buttons">
          <Button
            outlined
            type="button"
            onClick={() => {
              setText("");
              setEmail("");
              setRate(0);
              setName("");
              setOpen(false);
            }}
          >
            {t("buttons.cancel")}
          </Button>
          <Button submit={true}>{t("buttons.submit")}</Button>
        </div>
      </form>
    </div>
  );
};

export default ProductReviewCreate;
