import React from "react";
import { useParams } from "react-router-dom";
import Button from "../../ui/Button/Button";
import AuthWrapper from "../../components/AuthPages/AuthWrapper/AuthWrapper";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const { token } = useParams();
  const { t } = useTranslation();

  const navigate = useNavigate();

  const verify = () => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/users/auth/registration/verify-email/`,
        {
          key: token,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          toast.success(t("messages.success.auth.verify"));
          navigate("/accounts/login/");
        }
      })
      .catch((error) => {
        toast.error("Something went wring.");
      });
  };

  return (
    <AuthWrapper>
      <p>{t("auth.verify_text")}</p>
      <Button fullWidth onClick={verify}>
        {t("auth.verify")}
      </Button>
    </AuthWrapper>
  );
};

export default VerifyEmail;
