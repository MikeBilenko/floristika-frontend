import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectLoading, selectUser } from "../../redux/slices/authSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthWrapper from "../../components/AuthPages/AuthWrapper/AuthWrapper";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";

function ResetPasswordConfirm() {
  const { t } = useTranslation();
  const { uid, token } = useParams();
  const [credentials, setCredentials] = useState({
    new_password1: "",
    new_password2: "",
    token: token,
    uid: uid,
  });
  const [passwordError, setPasswordError] = useState(false);
  const [passwordConfirmError, setPasswordConfirmError] = useState(false);
  const [clicked, setClicked] = useState(false);
  const isAuthenticated = useSelector(selectUser);
  const navigate = useNavigate();

  const loading = useSelector(selectLoading);
  const [error, setError] = useState(false);
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = (e) => {
    setError(false);
    e.preventDefault();
    let error_ = false;
    if (validatePassword(credentials.new_password1) === false) {
      setPasswordError(true);
      error_ = true;
    } else {
      setPasswordError(false);
    }
    if (credentials.new_password1 !== credentials.new_password2) {
      setPasswordConfirmError(true);
      error_ = true;
    } else {
      setPasswordConfirmError(false);
    }
    if (error_) return;

    setClicked(true);
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/users/auth/password/reset/confirm/`,
        credentials
      )
      .then((response) => {
        if (response.status === 200) {
          setError(false);
          toast.success(t("messages.success.auth.changed"));
        }
      })
      .catch((e) => {
        setError(true);
        toast.error("Something went wring.");
      });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <AuthWrapper>
      {!clicked && (
        <form onSubmit={handleSubmit}>
          <Input
            label={`${t("auth.new_password")}*`}
            type="password"
            icon="password"
            value={credentials.new_password1}
            onChange={(e) =>
              setCredentials((prevCredentials) => {
                return {
                  ...prevCredentials,
                  new_password1: e,
                };
              })
            }
            error={passwordError}
            error_message={t("messages.errors.auth.password_1")}
          />
          <Input
            label={`${t("auth.confirm_new_password")}*`}
            type="password"
            icon="password"
            value={credentials.new_password2}
            onChange={(e) =>
              setCredentials((prevCredentials) => {
                return {
                  ...prevCredentials,
                  new_password2: e,
                };
              })
            }
            error={passwordConfirmError}
            error_message={t("messages.errors.auth.password_match")}
          />
          <Button fullWidth submit={true} disabled={loading}>
            {loading
              ? `${t("auth.reset_password").toUpperCase()}...`
              : t("auth.reset_password").toUpperCase()}
          </Button>
        </form>
      )}

      {clicked && !error && !loading && (
        <div>
          {t("auth.use_login")}
          <br />
          <Link
            to={"/accounts/login/"}
            style={{
              textAlign: "center",
              fontSize: "18px",
              fontWeight: 700,
              lineHeight: "20px",
              letterSpacing: "0.1px",
            }}
          >
            {t("auth.login")}.
          </Link>
        </div>
      )}
    </AuthWrapper>
  );
}

export default ResetPasswordConfirm;
