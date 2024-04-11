import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setUser,
  selectLoading,
  selectError,
  selectUser,
} from "../../redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import AuthWrapper from "../../components/AuthPages/AuthWrapper/AuthWrapper";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const { t } = useTranslation();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectUser);
  const navigate = useNavigate();

  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const handleSubmit = (e) => {
    e.preventDefault();
    let error = false;
    if (!credentials.email) {
      error = true;
      setEmailError(true);
    } else {
      setEmailError(false);
    }
    if (!credentials.password) {
      error = true;
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
    if (error) return;

    axios
      .post(`${process.env.REACT_APP_API_URL}/users/auth/login/`, credentials)
      .then((response) => {
        dispatch(setUser(response.data));
        toast.success(t("messages.success.auth.logged_in"));
      })
      .catch((e) => {
        toast.error(t("messages.errors.auth.login_credentials"));
      });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/accounts/account/details/");
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
          error={emailError}
          error_message={t("messages.errors.auth.required")}
        />
        <Input
          label={`${t("auth.password")}*`}
          type="password"
          icon="password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials((prevCredentials) => {
              return {
                ...prevCredentials,
                password: e,
              };
            })
          }
          error={passwordError}
          error_message={t("messages.errors.auth.required")}
        />
        <Link to={"/accounts/reset-password/"} className="password-forgot">
          {t("auth.forgot_password")}{" "}
        </Link>
        <Button fullWidth submit={true} disabled={loading}>
          {loading
            ? `${t("auth.login").toUpperCase()}...`
            : t("auth.login").toUpperCase()}
        </Button>
      </form>
    </AuthWrapper>
  );
}

export default Login;
