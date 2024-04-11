import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  selectError,
  selectLoading,
  selectEmailVerification,
} from "../../redux/slices/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { verifyEmail } from "../../redux/slices/authSlice";
import Button from "../../ui/Button/Button";
import AuthWrapper from "../../components/AuthPages/AuthWrapper/AuthWrapper";

const VerifyEmail = () => {
  const { token } = useParams();

  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const [verifiedEmail, setVerifiedEmail] = useState(false);

  const verify = () => {
    dispatch(verifyEmail(token));
    setVerifiedEmail(true);
  };

  return (
    <AuthWrapper>
      {!verifiedEmail && (
        <>
          <p>Please verify your email address by clicking the button below.</p>
          <Button fullWidth onClick={verify}>
            Verify
          </Button>
        </>
      )}
      {verifiedEmail && error && !loading && (
        <div>
          Thanks for verifying! Use link bellow to login.
          <br />
          <Link to={"/accounts/login/"}>Login.</Link>
        </div>
      )}
    </AuthWrapper>
  );
};

export default VerifyEmail;
