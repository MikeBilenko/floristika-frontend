import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  selectLoading,
  selectError,
  selectToken,
} from "../../redux/slices/authSlice";
import AccountWrapper from "../../components/AccountWrapper/AccountWrapper";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import { MdOutlineKey } from "react-icons/md";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const { t } = useTranslation();
  const [credentials, setCredentials] = useState({
    new_password1: "",
    new_password2: "",
  });
  const [passwordError, setPasswordError] = useState(false); // Add state for password error
  const [passwordConfirmError, setPasswordConfirmError] = useState(false); // Add state for password confirm error
  const token = useSelector(selectToken); // Get access token

  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let error = false;
    if (validatePassword(credentials.new_password1) === false) {
      setPasswordError(true);
      error = true;
    } else {
      setPasswordError(false);
    }
    if (credentials.new_password1 !== credentials.new_password2) {
      setPasswordConfirmError(true);
      error = true;
    } else {
      setPasswordConfirmError(false);
    }
    if (error) return;
    if (!error) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/users/auth/password/change/`,
          credentials,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            setCredentials({
              new_password1: "",
              new_password2: "",
            });
            toast.success(t("messages.success.auth.details"));
          }
        });
    }
  };

  return (
    <AccountWrapper>
      <div className="account-header">
        <MdOutlineKey />
        {t("auth.change_password")}
      </div>
      <form onSubmit={handleSubmit} className="change-password">
        <div className="change-password-wrapper">
          <Input
            label={t("auth.new_password")}
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
            label={t("auth.confirm_new_password")}
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
          <Button fullWidth disabled={loading}>
            {t("save")}
          </Button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </form>
    </AccountWrapper>
  );
};

export default ChangePassword;
