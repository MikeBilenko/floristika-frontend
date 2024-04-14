import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectLoading, selectUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import AuthWrapper from "../../components/AuthPages/AuthWrapper/AuthWrapper";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { t } = useTranslation();
  const [credentials, setCredentials] = useState({
    email: "",
  });
  const [emailError, setEmailError] = useState(false);
  const isAuthenticated = useSelector(selectUser);
  const navigate = useNavigate();

  const loading = useSelector(selectLoading);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!credentials.email.length > 0) {
      setEmailError(true);
      return;
    } else {
      setEmailError(false);
    }
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/users/auth/password/reset/`,
        credentials
      )
      .then((response) => {
        if (response.status === 200) {
          toast.success(t("messages.success.auth.check_email"));
        }
      })
      .catch((error) => {
        toast.error("Something went wrong!");
      });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

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
        <Button fullWidth submit={true} disabled={loading}>
          {loading
            ? `${t("auth.reset_password").toUpperCase()}...`
            : t("auth.reset_password").toUpperCase()}
        </Button>
      </form>
    </AuthWrapper>
  );
};

export default ResetPassword;
