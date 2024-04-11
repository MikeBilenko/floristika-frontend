import React, { useEffect, useState } from "react";
import AccountWrapper from "../../components/AccountWrapper/AccountWrapper";
import { useDispatch, useSelector } from "react-redux";
import { selectToken } from "../../redux/slices/authSlice";
import axios from "axios";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Details = () => {
  const { t } = useTranslation();
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
  });
  const [errorPhone, setErrorPhone] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const validatePhone = (phone) => {
    const countryCodeRegex = /^\+\d{1,3}\d{8,}$/;
    return countryCodeRegex.test(phone);
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/users/user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 401) {
            navigate("/accounts/login/");
          }
          setUser({
            email: response.data.email,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            phone: response.data.phone,
          });
        });
    }
  }, [token]);

  const submit = (e) => {
    e.preventDefault();
    let error = false;
    if (user.phone.length <= 0 && !validatePhone(user.phone)) {
      setErrorPhone(true);
      error = true;
    } else {
      setErrorPhone(false);
    }
    if (user.first_name.length <= 0) {
      setFirstNameError(true);
      error = true;
    } else {
      setFirstNameError(false);
    }
    if (user.last_name.length <= 0) {
      setLastNameError(true);
      error = true;
    } else {
      setLastNameError(false);
    }
    if (!validateEmail(user.email)) {
      setEmailError(true);
      error = true;
    } else {
      setEmailError(false);
    }

    if (error) return;

    axios
      .put(`${process.env.REACT_APP_API_URL}/users/user/`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setUser({
            email: response.data.email,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            phone: response.data.phone,
          });
          toast.success(t("messages.success.auth.details"));
        }
      });
  };

  return (
    <AccountWrapper>
      <div className="account-header">
        <img src="/accounts/icons/details.svg" />
        {t("auth.my_details")}
      </div>

      {user && (
        <form className="detail-form" onSubmit={submit}>
          <Input
            type="text"
            label={`${t("auth.first_name")}*`}
            value={user.first_name}
            onChange={(e) =>
              setUser((prevCredentials) => {
                return {
                  ...prevCredentials,
                  first_name: e,
                };
              })
            }
            error={firstNameError}
            error_message={t("messages.errors.auth.first_name")}
          />
          <Input
            type="text"
            label={`${t("auth.last_name")}*`}
            value={user.last_name}
            onChange={(e) =>
              setUser((prevCredentials) => {
                return {
                  ...prevCredentials,
                  last_name: e,
                };
              })
            }
            error={lastNameError}
            error_message={t("messages.errors.auth.last_name")}
          />
          <Input
            type="email"
            label={`${t("auth.email")}*`}
            value={user.email}
            placeholder={"example@gmail.com"}
            onChange={(e) =>
              setUser((prevCredentials) => {
                return {
                  ...prevCredentials,
                  email: e,
                };
              })
            }
            error={emailError}
            error_message={t("messages.errors.auth.email")}
          />
          <Input
            type="text"
            label={t("auth.phone_number")}
            placeholder="+37112345678"
            value={user.phone}
            onChange={(e) =>
              setUser((prevCredentials) => {
                return {
                  ...prevCredentials,
                  phone: e,
                };
              })
            }
            error={errorPhone}
            error_message={t("messages.errors.auth.phone_number")}
          />
          <Button submit={true}>{t("save")}</Button>
        </form>
      )}
    </AccountWrapper>
  );
};

export default Details;
