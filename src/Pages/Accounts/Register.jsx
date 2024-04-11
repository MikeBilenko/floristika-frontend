import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  register,
  selectLoading,
  selectError,
  selectUser,
} from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import AuthWrapper from "../../components/AuthPages/AuthWrapper/AuthWrapper";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";

function Register() {
  const { t } = useTranslation();
  const [credentials, setCredentials] = useState({
    email: "",
    password1: "",
    password2: "",
    first_name: "",
    last_name: "",
  });
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
    return passwordRegex.test(password);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const [emailExists, setEmailExists] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordConfirmError, setPasswordConfirmError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectUser);
  const navigate = useNavigate();

  const loading = useSelector(selectLoading);

  const handleSubmit = (e) => {
    e.preventDefault();
    let error = false;
    if (credentials.first_name.length <= 0) {
      setFirstNameError(true);
      error = true;
    } else {
      setFirstNameError(false);
    }
    if (credentials.last_name.length <= 0) {
      setLastNameError(true);
      error = true;
    } else {
      setLastNameError(false);
    }
    if (!validateEmail(credentials.email)) {
      setEmailError(true);
      error = true;
    } else {
      setEmailError(false);
    }
    if (validatePassword(credentials.password1) === false) {
      setPasswordError(true);
      error = true;
    } else {
      setPasswordError(false);
    }
    if (credentials.password2 !== credentials.password1) {
      setPasswordConfirmError(true);
      error = true;
    } else {
      setPasswordConfirmError(false);
    }

    if (error) return;

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/users/auth/registration/`,
        credentials
      )
      .then((response) => {
        setCredentials({
          email: "",
          password1: "",
          password2: "",
          first_name: "",
          last_name: "",
        });
        setEmailError(false);
        setEmailExists(false);
        setPasswordError(false);
        setPasswordConfirmError(false);
        setFirstNameError(false);
        setLastNameError(false);
        toast.success(t("messages.success.auth.register"));
      })
      .catch((e) => {
        if (e.response.data.email && e.response.data.email.length > 0) {
          setEmailExists(true);
        }
      });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <AuthWrapper>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          label={`${t("auth.email")}*`}
          value={credentials.email}
          onChange={(e) =>
            setCredentials((prevCredentials) => {
              return {
                ...prevCredentials,
                email: e,
              };
            })
          }
          error={emailError || emailExists}
          error_message={`${
            emailError ? t("messages.errors.auth.email") : ""
          } ${emailExists ? t("messages.errors.auth.email_exists") : ""}`}
        />
        <Input
          label={`${t("auth.password")}*`}
          type="password"
          icon="password"
          value={credentials.password1}
          onChange={(e) =>
            setCredentials((prevCredentials) => {
              return {
                ...prevCredentials,
                password1: e,
              };
            })
          }
          error={passwordError}
          error_message={t("messages.errors.auth.password_1")}
        />
        <Input
          label={`${t("auth.password_confirm")}*`}
          type="password"
          icon="password"
          value={credentials.password2}
          onChange={(e) =>
            setCredentials((prevCredentials) => {
              return {
                ...prevCredentials,
                password2: e,
              };
            })
          }
          error={passwordConfirmError}
          error_message={t("messages.errors.auth.password_match")}
        />
        <Input
          type="text"
          label={`${t("auth.first_name")}*`}
          value={credentials.first_name}
          onChange={(e) =>
            setCredentials((prevCredentials) => {
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
          value={credentials.last_name}
          onChange={(e) =>
            setCredentials((prevCredentials) => {
              return {
                ...prevCredentials,
                last_name: e,
              };
            })
          }
          error={lastNameError}
          error_message={t("messages.errors.auth.last_name")}
        />
        {/* Username and password input fields */}
        <Button fullWidth submit={true} disabled={loading}>
          {loading
            ? `${t("auth.register").toUpperCase()}...`
            : t("auth.register").toUpperCase()}
        </Button>
      </form>
    </AuthWrapper>
  );
}

export default Register;
